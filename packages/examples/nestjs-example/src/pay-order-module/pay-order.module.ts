import { Module } from '@nestjs/common';
import { TelegraphModule } from '@telegraph/nestjs';
import { PayOrderCommandHandler } from './command-handler/pay-order.command-handler';

@Module({
  imports: [TelegraphModule],
  providers: [PayOrderCommandHandler],
})
export class PayOrderModule {}
