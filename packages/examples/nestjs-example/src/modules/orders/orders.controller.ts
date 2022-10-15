import { randomUUID } from 'crypto';
import { Controller, Post, Query } from '@nestjs/common';
import { CommandPublisher } from '@telegraph/nestjs';
import { PlaceOrderCommand } from './command/place-order.command';

@Controller('orders')
export class OrdersController {
  constructor(private readonly commandPublisher: CommandPublisher) {}

  @Post()
  async placeOrder(@Query('productId') productId: string, @Query('customerId') customerId: string) {
    const orderId = randomUUID();
    const total = 100;

    const command = new PlaceOrderCommand(orderId, productId, customerId, total);
    await this.commandPublisher.publish(command);

    return { result: 'order placed', orderId, productId, customerId, total };
  }
}
