import {
  IsString,
  IsMongoId,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AllergenType } from '../../../schemas/product.schema';

export class CreateProductDto {
  @ApiPropertyOptional({ description: 'İşletme ID', example: '64a1b2c3d4e5f6a7b8c9d0e1' })
  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir işletme ID giriniz' })
  businessId?: string;

  @ApiProperty({ description: 'Kategori ID', example: '64a1b2c3d4e5f6a7b8c9d0e2' })
  @IsMongoId({ message: 'Geçerli bir kategori ID giriniz' })
  categoryId: string;

  @ApiProperty({ description: 'Ürün adı', maxLength: 200 })
  @IsString({ message: 'Ürün adı metin olmalıdır' })
  @MaxLength(200, { message: 'Ürün adı en fazla 200 karakter olabilir' })
  name: string;

  @ApiPropertyOptional({ description: 'Ürün açıklaması', maxLength: 1000 })
  @IsOptional()
  @IsString({ message: 'Açıklama metin olmalıdır' })
  @MaxLength(1000, { message: 'Açıklama en fazla 1000 karakter olabilir' })
  description?: string;

  @ApiProperty({ description: 'Ürün fiyatı', minimum: 0, example: 49.9 })
  @IsNumber({}, { message: 'Fiyat sayısal bir değer olmalıdır' })
  @Min(0, { message: 'Fiyat 0 veya daha büyük olmalıdır' })
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ description: 'İndirimli fiyat', minimum: 0, example: 39.9 })
  @IsOptional()
  @IsNumber({}, { message: 'İndirimli fiyat sayısal bir değer olmalıdır' })
  @Min(0, { message: 'İndirimli fiyat 0 veya daha büyük olmalıdır' })
  @Type(() => Number)
  discountedPrice?: number;

  @ApiPropertyOptional({
    description: 'Alerjenler',
    isArray: true,
    enum: AllergenType,
  })
  @IsOptional()
  @IsArray({ message: 'Alerjenler dizi formatında olmalıdır' })
  @IsEnum(AllergenType, { each: true, message: 'Geçersiz alerjen tipi' })
  allergens?: AllergenType[];

  @ApiPropertyOptional({ description: 'Stokta var mı?', default: true })
  @IsOptional()
  @IsBoolean({ message: 'inStock boolean olmalıdır' })
  inStock?: boolean;

  @ApiPropertyOptional({ description: 'Stok adedi', minimum: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'Stok adedi sayısal bir değer olmalıdır' })
  @Min(0, { message: 'Stok adedi 0 veya daha büyük olmalıdır' })
  @Type(() => Number)
  stockCount?: number;

  @ApiPropertyOptional({ description: 'Vejetaryen mi?' })
  @IsOptional()
  @IsBoolean({ message: 'isVegetarian boolean olmalıdır' })
  isVegetarian?: boolean;

  @ApiPropertyOptional({ description: 'Vegan mı?' })
  @IsOptional()
  @IsBoolean({ message: 'isVegan boolean olmalıdır' })
  isVegan?: boolean;

  @ApiPropertyOptional({ description: 'Glutensiz mi?' })
  @IsOptional()
  @IsBoolean({ message: 'isGlutenFree boolean olmalıdır' })
  isGlutenFree?: boolean;

  @ApiPropertyOptional({ description: 'Acılı mı?' })
  @IsOptional()
  @IsBoolean({ message: 'isSpicy boolean olmalıdır' })
  isSpicy?: boolean;

  @ApiPropertyOptional({ description: 'Öne çıkan ürün mü?' })
  @IsOptional()
  @IsBoolean({ message: 'isFeatured boolean olmalıdır' })
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Hazırlanma süresi', example: '15-20 dk' })
  @IsOptional()
  @IsString({ message: 'Hazırlanma süresi metin olmalıdır' })
  preparationTime?: string;

  @ApiPropertyOptional({ description: 'Kalori bilgisi', example: '350 kcal' })
  @IsOptional()
  @IsString({ message: 'Kalori bilgisi metin olmalıdır' })
  calories?: string;

  @ApiPropertyOptional({ description: 'Etiketler', isArray: true, type: String })
  @IsOptional()
  @IsArray({ message: 'Etiketler dizi formatında olmalıdır' })
  @IsString({ each: true, message: 'Her etiket metin olmalıdır' })
  tags?: string[];
}
