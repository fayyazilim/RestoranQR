import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

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
export class Category {
  @Prop({ required: true, ref: 'Business', type: Types.ObjectId })
  business: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  owner: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  image: string;

  @Prop()
  imagePublicId: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  icon: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ business: 1, order: 1 });
CategorySchema.index({ business: 1, isActive: 1 });
CategorySchema.index({ owner: 1 });
