export class RefundCreditCardCommand {
  constructor(public readonly orderId: string, public readonly amount: number) {}
}
