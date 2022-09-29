export class OrderPaidEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerName: string,
    public readonly invoiceId: string,
    public readonly total: number
  ) {}
}
