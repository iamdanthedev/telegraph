export class PayOrderCommand {
  constructor(public readonly orderId: string, public readonly total: number) {}
}
