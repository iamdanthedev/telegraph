export class OrderReturnedEvent {
  constructor(public readonly orderId: string, public readonly reason: string) {}
}
