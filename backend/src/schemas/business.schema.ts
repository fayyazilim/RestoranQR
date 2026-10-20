import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BusinessDocument = Business & Document;

export enum BusinessStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export interface WorkingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
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
export class Business {
  @Prop({ required: true, ref: 'User', type: Types.ObjectId, unique: true })
  owner: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  email: string;

  @Prop()
  logo: string;

  @Prop()
  coverImage: string;

  @Prop({ ref: 'Theme', type: Types.ObjectId })
  theme: Types.ObjectId;

  @Prop({ type: Object })
  themeCustomization: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
  };

  @Prop({
    type: [
      {
        day: String,
        open: String,
        close: String,
        isOpen: Boolean,
      },
    ],
    default: [
      { day: 'Pazartesi', open: '09:00', close: '22:00', isOpen: true },
      { day: 'Salı', open: '09:00', close: '22:00', isOpen: true },
      { day: 'Çarşamba', open: '09:00', close: '22:00', isOpen: true },
      { day: 'Perşembe', open: '09:00', close: '22:00', isOpen: true },
      { day: 'Cuma', open: '09:00', close: '23:00', isOpen: true },
      { day: 'Cumartesi', open: '10:00', close: '23:00', isOpen: true },
      { day: 'Pazar', open: '10:00', close: '21:00', isOpen: true },
    ],
  })
  workingHours: WorkingHours[];

  @Prop({ type: Object })
  socialMedia: SocialMedia;

  @Prop({ type: String, trim: true })
  currency: string;

  @Prop({ default: 'TRY' })
  currencySymbol: string;

  @Prop({ default: BusinessStatus.DRAFT, enum: BusinessStatus })
  status: BusinessStatus;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  publishedAt: Date;

  @Prop({ default: 0 })
  totalViews: number;

  @Prop()
  qrCodeUrl: string;

  @Prop()
  qrCodePublicId: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

// Indexes
BusinessSchema.index({ owner: 1 });
BusinessSchema.index({ slug: 1 });
BusinessSchema.index({ status: 1 });
BusinessSchema.index({ isPublished: 1 });
