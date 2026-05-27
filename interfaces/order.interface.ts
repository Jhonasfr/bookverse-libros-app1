export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice?: number;
  productName?: string;
  productImage?: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  shippingAddressId?: number;
  buyerId?: number;
  sellerId?: number;
}

export interface CreateOrderDto {
  items: { productId: number; quantity: number }[];
  shippingAddressId: number;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
