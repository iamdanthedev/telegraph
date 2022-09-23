export interface OrderPaidEvent {
  orderId: string;
  invoiceId: string;
  total: number;
}
