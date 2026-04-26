export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
}

export interface CreateOrderData {
  items: { product_id: string; quantity: number; size?: string; color?: string }[];
  shipping_address: ShippingAddress;
  payment_method: "stripe" | "offline";
}
