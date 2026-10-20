import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { Business, BusinessDocument } from '../../schemas/business.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoryDto } from './dto/reorder-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
  ) {}

  /**
   * Yeni kategori oluşturur.
   * Sadece işletme sahibi kategori ekleyebilir.
   */
  async create(userId: string, dto: CreateCategoryDto): Promise<CategoryDocument> {
    let businessId = dto.businessId;
    if (!businessId) {
      const ownerId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
      const business = await this.businessModel.findOne({ owner: ownerId }).exec();
      if (!business) {
        throw new NotFoundException('Önce işletme bilgilerinizi kaydetmelisiniz.');
      }
      businessId = (business as any)._id.toString();
    } else {
      await this.verifyBusinessOwnership(businessId, userId);
    }

    const category = new this.categoryModel({
      ...dto,
      owner: new Types.ObjectId(userId),
      business: new Types.ObjectId(businessId),
      isActive: true,
    });

    return category.save();
  }

  /**
   * Belirli bir işletmenin tüm kategorilerini sıraya göre döner. (Public)
   */
  async findAll(businessId: string): Promise<CategoryDocument[]> {
    if (!Types.ObjectId.isValid(businessId)) {
      return [];
    }

    return this.categoryModel
      .find({ business: new Types.ObjectId(businessId) })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }

  /**
   * Belirli bir kategorinin detayını getirir.
   * Owner kontrolü yapar.
   */
  async findOne(id: string, userId: string): Promise<CategoryDocument> {
    const category = await this.findById(id);
    await this.verifyBusinessOwnership(category.business.toString(), userId);
    return category;
  }

  /**
   * Kategoriyi günceller. Sadece işletme sahibi güncelleyebilir.
   */
  async update(
    id: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    const category = await this.findById(id);
    await this.verifyBusinessOwnership(category.business.toString(), userId);

    Object.assign(category, dto);
    return category.save();
  }

  /**
   * Kategoriyi siler. Sadece işletme sahibi silebilir.
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const category = await this.findById(id);
    await this.verifyBusinessOwnership(category.business.toString(), userId);

    await this.categoryModel.findByIdAndDelete(id).exec();
    return { message: 'Kategori başarıyla silindi.' };
  }

  /**
   * Drag & drop sıralama için toplu güncelleme yapar.
   * Her item { id, order } içerir.
   */
  async reorder(
    userId: string,
    dto: ReorderCategoryDto,
  ): Promise<{ message: string }> {
    if (!dto.items || dto.items.length === 0) {
      return { message: 'Sıralama listesi boş.' };
    }

    // İlk kategorinin işletmesini alarak owner doğrulaması yap
    const firstCategory = await this.findById(dto.items[0].id);
    await this.verifyBusinessOwnership(firstCategory.business.toString(), userId);

    const bulkOps = dto.items.map((item) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(item.id) },
        update: { $set: { order: item.order } },
      },
    }));

    await this.categoryModel.bulkWrite(bulkOps);
    return { message: 'Kategoriler yeniden sıralandı.' };
  }

  /**
   * Kategorinin aktif/pasif durumunu değiştirir.
   */
  async toggleActive(id: string, userId: string): Promise<CategoryDocument> {
    const category = await this.findById(id);
    await this.verifyBusinessOwnership(category.business.toString(), userId);

    category.isActive = !category.isActive;
    return category.save();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async findById(id: string): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Geçersiz kategori ID.');
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Kategori bulunamadı.');
    }

    return category;
  }

  private async verifyBusinessOwnership(
    businessId: string,
    userId: string,
  ): Promise<BusinessDocument> {
    if (!Types.ObjectId.isValid(businessId)) {
      throw new NotFoundException('Geçersiz işletme ID.');
    }

    const business = await this.businessModel.findById(businessId).exec();
    if (!business) {
      throw new NotFoundException('İşletme bulunamadı.');
    }

    if (business.owner.toString() !== userId.toString()) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }

    return business;
  }
}
