import { Module } from '@nestjs/common';
import { TelegraphModule } from '@telegraph/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayOrderModule } from '../pay-order-module/pay-order.module';
import { PayOrderCommandHandler } from '../pay-order-module/command-handler/pay-order.command-handler';

@Module({
  imports: [TelegraphModule, PayOrderModule],
  controllers: [AppController],
  providers: [AppService, PayOrderCommandHandler],
})
export class AppModule {}
