import { Module } from '@nestjs/common';
import { TelegraphModule } from '@telegraph/nestjs';
import { ShippingController } from './shipping.controller';
import { ShipOrderCommandHandler } from './command-handler/ship-order.command-handler';
import { OrderShippedEventHandler } from './event-handler/order-shipped.event-handler';

@Module({
  imports: [TelegraphModule],
  controllers: [ShippingController],
  providers: [ShipOrderCommandHandler, OrderShippedEventHandler],
})
export class ShippingModule {}
