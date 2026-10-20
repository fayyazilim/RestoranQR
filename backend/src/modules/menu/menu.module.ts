import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Business, BusinessSchema } from '../../schemas/business.schema';
import { Category, CategorySchema } from '../../schemas/category.schema';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { Theme, ThemeSchema } from '../../schemas/theme.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Theme.name, schema: ThemeSchema },
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
