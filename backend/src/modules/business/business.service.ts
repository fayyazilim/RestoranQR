import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Business, BusinessDocument, BusinessStatus } from '../../schemas/business.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * İşletmeyi upsert eder: yoksa oluşturur, varsa günceller.
   * POST /business ve PATCH /business her ikisi de bu metodu kullanır.
   */
  async upsertBusiness(userId: string, dto: CreateBusinessDto): Promise<BusinessDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    const ownerId = new Types.ObjectId(userId);
    const existing = await this.businessModel.findOne({ owner: ownerId }).exec();

    if (existing) {
      // Mevcut işletmeyi güncelle
      const { name, ...rest } = dto;
      if (name) existing.name = name;
      Object.assign(existing, rest);
      return existing.save();
    }

    // Yeni işletme oluştur
    if (!dto.name) {
      throw new BadRequestException('İşletme adı zorunludur.');
    }

    const baseSlug = slugify(dto.name, { lower: true, strict: true, locale: 'tr' });
    const uniqueSuffix = nanoid(6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const business = new this.businessModel({
      ...dto,
      slug,
      owner: ownerId,
      currency: dto.currency ?? 'TRY',
      currencySymbol: dto.currencySymbol ?? '₺',
      status: BusinessStatus.DRAFT,
      isPublished: false,
    });

    return business.save();
  }

  /**
   * @deprecated upsertBusiness kullanın
   */
  async createBusiness(userId: string, dto: CreateBusinessDto): Promise<BusinessDocument> {
    return this.upsertBusiness(userId, dto);
  }

  /**
   * Kullanıcının sahip olduğu işletmeyi döner. Tema bilgisi populate edilir.
   */
  async findByOwner(userId: string): Promise<BusinessDocument> {
    const ownerId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    const business = await this.businessModel
      .findOne({ owner: ownerId })
      .populate('theme')
      .exec();

    if (!business) {
      throw new NotFoundException('İşletme bulunamadı.');
    }

    return business;
  }

  /**
   * Slug ile işletmeyi getirir. Public erişim içindir.
   */
  async findBySlug(slug: string): Promise<BusinessDocument> {
    const business = await this.businessModel
      .findOne({ slug })
      .populate('theme')
      .exec();

    if (!business) {
      throw new NotFoundException('İşletme bulunamadı.');
    }

    return business;
  }

  /**
   * İşletmeyi günceller. Sadece sahibi güncelleyebilir.
   */
  async updateBusiness(
    businessId: string,
    userId: string,
    dto: UpdateBusinessDto,
  ): Promise<BusinessDocument> {
    const business = await this.findAndVerifyOwnership(businessId, userId);

    Object.assign(business, dto);

    if (dto.themeId) {
      (business as any).theme = new Types.ObjectId(dto.themeId);
      delete (business as any).themeId;
    }

    return business.save();
  }

  /**
   * İşletme logosunu Cloudinary'ye yükler ve kaydeder.
   */
  async updateLogo(
    businessId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<BusinessDocument> {
    const business = await this.findAndVerifyOwnership(businessId, userId);

    const result = await this.cloudinaryService.uploadImage(file, 'logos');
    business.logo = result.url;

    return business.save();
  }

  /**
   * İşletme kapak görselini Cloudinary'ye yükler ve kaydeder.
   */
  async updateCoverImage(
    businessId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<BusinessDocument> {
    const business = await this.findAndVerifyOwnership(businessId, userId);

    const result = await this.cloudinaryService.uploadImage(file, 'covers');
    business.coverImage = result.url;

    return business.save();
  }

  /**
   * İşletmeyi yayına alır: isPublished=true, publishedAt=now, status=ACTIVE
   */
  async publishBusiness(businessId: string, userId: string): Promise<BusinessDocument> {
    const business = await this.findAndVerifyOwnership(businessId, userId);

    business.isPublished = true;
    business.publishedAt = new Date();
    business.status = BusinessStatus.ACTIVE;

    return business.save();
  }

  /**
   * İşletmeyi yayından kaldırır: isPublished=false, status=DRAFT
   */
  async unpublishBusiness(businessId: string, userId: string): Promise<BusinessDocument> {
    const business = await this.findAndVerifyOwnership(businessId, userId);

    business.isPublished = false;
    business.status = BusinessStatus.DRAFT;

    return business.save();
  }

  /**
   * İşletme görüntülenme sayısını atomik olarak artırır.
   */
  async incrementViews(businessId: string): Promise<void> {
    await this.businessModel
      .findByIdAndUpdate(businessId, { $inc: { totalViews: 1 } })
      .exec();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async findAndVerifyOwnership(
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
