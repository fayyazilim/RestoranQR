import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as Iyzipay from 'iyzipay';
import { v4 as uuidv4 } from 'uuid';

import {
  Payment,
  PaymentDocument,
  PaymentStatus,
  PaymentType,
} from '../../schemas/payment.schema';
import {
  Subscription,
  SubscriptionDocument,
  SubscriptionStatus,
  SubscriptionPlan,
} from '../../schemas/subscription.schema';
import { Business, BusinessDocument, BusinessStatus } from '../../schemas/business.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

// ─── Plan Fiyatları (TRY) ─────────────────────────────────────────────────────
const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 0,
  [SubscriptionPlan.STARTER]: 199,
  [SubscriptionPlan.PROFESSIONAL]: 399,
  [SubscriptionPlan.ENTERPRISE]: 799,
};

// ─── Plan Süreleri (gün) ──────────────────────────────────────────────────────
const PLAN_DURATIONS_DAYS: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 365,
  [SubscriptionPlan.STARTER]: 30,
  [SubscriptionPlan.PROFESSIONAL]: 30,
  [SubscriptionPlan.ENTERPRISE]: 30,
};

@Injectable()
export class PaymentService {
  private readonly iyzipay: any;

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Business.name) private readonly businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    this.iyzipay = new Iyzipay({
      apiKey: this.configService.get<string>('IYZICO_API_KEY') || 'sandbox-api-key',
      secretKey: this.configService.get<string>('IYZICO_SECRET_KEY') || 'sandbox-secret-key',
      uri:
        this.configService.get<string>('IYZICO_BASE_URL') ||
        'https://sandbox-api.iyzipay.com',
    });
  }

  // ─── Ödeme Başlatma ────────────────────────────────────────────────────────
  async initializePayment(
    userId: string,
    dto: CreatePaymentDto,
  ): Promise<{ checkoutFormContent: string; token: string }> {
    const business = await this.businessModel.findById(dto.businessId);
    if (!business) {
      throw new NotFoundException('İşletme bulunamadı.');
    }
    if (business.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işletme size ait değil.');
    }

    const price = PLAN_PRICES[dto.plan];
    if (price === undefined) {
      throw new BadRequestException('Geçersiz abonelik planı.');
    }

    const conversationId = uuidv4();
    const appUrl =
      this.configService.get<string>('APP_URL') ?? 'http://localhost:3001';
    const callbackUrl = `${appUrl}/api/payments/callback`;

    // 1. Pending ödeme kaydı oluştur
    const pendingPayment = await this.paymentModel.create({
      user: new Types.ObjectId(userId),
      business: new Types.ObjectId(dto.businessId),
      amount: price,
      currency: 'TRY',
      status: PaymentStatus.PENDING,
      type: PaymentType.SUBSCRIPTION,
      description: `${dto.plan} Plan Aboneliği`,
      iyzicoConversationId: conversationId,
    });

    // 2. iyzico checkout form isteği
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: price.toFixed(2),
      paidPrice: price.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: pendingPayment._id.toString(),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl,
      enabledInstallments: ['1', '2', '3', '6', '9'],
      buyer: {
        id: userId,
        name: dto.buyerName.split(' ').slice(0, -1).join(' ') || dto.buyerName,
        surname: dto.buyerName.split(' ').slice(-1)[0] || dto.buyerName,
        gsmNumber: `+90${dto.buyerPhone.replace(/^0/, '')}`,
        email: dto.buyerEmail,
        identityNumber: dto.buyerIdentityNumber,
        registrationAddress: dto.buyerAddress,
        ip: '85.34.78.112',
        city: dto.buyerCity,
        country: dto.buyerCountry ?? 'Turkey',
        zipCode: dto.buyerZipCode ?? '34000',
      },
      shippingAddress: {
        contactName: dto.buyerName,
        city: dto.buyerCity,
        country: dto.buyerCountry ?? 'Turkey',
        address: dto.buyerAddress,
        zipCode: dto.buyerZipCode ?? '34000',
      },
      billingAddress: {
        contactName: dto.buyerName,
        city: dto.buyerCity,
        country: dto.buyerCountry ?? 'Turkey',
        address: dto.buyerAddress,
        zipCode: dto.buyerZipCode ?? '34000',
      },
      basketItems: [
        {
          id: dto.plan,
          name: `RestoranQR ${dto.plan} Aboneliği`,
          category1: 'SaaS',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: price.toFixed(2),
        },
      ],
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(request, (err: Error, result: any) => {
        if (err) {
          return reject(new BadRequestException(`iyzico hatası: ${err.message}`));
        }

        if (result.status !== 'success') {
          return reject(
            new BadRequestException(
              `iyzico ödeme başlatılamadı: ${result.errorMessage ?? 'Bilinmeyen hata'}`,
            ),
          );
        }

        // Token'ı kaydet
        pendingPayment.iyzicoToken = result.token;
        pendingPayment.save();

        resolve({
          checkoutFormContent: result.checkoutFormContent,
          token: result.token,
        });
      });
    });
  }

  // ─── Callback İşleme ───────────────────────────────────────────────────────
  async handleCallback(token: string): Promise<{ success: boolean; message: string }> {
    const result = await new Promise<any>((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve({ locale: Iyzipay.LOCALE.TR, token }, (err: Error, res: any) => {
        if (err) return reject(new BadRequestException(err.message));
        resolve(res);
      });
    });

    const payment = await this.paymentModel.findOne({
      iyzicoConversationId: result.conversationId,
    });

    if (!payment) {
      throw new NotFoundException('Ödeme kaydı bulunamadı.');
    }

    const isSuccess =
      result.status === 'success' && result.paymentStatus === 'SUCCESS';

    payment.status = isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILURE;
    payment.iyzicoPaymentId = result.paymentId ?? null;
    payment.iyzicoCallbackData = result;
    if (!isSuccess) {
      payment.errorCode = result.errorCode;
      payment.errorMessage = result.errorMessage;
    }
    await payment.save();

    if (!isSuccess) {
      return { success: false, message: result.errorMessage ?? 'Ödeme başarısız.' };
    }

    // ─── Abonelik oluştur / güncelle ────────────────────────────────────────
    const plan = SubscriptionPlan.STARTER;
    const durationDays = PLAN_DURATIONS_DAYS[plan] ?? 30;
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    const subscription = await this.subscriptionModel.findOneAndUpdate(
      { business: payment.business },
      {
        user: payment.user,
        business: payment.business,
        plan,
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
        amount: payment.amount,
      },
      { upsert: true, new: true },
    );

    payment.subscription = subscription._id as any;
    await payment.save();

    // ─── İşletmeyi yayınla ve aktifleştir ──────────────────────────────────
    await this.businessModel.findByIdAndUpdate(payment.business, {
      isPublished: true,
      status: BusinessStatus.ACTIVE,
      publishedAt: new Date(),
    });

    return { success: true, message: 'Ödeme ve abonelik başarıyla tamamlandı.' };
  }

  // ─── Ödeme Geçmişi ─────────────────────────────────────────────────────────
  async getPaymentHistory(userId: string): Promise<any[]> {
    return this.paymentModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('business', 'name slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  // ─── Abonelik Bilgisi ──────────────────────────────────────────────────────
  async getSubscription(businessId: string): Promise<any> {
    const subscription = await this.subscriptionModel
      .findOne({
        business: new Types.ObjectId(businessId),
        status: SubscriptionStatus.ACTIVE,
      })
      .exec();

    if (!subscription) {
      throw new NotFoundException('Bu işletme için aktif abonelik bulunamadı.');
    }

    return subscription;
  }

  // ─── Abonelik İptali ───────────────────────────────────────────────────────
  async cancelSubscription(
    businessId: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const business = await this.businessModel.findById(businessId);
    if (!business) throw new NotFoundException('İşletme bulunamadı.');

    if (business.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işletme sizin değil.');
    }

    const subscription = await this.subscriptionModel.findOne({
      business: new Types.ObjectId(businessId),
      status: SubscriptionStatus.ACTIVE,
    });

    if (!subscription) {
      throw new NotFoundException('Aktif abonelik bulunamadı.');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    await subscription.save();

    // İşletmeyi pasife al
    await this.businessModel.findByIdAndUpdate(businessId, {
      isPublished: false,
      status: BusinessStatus.SUSPENDED,
    });

    return { success: true, message: 'Abonelik başarıyla iptal edildi.' };
  }
}
