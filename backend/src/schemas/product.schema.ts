import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export enum AllergenType {
  GLUTEN = 'gluten',
  DAIRY = 'dairy',
  EGGS = 'eggs',
  FISH = 'fish',
  SHELLFISH = 'shellfish',
  TREE_NUTS = 'tree_nuts',
  PEANUTS = 'peanuts',
  WHEAT = 'wheat',
  SOYBEANS = 'soybeans',
  SESAME = 'sesame',
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
export class Product {
  @Prop({ required: true, ref: 'Business', type: Types.ObjectId })
  business: Types.ObjectId;

  @Prop({ required: true, ref: 'Category', type: Types.ObjectId })
  category: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  owner: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  discountedPrice: number;

  @Prop()
  image: string;

  @Prop()
  imagePublicId: string;

  @Prop({ type: [String], enum: AllergenType, default: [] })
  allergens: AllergenType[];

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ min: 0 })
  stockCount: number;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isVegetarian: boolean;

  @Prop({ default: false })
  isVegan: boolean;

  @Prop({ default: false })
  isGlutenFree: boolean;

  @Prop({ default: false })
  isSpicy: boolean;

  @Prop({ trim: true })
  preparationTime: string;

  @Prop({ trim: true })
  calories: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  viewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ business: 1, category: 1, order: 1 });
ProductSchema.index({ business: 1, isActive: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ owner: 1 });
ProductSchema.index({ isFeatured: 1 });
