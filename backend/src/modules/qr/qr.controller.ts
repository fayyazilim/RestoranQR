import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseGuards,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { QrService } from './qr.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserDocument } from '../../schemas/user.schema';

@ApiTags('qr')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post('generate/:businessId')
  @ApiOperation({ summary: 'İşletme için QR kodu oluşturur ve Cloudinary’ye yükler' })
  @ApiResponse({ status: 200, description: 'QR kod başarıyla oluşturuldu' })
  async generate(
    @Param('businessId') businessId: string,
    @GetUser() user: UserDocument,
  ) {
    const result = await this.qrService.generateQrCode(businessId, (user as any)._id.toString());
    return {
      success: true,
      message: 'QR kod başarıyla oluşturuldu',
      data: result,
    };
  }

  @Get('data/:businessId')
  @ApiOperation({ summary: 'İşletmenin QR kod URL ve Menü URL bilgisini getirir' })
  async getQrData(
    @Param('businessId') businessId: string,
    @GetUser() user: UserDocument,
  ) {
    const result = await this.qrService.getQrData(businessId, (user as any)._id.toString());
    return {
      success: true,
      data: result,
    };
  }

  @Get('download/png/:businessId')
  @ApiOperation({ summary: 'QR kodunu PNG formatında indirir' })
  @Header('Content-Type', 'image/png')
  async downloadPng(
    @Param('businessId') businessId: string,
    @GetUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.qrService.downloadQrPng(businessId, (user as any)._id.toString());
    res.set({
      'Content-Disposition': `attachment; filename="menu-qr-${businessId}.png"`,
    });
    return new StreamableFile(buffer);
  }

  @Get('download/pdf/:businessId')
  @ApiOperation({ summary: 'QR kodunu yazdırılabilir A4 PDF olarak indirir' })
  @Header('Content-Type', 'application/pdf')
  async downloadPdf(
    @Param('businessId') businessId: string,
    @GetUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.qrService.downloadQrPdf(businessId, (user as any)._id.toString());
    res.set({
      'Content-Disposition': `attachment; filename="menu-qr-${businessId}.pdf"`,
    });
    return new StreamableFile(buffer);
  }
}
