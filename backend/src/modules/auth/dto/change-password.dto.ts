import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mevcut şifre' })
  @IsString()
  @IsNotEmpty({ message: 'Mevcut şifre boş bırakılamaz' })
  currentPassword: string;

  @ApiProperty({ description: 'Yeni şifre (en az 8 karakter)' })
  @IsString()
  @IsNotEmpty({ message: 'Yeni şifre boş bırakılamaz' })
  @MinLength(8, { message: 'Yeni şifre en az 8 karakter olmalıdır' })
  newPassword: string;
}
