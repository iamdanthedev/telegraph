export class OrderDeliveredEvent {
  constructor(public readonly orderId: string, public readonly customerName: string, public readonly address: string) {}
}
