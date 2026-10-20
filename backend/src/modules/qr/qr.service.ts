import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';

import { Business, BusinessDocument } from '../../schemas/business.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<BusinessDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Yardımcı: menü URL'ini oluştur ───────────────────────────────────────
  private buildMenuUrl(slug: string): string {
    const base =
      this.configService.get<string>('MENU_BASE_URL') ?? 'https://menu.restoranqr.com';
    return `${base.replace(/\/$/, '')}/${slug}`;
  }

  // ─── Yardımcı: işletme sahiplik kontrolü ──────────────────────────────────
  private async getOwnedBusiness(
    businessId: string,
    userId: string,
  ): Promise<BusinessDocument> {
    const business = await this.businessModel.findById(businessId);
    if (!business) throw new NotFoundException('İşletme bulunamadı.');
    if (business.owner.toString() !== userId) {
      throw new ForbiddenException('Bu işletme size ait değil.');
    }
    return business;
  }

  // ─── Yardımcı: PNG buffer üret ────────────────────────────────────────────
  private async generateQrBuffer(menuUrl: string): Promise<Buffer> {
    try {
      const buffer = await QRCode.toBuffer(menuUrl, {
        type: 'png',
        width: 512,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      return buffer;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
      throw new BadRequestException(`QR kodu oluşturulamadı: ${msg}`);
    }
  }

  // ─── generateQrCode ────────────────────────────────────────────────────────
  async generateQrCode(
    businessId: string,
    userId: string,
  ): Promise<{ qrCodeUrl: string; menuUrl: string }> {
    const business = await this.getOwnedBusiness(businessId, userId);
    const menuUrl = this.buildMenuUrl(business.slug);

    const qrBuffer = await this.generateQrBuffer(menuUrl);

    // Cloudinary'ye yükle
    const { url } = await this.cloudinaryService.uploadBuffer(
      qrBuffer,
      'qr-codes',
      `qr_${business.slug}`,
    );

    // İşletme kaydına kaydet
    business.qrCodeUrl = url;
    await business.save();

    return { qrCodeUrl: url, menuUrl };
  }

  // ─── downloadQrPng ────────────────────────────────────────────────────────
  async downloadQrPng(businessId: string, userId: string): Promise<Buffer> {
    const business = await this.getOwnedBusiness(businessId, userId);
    const menuUrl = this.buildMenuUrl(business.slug);
    return this.generateQrBuffer(menuUrl);
  }

  // ─── downloadQrPdf ────────────────────────────────────────────────────────
  async downloadQrPdf(businessId: string, userId: string): Promise<Buffer> {
    const business = await this.getOwnedBusiness(businessId, userId);
    const menuUrl = this.buildMenuUrl(business.slug);
    const qrBuffer = await this.generateQrBuffer(menuUrl);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(new BadRequestException(err.message)));

      // ─── PDF İçeriği ──────────────────────────────────────────────────────
      // Başlık
      doc
        .fontSize(24)
        .fillColor('#1a1a1a')
        .text(business.name ?? 'Restoranınız', { align: 'center' });

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor('#555555')
        .text('Menümüzü görmek için QR kodu okutun', { align: 'center' });

      doc.moveDown(1.5);

      // QR kod resmi - sayfada ortalanmış
      const pageWidth = doc.page.width;
      const imgSize = 250;
      const imgX = (pageWidth - imgSize) / 2;
      doc.image(qrBuffer, imgX, doc.y, { width: imgSize, height: imgSize });

      doc.moveDown(14); // QR yüksekliği kadar boşluk bırak

      // Menü URL'i
      doc
        .fontSize(10)
        .fillColor('#888888')
        .text(menuUrl, { align: 'center', link: menuUrl });

      doc.end();
    });
  }

  // ─── getQrData ────────────────────────────────────────────────────────────
  async getQrData(
    businessId: string,
    userId: string,
  ): Promise<{ qrCodeUrl: string | null; menuUrl: string }> {
    const business = await this.getOwnedBusiness(businessId, userId);
    const menuUrl = this.buildMenuUrl(business.slug);
    return {
      qrCodeUrl: business.qrCodeUrl ?? null,
      menuUrl,
    };
  }
}
