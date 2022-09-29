export class ChargeCreditCardCommand {
  constructor(public readonly orderId: string, public readonly total: number) {}
}
