import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Müşteri menü sayfasının tüm içeriğini getirir (Public)' })
  async getPublicMenu(@Param('slug') slug: string) {
    const data = await this.menuService.getPublicMenu(slug);
    return { success: true, data };
  }

  @Get(':slug/meta')
  @ApiOperation({ summary: 'Menü SSR meta tag bilgilerini getirir (Public)' })
  async getMenuMeta(@Param('slug') slug: string) {
    const data = await this.menuService.getMenuMeta(slug);
    return { success: true, data };
  }
}
