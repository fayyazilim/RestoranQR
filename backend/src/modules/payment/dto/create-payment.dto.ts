import { IsString, IsEmail, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan } from '../../../schemas/subscription.schema';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Ödeme yapılacak işletmenin MongoDB ID\'si' })
  @IsMongoId()
  businessId: string;

  @ApiProperty({ enum: SubscriptionPlan, description: 'Abonelik planı' })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  // ─── Alıcı Bilgileri ───────────────────────────────────────────────────────

  @ApiProperty({ description: 'Alıcı adı soyadı' })
  @IsString()
  buyerName: string;

  @ApiProperty({ description: 'Alıcı e-posta adresi' })
  @IsEmail()
  buyerEmail: string;

  @ApiProperty({ description: 'Alıcı telefon numarası (başında 0 olmadan, örn: 5551234567)' })
  @IsString()
  buyerPhone: string;

  @ApiProperty({ description: 'Fatura adresi' })
  @IsString()
  buyerAddress: string;

  @ApiProperty({ description: 'Şehir' })
  @IsString()
  buyerCity: string;

  @ApiPropertyOptional({ description: 'Ülke', default: 'Turkey' })
  @IsString()
  @IsOptional()
  buyerCountry?: string = 'Turkey';

  @ApiPropertyOptional({ description: 'Posta kodu' })
  @IsString()
  @IsOptional()
  buyerZipCode?: string;

  @ApiProperty({ description: 'TC kimlik numarası' })
  @IsString()
  buyerIdentityNumber: string;

  // ─── Kart Bilgileri ────────────────────────────────────────────────────────

  @ApiProperty({ description: 'Kart üzerindeki isim' })
  @IsString()
  cardHolderName: string;

  @ApiProperty({ description: 'Kart numarası (boşluksuz)' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ description: 'Son kullanma ayı (örn: 01)' })
  @IsString()
  expireMonth: string;

  @ApiProperty({ description: 'Son kullanma yılı (örn: 2030)' })
  @IsString()
  expireYear: string;

  @ApiProperty({ description: 'Kart güvenlik kodu (CVV/CVC)' })
  @IsString()
  cvc: string;
}
