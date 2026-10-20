import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Theme, ThemeDocument } from '../../schemas/theme.schema';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemeService implements OnModuleInit {
  constructor(
    @InjectModel(Theme.name) private themeModel: Model<ThemeDocument>,
  ) {}

  async onModuleInit() {
    await this.createDefaultThemes();
  }

  async findAll(): Promise<ThemeDocument[]> {
    return this.themeModel.find({ isActive: true }).sort({ order: 1 });
  }

  async findOne(id: string): Promise<ThemeDocument> {
    const theme = await this.themeModel.findById(id);
    if (!theme) throw new NotFoundException('Tema bulunamadı');
    return theme;
  }

  async findBySlug(slug: string): Promise<ThemeDocument> {
    const theme = await this.themeModel.findOne({ slug, isActive: true });
    if (!theme) throw new NotFoundException('Tema bulunamadı');
    return theme;
  }

  async create(dto: CreateThemeDto): Promise<ThemeDocument> {
    return this.themeModel.create(dto);
  }

  async update(id: string, dto: UpdateThemeDto): Promise<ThemeDocument> {
    const theme = await this.themeModel.findByIdAndUpdate(id, dto, { new: true });
    if (!theme) throw new NotFoundException('Tema bulunamadı');
    return theme;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const theme = await this.themeModel.findByIdAndDelete(id);
    if (!theme) throw new NotFoundException('Tema bulunamadı');
    return { success: true, message: 'Tema silindi' };
  }

  async createDefaultThemes(): Promise<void> {
    const count = await this.themeModel.countDocuments();
    if (count > 0) return;

    const defaultThemes: Partial<Theme>[] = [
      {
        name: 'Minimal',
        slug: 'minimal',
        description: 'Sade, ferah ve modern tipografi ile temiz görünüm',
        colors: {
          light: {
            primary: '#1F4E79',
            secondary: '#F97316',
            accent: '#0284C7',
            background: '#F8FAFC',
            surface: '#FFFFFF',
            text: '#0F172A',
            textSecondary: '#64748B',
            border: '#E2E8F0',
          },
          dark: {
            primary: '#38BDF8',
            secondary: '#FB923C',
            accent: '#0EA5E9',
            background: '#0B0F19',
            surface: '#1E293B',
            text: '#F8FAFC',
            textSecondary: '#94A3B8',
            border: '#334155',
          },
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          baseFontSize: '16px',
          headingWeight: '700',
          bodyWeight: '400',
        },
        layout: {
          borderRadius: '12px',
          cardShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
          spacing: '1rem',
          maxWidth: '640px',
        },
        isActive: true,
        isDefault: true,
        order: 1,
      },
      {
        name: 'Klasik',
        slug: 'klasik',
        description: 'Sıcak tonlar, ahşap ve nostaljik kafe-restoran hissi',
        colors: {
          light: {
            primary: '#78350F',
            secondary: '#D97706',
            accent: '#B45309',
            background: '#FFFBEB',
            surface: '#FFFFFF',
            text: '#451A03',
            textSecondary: '#78350F',
            border: '#FDE68A',
          },
          dark: {
            primary: '#FBBF24',
            secondary: '#F59E0B',
            accent: '#D97706',
            background: '#1C1917',
            surface: '#292524',
            text: '#FEF3C7',
            textSecondary: '#FDE68A',
            border: '#44403C',
          },
        },
        typography: {
          fontFamily: 'Playfair Display, Georgia, serif',
          baseFontSize: '16px',
          headingWeight: '600',
          bodyWeight: '400',
        },
        layout: {
          borderRadius: '8px',
          cardShadow: '0 2px 4px rgba(0,0,0,0.08)',
          spacing: '1rem',
          maxWidth: '640px',
        },
        isActive: true,
        order: 2,
      },
      {
        name: 'Dark Elegance',
        slug: 'dark',
        description: 'Gece kulüpleri, lounge barlar ve lüks mekanlar için koyu tema',
        colors: {
          light: {
            primary: '#18181B',
            secondary: '#E11D48',
            accent: '#F43F5E',
            background: '#F4F4F5',
            surface: '#FFFFFF',
            text: '#09090B',
            textSecondary: '#71717A',
            border: '#E4E4E7',
          },
          dark: {
            primary: '#FAFAFA',
            secondary: '#FB7185',
            accent: '#F43F5E',
            background: '#09090B',
            surface: '#18181B',
            text: '#FAFAFA',
            textSecondary: '#A1A1AA',
            border: '#27272A',
          },
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          baseFontSize: '16px',
          headingWeight: '700',
          bodyWeight: '400',
        },
        layout: {
          borderRadius: '16px',
          cardShadow: '0 8px 16px rgba(0,0,0,0.2)',
          spacing: '1.25rem',
          maxWidth: '640px',
        },
        isActive: true,
        order: 3,
      },
      {
        name: 'Renkli & Enerjik',
        slug: 'renkli',
        description: 'Fast food, tatlıcılar ve dinamik sokak lezzetleri için canlı renkler',
        colors: {
          light: {
            primary: '#DC2626',
            secondary: '#EA580C',
            accent: '#F59E0B',
            background: '#FEF2F2',
            surface: '#FFFFFF',
            text: '#1F2937',
            textSecondary: '#4B5563',
            border: '#FECACA',
          },
          dark: {
            primary: '#F87171',
            secondary: '#FB923C',
            accent: '#FBBF24',
            background: '#1F1414',
            surface: '#2E1919',
            text: '#FEE2E2',
            textSecondary: '#FCA5A5',
            border: '#451A1A',
          },
        },
        typography: {
          fontFamily: 'Poppins, sans-serif',
          baseFontSize: '16px',
          headingWeight: '800',
          bodyWeight: '500',
        },
        layout: {
          borderRadius: '20px',
          cardShadow: '0 6px 12px rgba(234, 88, 12, 0.15)',
          spacing: '1rem',
          maxWidth: '640px',
        },
        isActive: true,
        order: 4,
      },
      {
        name: 'Elegant Gold',
        slug: 'elegant',
        description: 'Fine dining restoranlar için altın varak ve sofistike tasarım',
        colors: {
          light: {
            primary: '#92400E',
            secondary: '#D97706',
            accent: '#CA8A04',
            background: '#FAFAF9',
            surface: '#FFFFFF',
            text: '#1C1917',
            textSecondary: '#57534E',
            border: '#E7E5E4',
          },
          dark: {
            primary: '#FDE047',
            secondary: '#EAB308',
            accent: '#CA8A04',
            background: '#0C0A09',
            surface: '#1C1917',
            text: '#FAF7F2',
            textSecondary: '#A8A29E',
            border: '#292524',
          },
        },
        typography: {
          fontFamily: 'Cormorant Garamond, serif',
          baseFontSize: '17px',
          headingWeight: '600',
          bodyWeight: '400',
        },
        layout: {
          borderRadius: '6px',
          cardShadow: '0 4px 20px rgba(0,0,0,0.06)',
          spacing: '1.25rem',
          maxWidth: '640px',
        },
        isActive: true,
        isPremium: true,
        order: 5,
      },
    ];

    await this.themeModel.insertMany(defaultThemes);
  }
}
