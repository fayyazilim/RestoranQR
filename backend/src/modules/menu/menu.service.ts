import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from '../../schemas/business.schema';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { Theme, ThemeDocument } from '../../schemas/theme.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Theme.name) private themeModel: Model<ThemeDocument>,
  ) {}

  async getPublicMenu(slug: string) {
    const business = await this.businessModel
      .findOne({ slug, isPublished: true })
      .populate('theme');

    if (!business) {
      throw new NotFoundException('Menü bulunamadı veya henüz yayınlanmamış.');
    }

    // Görüntülenme sayısını artır (background)
    this.businessModel
      .findByIdAndUpdate(business._id, { $inc: { totalViews: 1 } })
      .exec()
      .catch(() => null);

    const categories = await this.categoryModel
      .find({ business: business._id, isActive: true })
      .sort({ order: 1 });

    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await this.productModel
          .find({
            business: business._id,
            category: cat._id,
            isActive: true,
          })
          .sort({ order: 1 });

        return {
          ...cat.toObject(),
          products,
        };
      }),
    );

    let theme = business.theme;
    if (!theme) {
      theme = await this.themeModel.findOne({ isDefault: true });
    }

    return {
      business,
      theme,
      categories: categoriesWithProducts,
    };
  }

  async getMenuMeta(slug: string) {
    const business = await this.businessModel.findOne(
      { slug, isPublished: true },
      'name description logo coverImage status isPublished',
    );

    if (!business) {
      throw new NotFoundException('Menü bulunamadı.');
    }

    return business;
  }
}
