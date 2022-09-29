export class OrderCanceledEvent {
  constructor(public readonly orderId: string, public readonly reason: string) {}
}
