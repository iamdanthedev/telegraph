export class OrderRefundedEvent {
  constructor(public readonly orderId: string, public readonly amount: number) {}
}
