import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { Business, BusinessSchema } from '../../schemas/business.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }]),
    CloudinaryModule,
  ],
  controllers: [QrController],
  providers: [QrService],
  exports: [QrService],
})
export class QrModule {}
