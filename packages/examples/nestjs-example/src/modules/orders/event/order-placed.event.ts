export class OrderPlacedEvent {
  constructor(public readonly orderId: string, public readonly customerName: string, public readonly total: number) {}
}
