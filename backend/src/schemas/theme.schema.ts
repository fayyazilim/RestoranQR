import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ThemeDocument = Theme & Document;

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeTypography {
  fontFamily: string;
  headingFont?: string;
  baseFontSize: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface ThemeLayout {
  borderRadius: string;
  cardShadow: string;
  spacing: string;
  maxWidth: string;
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
export class Theme {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  thumbnail: string;

  @Prop({ type: Object, required: true })
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };

  @Prop({ type: Object, required: true })
  typography: ThemeTypography;

  @Prop({ type: Object })
  layout: ThemeLayout;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: false })
  isDefault: boolean;

  // CSS variables as JSON for dynamic theming
  @Prop({ type: Object })
  cssVars: Record<string, string>;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);

ThemeSchema.index({ slug: 1 });
ThemeSchema.index({ isActive: 1 });
ThemeSchema.index({ order: 1 });
