import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThemeDto {
  @ApiProperty({ example: 'Minimal' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'minimal' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Sade, modern ve şık açık renk teması' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://...' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty()
  @IsObject()
  colors: Record<string, any>;

  @ApiProperty()
  @IsObject()
  typography: Record<string, any>;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  layout?: Record<string, any>;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
