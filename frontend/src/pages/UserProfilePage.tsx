import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrders } from "../store/orderSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { authApi } from "../api/auth";
import { fetchCurrentUser } from "../store/authSlice";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { orders, loading: ordersLoading } = useAppSelector((s) => s.orders);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setName(user?.full_name ?? "");
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { default: apiClient } = await import("../api/client");
      await apiClient.put("/api/auth/me", { full_name: name.trim() });
      await dispatch(fetchCurrentUser());
      toast.success("Name updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("nav.profile")}</h1>

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name */}
            {editing ? (
              <div className="flex items-center gap-3 mb-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-xs"
                  autoFocus
                />
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? t("common.loading") : t("common.save")}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => { setEditing(false); setName(user?.full_name ?? ""); }}>
                  {t("common.cancel")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.full_name}</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {t("common.edit")}
                </button>
              </div>
            )}

            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>

            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                user?.role === "admin"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              }`}>
                {user?.role}
              </span>
              {user?.created_at && (
                <span className="text-xs text-gray-400">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{t("orders.title")}</h2>
          <Link to="/orders" className="text-sm text-primary-600 hover:underline">
            {t("orders.view_orders")} →
          </Link>
        </div>

        {ordersLoading ? (
          <p className="text-sm text-gray-400 py-4 text-center">{t("common.loading")}</p>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-3">{t("orders.empty")}</p>
            <Link to="/products">
              <Button size="sm" variant="secondary">{t("orders.continue_shopping")}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="text-xs font-mono text-gray-400">{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()} · {order.items.length} {t("cart.items")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(order.total_amount)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
