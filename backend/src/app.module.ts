import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ThemeModule } from './modules/theme/theme.module';
import { QrModule } from './modules/qr/qr.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AdminModule } from './modules/admin/admin.module';
import { MenuModule } from './modules/menu/menu.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB bağlantısı kuruldu');
          });
          connection.on('error', (error) => {
            console.error('❌ MongoDB bağlantı hatası:', error);
          });
          connection.on('disconnected', () => {
            console.log('⚠️  MongoDB bağlantısı kesildi');
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    // Feature Modules
    AuthModule,
    UsersModule,
    BusinessModule,
    CategoryModule,
    ProductModule,
    ThemeModule,
    QrModule,
    PaymentModule,
    AdminModule,
    MenuModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
