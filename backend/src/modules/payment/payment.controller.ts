import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ─── POST /payments/initialize ─────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'iyzico ödeme formunu başlat' })
  async initializePayment(
    @Req() req: Request & { user: { userId: string } },
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentService.initializePayment(req.user.userId, dto);
  }

  // ─── POST /payments/callback ────────────────────────────────────────────────
  // Auth guard YOK — iyzico bu endpoint'i çağırır.
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'iyzico ödeme callback (webhook)' })
  async handleCallback(
    @Body('token') token: string,
    @Res() res: Response,
  ) {
    const result = await this.paymentService.handleCallback(token);

    const frontendBaseUrl = process.env.FRONTEND_URL ?? 'http://localhost:4200';
    const redirectPath = result.success
      ? `/dashboard/subscription?status=success`
      : `/dashboard/subscription?status=failed`;

    return res.redirect(`${frontendBaseUrl}${redirectPath}`);
  }

  // ─── GET /payments/history ─────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('history')
  @ApiOperation({ summary: 'Kullanıcının ödeme geçmişi' })
  async getPaymentHistory(
    @Req() req: any,
  ) {
    const userId = req.user._id ? req.user._id.toString() : req.user.userId;
    return this.paymentService.getPaymentHistory(userId);
  }

  // ─── GET /payments/subscription/:businessId ────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('subscription/:businessId')
  @ApiParam({ name: 'businessId', description: 'İşletme MongoDB ID' })
  @ApiOperation({ summary: 'İşletmenin aktif aboneliğini getir' })
  async getSubscription(@Param('businessId') businessId: string) {
    return this.paymentService.getSubscription(businessId);
  }

  // ─── POST /payments/cancel/:businessId ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('cancel/:businessId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'businessId', description: 'İşletme MongoDB ID' })
  @ApiOperation({ summary: 'Aktif aboneliği iptal et' })
  async cancelSubscription(
    @Param('businessId') businessId: string,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.paymentService.cancelSubscription(businessId, req.user.userId);
  }
}
