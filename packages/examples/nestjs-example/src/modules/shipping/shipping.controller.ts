import { Controller, Get, Query } from '@nestjs/common';
import { EventPublisher } from '@telegraph/nestjs';
import { OrderDeliveredEvent } from './event/order-delivered.event';
import { OrderReturnedEvent } from './event/order-returned.event';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly eventPublisher: EventPublisher) {}

  @Get('webhook/ok')
  async webhookOk(@Query('orderId') orderId: string) {
    await this.eventPublisher.publish(new OrderDeliveredEvent(orderId, 'someone', 'somewhere'));
  }

  @Get('webhook/fail')
  async webhookFail(@Query('orderId') orderId: string) {
    await this.eventPublisher.publish(new OrderReturnedEvent(orderId, 'wrong address'));
  }
}
