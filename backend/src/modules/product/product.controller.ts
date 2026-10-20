import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserDocument } from '../../schemas/user.schema';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni ürün oluşturur' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @GetUser() user: UserDocument,
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const product = await this.productService.create(
      (user as any)._id.toString(),
      dto,
      file,
    );
    return { success: true, message: 'Ürün oluşturuldu', data: product };
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'İşletmenin ürünlerini listeler (Public)' })
  async findByBusiness(
    @Param('businessId') businessId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const products = await this.productService.findByBusiness(businessId, categoryId);
    return { success: true, data: products };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kullanıcının kendi ürünlerini listeler' })
  async findMyProducts(
    @GetUser() user: UserDocument,
    @Query('businessId') businessId?: string,
  ) {
    const products = await this.productService.findAllByOwner(
      (user as any)._id.toString(),
      businessId,
    );
    return { success: true, data: products };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ürün detayını getirir' })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return { success: true, data: product };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ürünü günceller' })
  async update(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
    @Body() dto: UpdateProductDto,
  ) {
    const product = await this.productService.update(
      id,
      (user as any)._id.toString(),
      dto,
    );
    return { success: true, message: 'Ürün güncellendi', data: product };
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Ürün görselini günceller' })
  async updateImage(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const product = await this.productService.updateImage(
      id,
      (user as any)._id.toString(),
      file,
    );
    return { success: true, message: 'Görsel güncellendi', data: product };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ürünü siler' })
  async remove(@Param('id') id: string, @GetUser() user: UserDocument) {
    return this.productService.remove(id, (user as any)._id.toString());
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ürünlerin sırasını günceller' })
  async reorder(
    @GetUser() user: UserDocument,
    @Body() body: { items: { id: string; order: number }[] },
  ) {
    await this.productService.reorder((user as any)._id.toString(), body.items);
    return { success: true, message: 'Sıralama güncellendi' };
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ürünü aktif/pasif yapar' })
  async toggleActive(@Param('id') id: string, @GetUser() user: UserDocument) {
    const product = await this.productService.toggleActive(
      id,
      (user as any)._id.toString(),
    );
    return { success: true, data: product };
  }

  @Patch(':id/toggle-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ürün stok durumunu değiştirir' })
  async toggleStock(@Param('id') id: string, @GetUser() user: UserDocument) {
    const product = await this.productService.toggleStock(
      id,
      (user as any)._id.toString(),
    );
    return { success: true, data: product };
  }
}
