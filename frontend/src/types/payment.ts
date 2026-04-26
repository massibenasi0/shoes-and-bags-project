export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "offline_pending"
  | "offline_approved"
  | "offline_rejected";

export type PaymentMethod = "stripe" | "offline";

export interface Payment {
  id: string;
  order_id: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  failure_reason: string | null;
  admin_notes: string | null;
  created_at: string;
}
