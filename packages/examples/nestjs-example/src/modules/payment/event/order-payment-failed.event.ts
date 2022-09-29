export class OrderPaymentFailedEvent {
  constructor(public readonly orderId: string, public readonly invoiceId: string, reason: string) {}
}
