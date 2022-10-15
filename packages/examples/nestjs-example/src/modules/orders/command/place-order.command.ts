export class PlaceOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly productId: string,
    public readonly customerId: string,
    public readonly total: number
  ) {}
}
