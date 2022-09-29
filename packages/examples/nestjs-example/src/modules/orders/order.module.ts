import { Module } from '@nestjs/common';
import { TelegraphModule } from '@telegraph/nestjs';
import { PlaceOrderCommandHandler } from './command-handler/place-order.command-handler';
import { OrderPlacedSaga } from './saga/order.saga';

@Module({
  imports: [TelegraphModule],
  providers: [OrderPlacedSaga, PlaceOrderCommandHandler],
})
export class OrderModule {}