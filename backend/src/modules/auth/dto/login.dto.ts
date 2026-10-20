import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ahmet@example.com' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta alanı boş bırakılamaz' })
  email: string;

  @ApiProperty({ example: 'Sifre123!' })
  @IsString({ message: 'Şifre alanı metin olmalıdır' })
  @IsNotEmpty({ message: 'Şifre alanı boş bırakılamaz' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;
}
