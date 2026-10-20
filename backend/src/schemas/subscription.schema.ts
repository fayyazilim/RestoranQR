import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

export enum SubscriptionPlan {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
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
export class Subscription {
  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: Types.ObjectId;

  @Prop({ required: true, ref: 'Business', type: Types.ObjectId })
  business: Types.ObjectId;

  @Prop({
    required: true,
    default: SubscriptionPlan.FREE,
    enum: SubscriptionPlan,
  })
  plan: SubscriptionPlan;

  @Prop({
    required: true,
    default: SubscriptionStatus.INACTIVE,
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  cancelledAt: Date;

  @Prop()
  iyzicoSubscriptionReferenceCode: string;

  @Prop()
  iyzicoCustomerReferenceCode: string;

  @Prop({ default: false })
  autoRenew: boolean;

  @Prop({ type: Object })
  planFeatures: {
    maxProducts: number;
    maxCategories: number;
    hasQrCode: boolean;
    hasAnalytics: boolean;
    hasCustomDomain: boolean;
    hasPremiumThemes: boolean;
  };
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({ user: 1 });
SubscriptionSchema.index({ business: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ plan: 1 });
SubscriptionSchema.index({ endDate: 1 });
