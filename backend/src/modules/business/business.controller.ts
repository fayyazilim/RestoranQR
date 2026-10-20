import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  // ---------------------------------------------------------------------------
  // POST /business – İşletme oluştur veya güncelle (upsert)
  // ---------------------------------------------------------------------------
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İşletme oluştur veya mevcut işletmeyi güncelle (upsert)' })
  async create(@GetUser('id') userId: string, @Body() dto: CreateBusinessDto) {
    const business = await this.businessService.upsertBusiness(userId, dto);
    return { success: true, data: business };
  }

  // ---------------------------------------------------------------------------
  // GET /business/me – Kendi işletmeni getir
  // ---------------------------------------------------------------------------
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Oturum açmış kullanıcının işletmesini getir' })
  async findMyBusiness(@GetUser('id') userId: string) {
    try {
      const business = await this.businessService.findByOwner(userId);
      return { success: true, data: business };
    } catch {
      return { success: false, data: null };
    }
  }

  // ---------------------------------------------------------------------------
  // POST /business/publish – İşletmeyi yayına al
  // ---------------------------------------------------------------------------
  @Post('publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İşletmeyi yayına al' })
  async publish(@GetUser('id') userId: string) {
    const business = await this.businessService.findByOwner(userId);
    return this.businessService.publishBusiness((business as any)._id.toString(), userId);
  }

  // ---------------------------------------------------------------------------
  // POST /business/unpublish – İşletmeyi yayından kaldır
  // ---------------------------------------------------------------------------
  @Post('unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İşletmeyi yayından kaldır' })
  async unpublish(@GetUser('id') userId: string) {
    const business = await this.businessService.findByOwner(userId);
    return this.businessService.unpublishBusiness((business as any)._id.toString(), userId);
  }

  // ---------------------------------------------------------------------------
  // POST /business/logo – Logo yükle
  // ---------------------------------------------------------------------------
  @Post('logo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'İşletme logosu yükle' })
  async uploadLogo(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const business = await this.businessService.findByOwner(userId);
    return this.businessService.updateLogo((business as any)._id.toString(), userId, file);
  }

  // ---------------------------------------------------------------------------
  // POST /business/cover – Kapak görseli yükle
  // ---------------------------------------------------------------------------
  @Post('cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'İşletme kapak görseli yükle' })
  async uploadCover(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const business = await this.businessService.findByOwner(userId);
    return this.businessService.updateCoverImage((business as any)._id.toString(), userId, file);
  }

  // ---------------------------------------------------------------------------
  // PATCH /business – İşletme bilgilerini güncelle (upsert)
  // ---------------------------------------------------------------------------
  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İşletme bilgilerini güncelle (yoksa oluşturur)' })
  async update(@GetUser('id') userId: string, @Body() dto: UpdateBusinessDto) {
    return this.businessService.upsertBusiness(userId, dto as any);
  }

  // ---------------------------------------------------------------------------
  // GET /business/:slug – Slug ile işletme getir (public)
  // ---------------------------------------------------------------------------
  @Get(':slug')
  @ApiParam({ name: 'slug', description: 'İşletme slug' })
  @ApiOperation({ summary: 'Slug ile işletmeyi getir (public)' })
  async findBySlug(@Param('slug') slug: string) {
    const business = await this.businessService.findBySlug(slug);
    // Görüntülenme sayısını artır (fire-and-forget)
    this.businessService
      .incrementViews((business as any)._id.toString())
      .catch(() => undefined);
    return business;
  }
}
