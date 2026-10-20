import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessDto {
  @ApiProperty({ description: 'İşletme adı', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'İşletme açıklaması', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'İşletme adresi', maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional({ description: 'Telefon numarası', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'E-posta adresi' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Para birimi', default: 'TRY' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string = 'TRY';

  @ApiPropertyOptional({ description: 'Para birimi sembolü (₺, $, €)', default: '₺' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencySymbol?: string = '₺';
}
