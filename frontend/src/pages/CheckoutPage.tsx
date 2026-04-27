import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart } from "../store/cartSlice";
import { ordersApi, ShippingAddress } from "../api/orders";
import { formatCurrency } from "../utils/formatCurrency";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

// ── Stripe setup ──────────────────────────────────────────────────────────────
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise =
  STRIPE_KEY && !STRIPE_KEY.includes("placeholder") ? loadStripe(STRIPE_KEY) : null;

// ── Zod schema ────────────────────────────────────────────────────────────────
const shippingSchema = z.object({
  street: z.string().min(3, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  zip_code: z.string().min(3, "Required"),
  country: z.string().min(2, "Required"),
});
type ShippingForm = z.infer<typeof shippingSchema>;

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_COLOURS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  offline_pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

// ── Order confirmation screen ─────────────────────────────────────────────────
interface DoneProps {
  orderId: string;
  method: string;
  total: number;
}

const OrderConfirmation: React.FC<DoneProps> = ({ orderId, method, total }) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("orders.confirmed_title")}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t("orders.confirmed_subtitle")}</p>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 text-left mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t("orders.order_id")}</span>
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t("checkout.total")}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t("orders.payment_method")}</span>
          <span className="text-gray-700 dark:text-gray-300">
            {method === "stripe" ? t("checkout.pay_with_stripe") : t("checkout.pay_offline")}
          </span>
        </div>
      </div>

      {method === "offline" && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-left mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t("orders.bank_transfer_title")}</h3>
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <p><strong>{t("orders.bank_name")}:</strong> ShoesBags Bank</p>
            <p><strong>IBAN:</strong> PL61 1090 1014 0000 0712 1981 2874</p>
            <p><strong>BIC/SWIFT:</strong> WBKPPLPP</p>
            <p><strong>{t("orders.transfer_ref")}:</strong> {orderId.slice(0, 8).toUpperCase()}</p>
            <p><strong>{t("orders.amount")}:</strong> {formatCurrency(total)}</p>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">{t("orders.bank_transfer_note")}</p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link to="/orders">
          <Button variant="secondary">{t("orders.view_orders")}</Button>
        </Link>
        <Link to="/products">
          <Button>{t("orders.continue_shopping")}</Button>
        </Link>
      </div>
    </div>
  );
};

// ── Shipping address step ─────────────────────────────────────────────────────
interface ShippingStepProps {
  onNext: (addr: ShippingAddress) => void;
}

const ShippingStep: React.FC<ShippingStepProps> = ({ onNext }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({ resolver: zodResolver(shippingSchema) });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("checkout.shipping")}</h2>

      <Input label={t("checkout.street")} {...register("street")} error={errors.street?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label={t("checkout.city")} {...register("city")} error={errors.city?.message} />
        <Input label={t("checkout.state")} {...register("state")} error={errors.state?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label={t("checkout.zip")} {...register("zip_code")} error={errors.zip_code?.message} />
        <Input label={t("checkout.country")} {...register("country")} error={errors.country?.message} />
      </div>

      <Button type="submit" className="w-full" size="lg">{t("common.next")} →</Button>
    </form>
  );
};

// ── Payment step (uses Stripe hooks — must be inside <Elements>) ──────────────
interface PaymentStepProps {
  shipping: ShippingAddress;
  onBack: () => void;
  onDone: (result: DoneProps) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ shipping, onBack, onDone }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);
  const stripe = useStripe();
  const elements = useElements();

  const [method, setMethod] = useState<"stripe" | "offline">(stripePromise ? "stripe" : "offline");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          size: i.size || undefined,
          color: i.color || undefined,
        })),
        shipping_address: shipping,
        payment_method: method,
      };

      const { data } = await ordersApi.create(payload);

      if (method === "stripe" && data.client_secret && stripe && elements) {
        const card = elements.getElement(CardElement);
        if (!card) throw new Error("Card element not mounted");

        const result = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: { card },
        });

        if (result.error) {
          toast.error(result.error.message ?? t("common.error"));
          setSubmitting(false);
          return;
        }
      }

      dispatch(clearCart());
      onDone({ orderId: data.order_id, method, total: data.total_amount });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        t("common.error");
      toast.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("checkout.payment")}</h2>

      {/* Payment method selector */}
      <div className="space-y-3">
        {stripePromise && (
          <label
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              method === "stripe"
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <input
              type="radio"
              name="method"
              value="stripe"
              checked={method === "stripe"}
              onChange={() => setMethod("stripe")}
              className="mt-1"
            />
            <div>
              <span className="font-medium text-gray-900 dark:text-white">{t("checkout.pay_with_stripe")}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("checkout.stripe_desc")}</p>
            </div>
          </label>
        )}

        <label
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            method === "offline"
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <input
            type="radio"
            name="method"
            value="offline"
            checked={method === "offline"}
            onChange={() => setMethod("offline")}
            className="mt-1"
          />
          <div>
            <span className="font-medium text-gray-900 dark:text-white">{t("checkout.pay_offline")}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("checkout.offline_desc")}</p>
          </div>
        </label>
      </div>

      {/* Stripe card input */}
      {method === "stripe" && stripePromise && (
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#374151",
                  fontFamily: "system-ui, sans-serif",
                  "::placeholder": { color: "#9CA3AF" },
                },
                invalid: { color: "#EF4444" },
              },
            }}
          />
        </div>
      )}

      {method === "offline" && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-sm text-blue-800 dark:text-blue-300">
          {t("checkout.offline_info")}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} disabled={submitting}>
          ← {t("common.back")}
        </Button>
        <Button className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={submitting}>
          {submitting ? t("common.loading") : t("checkout.place_order")}
        </Button>
      </div>
    </div>
  );
};

// ── Order summary sidebar ─────────────────────────────────────────────────────
const OrderSummary: React.FC = () => {
  const { t } = useTranslation();
  const { items } = useAppSelector((s) => s.cart);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t("checkout.order_summary")}</h2>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex gap-3">
            <img
              src={item.image || "https://placehold.co/48x48?text=Img"}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">×{item.quantity}</p>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{t("cart.subtotal")}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>{t("checkout.total")}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </div>
  );
};

// ── Root component ────────────────────────────────────────────────────────────
const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items } = useAppSelector((s) => s.cart);

  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [shipping, setShipping] = useState<ShippingAddress | null>(null);
  const [done, setDone] = useState<DoneProps | null>(null);

  if (items.length === 0 && !done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">{t("cart.empty")}</p>
        <Button onClick={() => navigate("/products")}>{t("cart.empty_cta")}</Button>
      </div>
    );
  }

  if (done) return <OrderConfirmation {...done} />;

  const steps = [t("checkout.shipping"), t("checkout.payment")];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("checkout.title")}</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, idx) => {
          const active = (idx === 0 && step === "shipping") || (idx === 1 && step === "payment");
          const complete = idx === 0 && step === "payment";
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
                    ${complete ? "bg-green-500 text-white" : active ? "bg-primary-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
                >
                  {complete ? "✓" : idx + 1}
                </div>
                <span className={`text-sm font-medium ${active ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-px ${complete ? "bg-green-400" : "bg-gray-200 dark:bg-gray-700"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <Elements stripe={stripePromise}>
              {step === "shipping" ? (
                <ShippingStep
                  onNext={(addr) => {
                    setShipping(addr);
                    setStep("payment");
                  }}
                />
              ) : (
                <PaymentStep
                  shipping={shipping!}
                  onBack={() => setStep("shipping")}
                  onDone={setDone}
                />
              )}
            </Elements>
          </div>
        </div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
