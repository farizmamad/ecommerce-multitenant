export interface IOrder {
  id: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  productId: string;
  productName: string;
  total: number;
  paidAt?: Date;
  paymentUrl?: string;
  tenantId?: string;
}