import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Business, BusinessDocument, BusinessStatus } from '../../schemas/business.schema';
import { Payment, PaymentDocument } from '../../schemas/payment.schema';
import { Subscription, SubscriptionDocument } from '../../schemas/subscription.schema';
import { Theme, ThemeDocument } from '../../schemas/theme.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Theme.name) private themeModel: Model<ThemeDocument>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalBusinesses, activeSubscriptions, payments] = await Promise.all([
      this.userModel.countDocuments(),
      this.businessModel.countDocuments(),
      this.subscriptionModel.countDocuments({ status: 'active' }),
      this.paymentModel.find({ status: 'success' }),
    ]);

    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    const recentPayments = await this.paymentModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('business', 'name slug');

    const topBusinesses = await this.businessModel
      .find({ isPublished: true })
      .sort({ totalViews: -1 })
      .limit(5)
      .populate('owner', 'name email');

    return {
      totalUsers,
      totalBusinesses,
      totalRevenue,
      activeSubscriptions,
      recentPayments,
      topBusinesses,
    };
  }

  async getUsers(page = 1, limit = 10, search?: string) {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.userModel.countDocuments(filter),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getUserDetail(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    const business = await this.businessModel.findOne({ owner: userId });
    const subscription = business
      ? await this.subscriptionModel.findOne({ business: business._id })
      : null;

    return { user, business, subscription };
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    const user = await this.userModel.findByIdAndUpdate(userId, { isActive }, { new: true });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    return user;
  }

  async getBusinesses(page = 1, limit = 10, search?: string, status?: string) {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const [businesses, total] = await Promise.all([
      this.businessModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('owner', 'name email')
        .populate('theme', 'name slug'),
      this.businessModel.countDocuments(filter),
    ]);

    return { businesses, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getBusinessDetail(businessId: string) {
    const business = await this.businessModel
      .findById(businessId)
      .populate('owner', 'name email')
      .populate('theme');

    if (!business) throw new NotFoundException('İşletme bulunamadı');
    const subscription = await this.subscriptionModel.findOne({ business: businessId });

    return { business, subscription };
  }

  async updateBusinessStatus(businessId: string, status: BusinessStatus) {
    const business = await this.businessModel.findByIdAndUpdate(
      businessId,
      { status },
      { new: true },
    );
    if (!business) throw new NotFoundException('İşletme bulunamadı');
    return business;
  }

  async getPayments(page = 1, limit = 10, status?: string) {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
        .populate('business', 'name slug'),
      this.paymentModel.countDocuments(filter),
    ]);

    return { payments, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getSubscriptions(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [subscriptions, total] = await Promise.all([
      this.subscriptionModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
        .populate('business', 'name slug'),
      this.subscriptionModel.countDocuments(),
    ]);

    return { subscriptions, total, page, totalPages: Math.ceil(total / limit) };
  }
}
