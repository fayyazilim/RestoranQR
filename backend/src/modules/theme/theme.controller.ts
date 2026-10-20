import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ThemeService } from './theme.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@ApiTags('themes')
@Controller('themes')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm temaları listeler (Public)' })
  async findAll() {
    const themes = await this.themeService.findAll();
    return { success: true, data: themes };
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Slug değerine göre tema getirir' })
  async findBySlug(@Param('slug') slug: string) {
    const theme = await this.themeService.findBySlug(slug);
    return { success: true, data: theme };
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID değerine göre tema detayını getirir' })
  async findOne(@Param('id') id: string) {
    const theme = await this.themeService.findOne(id);
    return { success: true, data: theme };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni tema ekler (Sadece Admin)' })
  async create(@Body() dto: CreateThemeDto) {
    const theme = await this.themeService.create(dto);
    return { success: true, message: 'Tema oluşturuldu', data: theme };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Temayı günceller (Sadece Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateThemeDto) {
    const theme = await this.themeService.update(id, dto);
    return { success: true, message: 'Tema güncellendi', data: theme };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Temayı siler (Sadece Admin)' })
  async remove(@Param('id') id: string) {
    return this.themeService.remove(id);
  }
}
