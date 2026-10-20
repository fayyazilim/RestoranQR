import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Payment {
  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: Types.ObjectId;

  @Prop({ required: true, ref: 'Business', type: Types.ObjectId })
  business: Types.ObjectId;

  @Prop({ ref: 'Subscription', type: Types.ObjectId })
  subscription: Types.ObjectId;

  @Prop({ required: true, default: PaymentStatus.PENDING, enum: PaymentStatus })
  status: PaymentStatus;

  @Prop({ required: true, default: PaymentType.SUBSCRIPTION, enum: PaymentType })
  type: PaymentType;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop()
  description: string;

  // iyzico fields
  @Prop()
  iyzicoConversationId: string;

  @Prop()
  iyzicoToken: string;

  @Prop()
  iyzicoPaymentId: string;

  @Prop()
  iyzicoPaymentTransactionId: string;

  @Prop()
  iyzicoMerchantSignature: string;

  @Prop({ type: Object })
  iyzicoCallbackData: Record<string, any>;

  @Prop({ type: Object })
  iyzicoPaymentDetails: Record<string, any>;

  @Prop()
  errorCode: string;

  @Prop()
  errorMessage: string;

  @Prop()
  refundedAt: Date;

  @Prop()
  refundAmount: number;

  @Prop({ type: Object })
  buyerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    identityNumber: string;
  };

  @Prop({ type: Object })
  cardInfo: {
    cardFamily: string;
    cardAssociation: string;
    cardType: string;
    lastFourDigits: string;
    binNumber: string;
  };
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ user: 1 });
PaymentSchema.index({ business: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ iyzicoConversationId: 1 });
PaymentSchema.index({ iyzicoToken: 1 });
PaymentSchema.index({ createdAt: -1 });
