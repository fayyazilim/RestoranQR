import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { Business, BusinessDocument } from '../../schemas/business.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    userId: string,
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<ProductDocument> {
    let businessId = dto.businessId;
    if (!businessId) {
      const ownerId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
      const business = await this.businessModel.findOne({ owner: ownerId });
      if (!business) throw new NotFoundException('Önce işletme bilgilerinizi kaydetmelisiniz.');
      businessId = (business as any)._id.toString();
    } else {
      const business = await this.businessModel.findById(businessId);
      if (!business) throw new NotFoundException('İşletme bulunamadı');
      if (business.owner.toString() !== userId) {
        throw new ForbiddenException('Bu işlem için yetkiniz yok');
      }
    }

    const category = await this.categoryModel.findById(dto.categoryId);
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'products');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const lastProduct = await this.productModel
      .findOne({ category: dto.categoryId })
      .sort({ order: -1 });
    const order = lastProduct ? lastProduct.order + 1 : 0;

    return this.productModel.create({
      ...dto,
      owner: new Types.ObjectId(userId),
      business: new Types.ObjectId(businessId),
      category: new Types.ObjectId(dto.categoryId),
      image: imageUrl,
      imagePublicId,
      order,
    });
  }

  async findByBusiness(businessId: string, categoryId?: string): Promise<ProductDocument[]> {
    const filter: any = { business: businessId, isActive: true };
    if (categoryId) {
      filter.category = categoryId;
    }
    return this.productModel.find(filter).sort({ order: 1 }).populate('category');
  }

  async findAllByOwner(userId: string, businessId?: string): Promise<ProductDocument[]> {
    const filter: any = { owner: userId };
    if (businessId) {
      filter.business = businessId;
    }
    return this.productModel.find(filter).sort({ order: 1 }).populate('category');
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).populate('category');
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    return product;
  }

  async update(id: string, userId: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    if (product.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }

    Object.assign(product, dto);
    return product.save();
  }

  async updateImage(id: string, userId: string, file: Express.Multer.File): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    if (product.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }

    if (product.imagePublicId) {
      await this.cloudinaryService.deleteImage(product.imagePublicId).catch(() => null);
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file, 'products');
    product.image = uploadResult.url;
    product.imagePublicId = uploadResult.publicId;
    return product.save();
  }

  async remove(id: string, userId: string): Promise<{ success: boolean; message: string }> {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    if (product.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }

    if (product.imagePublicId) {
      await this.cloudinaryService.deleteImage(product.imagePublicId).catch(() => null);
    }

    await this.productModel.findByIdAndDelete(id);
    return { success: true, message: 'Ürün silindi' };
  }

  async reorder(userId: string, items: { id: string; order: number }[]): Promise<boolean> {
    const operations = items.map((item) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(item.id), owner: new Types.ObjectId(userId) },
        update: { $set: { order: item.order } },
      },
    }));

    await this.productModel.bulkWrite(operations);
    return true;
  }

  async toggleActive(id: string, userId: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    if (product.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }

    product.isActive = !product.isActive;
    return product.save();
  }

  async toggleStock(id: string, userId: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    if (product.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }

    product.inStock = !product.inStock;
    return product.save();
  }
}
