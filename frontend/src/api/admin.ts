import apiClient from "./client";

export interface AdminStats {
  total_orders: number;
  total_revenue: number;
  pending_payments: number;
  total_products: number;
}

export interface AdminOrder {
  id: string;
  user_email: string;
  user_name: string;
  status: string;
  total_amount: number;
  items_count: number;
  created_at: string;
}

export interface AdminPayment {
  id: string;
  order_id: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  brand?: string;
  is_active: boolean;
  is_featured: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  category_id: string;
  description?: string;
}

export const adminApi = {
  getStats: () => apiClient.get<AdminStats>("/api/admin/stats"),
  getOrders: () => apiClient.get<AdminOrder[]>("/api/admin/orders"),
  updateOrderStatus: (id: string, status: string) =>
    apiClient.put(`/api/admin/orders/${id}/status`, { status }),
  getPayments: () => apiClient.get<AdminPayment[]>("/api/admin/payments"),
  getProducts: () => apiClient.get<AdminProduct[]>("/api/admin/products"),
};
