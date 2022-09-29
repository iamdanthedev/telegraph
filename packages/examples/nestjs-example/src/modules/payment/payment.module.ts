import { Module } from '@nestjs/common';
import { TelegraphModule } from '@telegraph/nestjs';
import { ChargeCreditCardCommandHandler } from './command-handler/charge-credit-card.command-handler';
import { OrderPaidEventHandler } from "./event-handler/order-paid.event-handler";

@Module({
  imports: [TelegraphModule],
  providers: [ChargeCreditCardCommandHandler, OrderPaidEventHandler],
})
export class PaymentModule {}
