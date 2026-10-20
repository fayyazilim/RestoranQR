import { IsArray, ValidateNested, IsMongoId, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ReorderItem {
  @ApiProperty({ description: 'Kategori ID' })
  @IsMongoId()
  id: string;

  @ApiProperty({ description: 'Yeni sıra numarası' })
  @IsNumber()
  order: number;
}

export class ReorderCategoryDto {
  @ApiProperty({ type: [ReorderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  items: ReorderItem[];
}
