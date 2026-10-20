import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoryDto } from './dto/reorder-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ---------------------------------------------------------------------------
  // POST /categories – Yeni kategori oluştur
  // ---------------------------------------------------------------------------
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni kategori oluştur' })
  create(@GetUser('id') userId: string, @Body() dto: CreateCategoryDto) {
    return this.categoryService.create(userId, dto);
  }

  // ---------------------------------------------------------------------------
  // POST /categories/reorder – Kategorileri yeniden sırala (drag & drop)
  // ---------------------------------------------------------------------------
  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kategorileri yeniden sırala (drag & drop)' })
  reorder(@GetUser('id') userId: string, @Body() dto: ReorderCategoryDto) {
    return this.categoryService.reorder(userId, dto);
  }

  // ---------------------------------------------------------------------------
  // GET /categories/:businessId – İşletmenin tüm kategorilerini getir (public)
  // ---------------------------------------------------------------------------
  @Get(':businessId')
  @ApiParam({ name: 'businessId', description: 'İşletme ID' })
  @ApiOperation({ summary: "İşletmenin tüm kategorilerini getir (public)" })
  findAll(@Param('businessId') businessId: string) {
    return this.categoryService.findAll(businessId);
  }

  // ---------------------------------------------------------------------------
  // GET /categories/:id/detail – Kategori detayı (owner)
  // ---------------------------------------------------------------------------
  @Get(':id/detail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Kategori ID' })
  @ApiOperation({ summary: 'Kategori detayını getir (sadece işletme sahibi)' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.categoryService.findOne(id, userId);
  }

  // ---------------------------------------------------------------------------
  // PATCH /categories/:id – Kategori güncelle
  // ---------------------------------------------------------------------------
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Kategori ID' })
  @ApiOperation({ summary: 'Kategoriyi güncelle' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, userId, dto);
  }

  // ---------------------------------------------------------------------------
  // PATCH /categories/:id/toggle-active – Aktif/Pasif durumunu değiştir
  // ---------------------------------------------------------------------------
  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Kategori ID' })
  @ApiOperation({ summary: "Kategorinin aktif/pasif durumunu değiştir" })
  toggleActive(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.categoryService.toggleActive(id, userId);
  }

  // ---------------------------------------------------------------------------
  // DELETE /categories/:id – Kategori sil
  // ---------------------------------------------------------------------------
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Kategori ID' })
  @ApiOperation({ summary: 'Kategoriyi sil' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.categoryService.remove(id, userId);
  }
}
