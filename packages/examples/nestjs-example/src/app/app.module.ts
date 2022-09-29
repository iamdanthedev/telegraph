import { Module } from '@nestjs/common';
import { TelegraphModule } from '@telegraph/nestjs';
import { OrderModule } from '../modules/orders/order.module';
import { PaymentModule } from '../modules/payment/payment.module';
import { ShippingModule } from '../modules/shipping/shipping.module';

@Module({
  imports: [TelegraphModule, OrderModule, PaymentModule, ShippingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}