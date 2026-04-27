import apiClient from "./client";

export interface OrderItem {
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: "stripe" | "offline";
}

export interface CreateOrderResponse {
  order_id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  client_secret?: string;
}

export interface OrderItemDetail {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface OrderResponse {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: ShippingAddress;
  items: OrderItemDetail[];
  created_at: string;
}

export const ordersApi = {
  create: (data: CreateOrderPayload) =>
    apiClient.post<CreateOrderResponse>("/api/orders/", data),

  list: () =>
    apiClient.get<OrderResponse[]>("/api/orders/"),

  getById: (id: string) =>
    apiClient.get<OrderResponse>(`/api/orders/${id}`),
};
