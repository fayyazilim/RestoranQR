import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:4200');
  const nextjsUrl = configService.get<string>('NEXTJS_URL', 'http://localhost:3000');

  // Security
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: [frontendUrl, nextjsUrl, 'http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('QR Menü Platformu API')
    .setDescription('Kafe ve restoranlar için dijital QR menü platformu API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT token giriniz',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Kimlik doğrulama işlemleri')
    .addTag('users', 'Kullanıcı işlemleri')
    .addTag('business', 'İşletme yönetimi')
    .addTag('categories', 'Kategori yönetimi')
    .addTag('products', 'Ürün yönetimi')
    .addTag('themes', 'Tema yönetimi')
    .addTag('qr', 'QR kod işlemleri')
    .addTag('payments', 'Ödeme işlemleri')
    .addTag('admin', 'Admin işlemleri')
    .addTag('menu', 'Müşteri menü sayfası')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  console.log(`\n🚀 QR Menü Platformu API çalışıyor: http://localhost:${port}/api`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
  console.log(`🌍 Environment: ${configService.get('NODE_ENV', 'development')}\n`);
}
bootstrap();
