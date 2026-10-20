import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBusinessDto } from './create-business.dto';

class WorkingHourDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  day?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  open?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  close?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isClosed?: boolean;
}

class SocialMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tiktok?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  youtube?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
  @ApiPropertyOptional({ description: 'Çalışma saatleri', type: [WorkingHourDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourDto)
  workingHours?: WorkingHourDto[];

  @ApiPropertyOptional({ description: 'Sosyal medya linkleri', type: SocialMediaDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  @ApiPropertyOptional({ description: 'Tema ID (MongoId)' })
  @IsOptional()
  @IsMongoId()
  themeId?: string;
}
