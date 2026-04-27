import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrder } from "../store/orderSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { Spinner } from "../components/common/Spinner";
import { Button } from "../components/common/Button";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentOrder: order, loading, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrder(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error ?? t("orders.not_found")}</p>
        <Link to="/orders"><Button variant="secondary">← {t("orders.title")}</Button></Link>
      </div>
    );
  }

  const addr = order.shipping_address;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 inline-block">
        ← {t("orders.title")}
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("orders.detail_title")}</h1>
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1">{order.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-800"}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t("checkout.shipping")}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>{addr.street}</p>
            <p>{addr.city}, {addr.state} {addr.zip_code}</p>
            <p>{addr.country}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t("orders.summary")}</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{t("orders.placed_on")}</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>{t("checkout.total")}</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t("orders.items")}</h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">
                {item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.size && `${t("product.size")}: ${item.size}`}
                  {item.size && item.color && " · "}
                  {item.color && `${t("product.color")}: ${item.color}`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">×{item.quantity} @ {formatCurrency(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
