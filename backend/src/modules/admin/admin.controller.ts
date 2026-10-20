import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';
import { BusinessStatus } from '../../schemas/business.schema';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Genel istatistikleri getirir' })
  async getDashboardStats() {
    const data = await this.adminService.getDashboardStats();
    return { success: true, data };
  }

  @Get('users')
  @ApiOperation({ summary: 'Kullanıcı listesini sayfalanmış getirir' })
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const data = await this.adminService.getUsers(Number(page), Number(limit), search);
    return { success: true, data };
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Kullanıcı detayını getirir' })
  async getUserDetail(@Param('id') id: string) {
    const data = await this.adminService.getUserDetail(id);
    return { success: true, data };
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Kullanıcı durumunu (aktif/pasif) günceller' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    const data = await this.adminService.updateUserStatus(id, isActive);
    return { success: true, message: 'Kullanıcı durumu güncellendi', data };
  }

  @Get('businesses')
  @ApiOperation({ summary: 'İşletmeleri listeler' })
  async getBusinesses(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.adminService.getBusinesses(
      Number(page),
      Number(limit),
      search,
      status,
    );
    return { success: true, data };
  }

  @Get('businesses/:id')
  @ApiOperation({ summary: 'İşletme detayını getirir' })
  async getBusinessDetail(@Param('id') id: string) {
    const data = await this.adminService.getBusinessDetail(id);
    return { success: true, data };
  }

  @Patch('businesses/:id/status')
  @ApiOperation({ summary: 'İşletme durumunu günceller' })
  async updateBusinessStatus(
    @Param('id') id: string,
    @Body('status') status: BusinessStatus,
  ) {
    const data = await this.adminService.updateBusinessStatus(id, status);
    return { success: true, message: 'İşletme durumu güncellendi', data };
  }

  @Get('payments')
  @ApiOperation({ summary: 'Ödeme işlemlerini listeler' })
  async getPayments(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
  ) {
    const data = await this.adminService.getPayments(Number(page), Number(limit), status);
    return { success: true, data };
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'Abonelikleri listeler' })
  async getSubscriptions(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const data = await this.adminService.getSubscriptions(Number(page), Number(limit));
    return { success: true, data };
  }
}
