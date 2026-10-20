import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ahmet Yılmaz', description: 'Ad soyad' })
  @IsString({ message: 'Ad alanı metin olmalıdır' })
  @IsNotEmpty({ message: 'Ad alanı boş bırakılamaz' })
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(100, { message: 'Ad en fazla 100 karakter olabilir' })
  name: string;

  @ApiProperty({ example: 'ahmet@example.com', description: 'E-posta adresi' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta alanı boş bırakılamaz' })
  email: string;

  @ApiProperty({ example: 'Sifre123!', description: 'Şifre (en az 8 karakter)' })
  @IsString({ message: 'Şifre alanı metin olmalıdır' })
  @IsNotEmpty({ message: 'Şifre alanı boş bırakılamaz' })
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalıdır' })
  @MaxLength(128, { message: 'Şifre en fazla 128 karakter olabilir' })
  password: string;
}
