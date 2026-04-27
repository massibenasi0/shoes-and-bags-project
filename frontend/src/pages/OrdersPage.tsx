import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrders } from "../store/orderSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { Spinner } from "../components/common/Spinner";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("orders.title")}</h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg className="h-20 w-20 text-gray-200 dark:text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t("orders.empty")}</p>
          <Link to="/products" className="text-primary-600 hover:underline">{t("orders.continue_shopping")}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-1">
                    {order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("orders.placed_on")} {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {order.items.length} {t("cart.items")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.total_amount)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-2 overflow-hidden">
                {order.items.slice(0, 4).map((item, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-400"
                    title={item.name}
                  >
                    {item.name.charAt(0)}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
