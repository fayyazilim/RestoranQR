import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { Business, BusinessSchema } from '../../schemas/business.schema';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';
import { Subscription, SubscriptionSchema } from '../../schemas/subscription.schema';
import { Theme, ThemeSchema } from '../../schemas/theme.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Theme.name, schema: ThemeSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
