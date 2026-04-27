import apiClient from "./client";

export interface PaymentResponse {
  id: string;
  order_id: string;
  stripe_payment_intent_id?: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  failure_reason?: string;
  admin_notes?: string;
  created_at: string;
}

export const paymentsApi = {
  getForOrder: (orderId: string) =>
    apiClient.get<PaymentResponse>(`/api/payments/order/${orderId}`),
};
