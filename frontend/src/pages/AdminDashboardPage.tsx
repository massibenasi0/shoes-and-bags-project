import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { adminApi, AdminOrder, AdminPayment, AdminProduct, AdminStats } from "../api/admin";
import { paymentsApi } from "../api/payments";
import { ordersApi } from "../api/orders";
import { formatCurrency } from "../utils/formatCurrency";
import { Button } from "../components/common/Button";
import { Spinner } from "../components/common/Spinner";

type Tab = "products" | "orders" | "payments";

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  offline_pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  offline_approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  offline_rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div className={`rounded-xl p-5 ${color}`}>
    <p className="text-sm font-medium opacity-80">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

// ── Products tab ──────────────────────────────────────────────────────────────
const ProductsTab: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState({
    name: "", price: "", stock: "", brand: "", description: "",
    images: "", sizes: "", colors: "", category_id: "", compare_at_price: "",
  });

  const load = () => {
    setLoading(true);
    adminApi.getProducts().then(r => { setProducts(r.data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: "", price: "", stock: "", brand: "", description: "", images: "", sizes: "", colors: "", category_id: "", compare_at_price: "" });
    setShowForm(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditTarget(p);
    setForm({
      name: p.name, price: String(p.price), stock: String(p.stock),
      brand: p.brand ?? "", description: p.description ?? "",
      images: p.images.join(", "), sizes: p.sizes.join(", "),
      colors: p.colors.join(", "), category_id: p.category_id,
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload: Record<string, unknown> = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      brand: form.brand || null,
      description: form.description || null,
      images: form.images.split(",").map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map(s => s.trim()).filter(Boolean),
      category_id: form.category_id,
    };
    if (form.compare_at_price) payload.compare_at_price = parseFloat(form.compare_at_price);

    try {
      if (editTarget) {
        await ordersApi.list(); // dummy — use products API
        const { default: apiClient } = await import("../api/client");
        await apiClient.put(`/api/products/${editTarget.id}`, payload);
        toast.success("Product updated");
      } else {
        const { default: apiClient } = await import("../api/client");
        await apiClient.post("/api/products", payload);
        toast.success("Product created");
      }
      setShowForm(false);
      load();
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const { default: apiClient } = await import("../api/client");
      await apiClient.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} products</p>
        <Button size="sm" onClick={openAdd}>+ {t("admin.add_product")}</Button>
      </div>

      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            {editTarget ? "Edit Product" : "Add Product"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Name *" },
              { key: "price", label: "Price *", type: "number" },
              { key: "compare_at_price", label: "Compare at price", type: "number" },
              { key: "stock", label: "Stock", type: "number" },
              { key: "brand", label: "Brand" },
              { key: "category_id", label: "Category ID *" },
              { key: "sizes", label: "Sizes (comma-separated)" },
              { key: "colors", label: "Colors (comma-separated)" },
              { key: "images", label: "Image URLs (comma-separated)" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                <input
                  type={type ?? "text"}
                  value={(form as Record<string, string>)[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:text-white"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Stock</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map(p => (
              <tr key={p.id}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">{formatCurrency(p.price)}</td>
                <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">{p.stock}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-500"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-xs text-blue-600 hover:underline">{t("common.edit")}</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:underline">{t("common.delete")}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Orders tab ────────────────────────────────────────────────────────────────
const OrdersTab: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getOrders().then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-3 pr-4">Order ID</th>
            <th className="pb-3 pr-4">{t("admin.customer")}</th>
            <th className="pb-3 pr-4">{t("admin.date")}</th>
            <th className="pb-3 pr-4">{t("admin.amount")}</th>
            <th className="pb-3 pr-4">Items</th>
            <th className="pb-3">{t("admin.status")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {orders.length === 0 && (
            <tr><td colSpan={6} className="py-8 text-center text-gray-400">No orders yet</td></tr>
          )}
          {orders.map(o => (
            <tr key={o.id}>
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">{o.id.slice(0, 8).toUpperCase()}</td>
              <td className="py-3 pr-4">
                <p className="text-gray-900 dark:text-white font-medium">{o.user_name}</p>
                <p className="text-xs text-gray-400">{o.user_email}</p>
              </td>
              <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                {new Date(o.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">
                {formatCurrency(o.total_amount)}
              </td>
              <td className="py-3 pr-4 text-gray-500">{o.items_count}</td>
              <td className="py-3">
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                  className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${STATUS_STYLE[o.status] ?? "bg-gray-100"}`}
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Payments tab ──────────────────────────────────────────────────────────────
const PaymentsTab: React.FC = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getPayments().then(r => { setPayments(r.data); setLoading(false); });
  }, []);

  const handleReview = async (orderId: string, action: "approve" | "reject") => {
    try {
      const { default: apiClient } = await import("../api/client");
      await apiClient.post(`/api/payments/offline/${orderId}/review`, { action });
      toast.success(`Payment ${action}d`);
      adminApi.getPayments().then(r => setPayments(r.data));
    } catch {
      toast.error("Failed to process payment");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-3 pr-4">Order</th>
            <th className="pb-3 pr-4">{t("admin.customer")}</th>
            <th className="pb-3 pr-4">{t("admin.amount")}</th>
            <th className="pb-3 pr-4">Method</th>
            <th className="pb-3 pr-4">{t("admin.status")}</th>
            <th className="pb-3">{t("admin.action")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {payments.length === 0 && (
            <tr><td colSpan={6} className="py-8 text-center text-gray-400">No payments yet</td></tr>
          )}
          {payments.map(p => (
            <tr key={p.id}>
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">{p.order_id.slice(0, 8).toUpperCase()}</td>
              <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">{p.user_email}</td>
              <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">{formatCurrency(p.amount)}</td>
              <td className="py-3 pr-4 text-gray-500 capitalize">{p.method}</td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {p.status.replace(/_/g, " ")}
                </span>
              </td>
              <td className="py-3">
                {p.status === "offline_pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleReview(p.order_id, "approve")} className="text-xs text-green-600 hover:underline font-medium">{t("admin.approve")}</button>
                    <button onClick={() => handleReview(p.order_id, "reject")} className="text-xs text-red-500 hover:underline font-medium">{t("admin.reject")}</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Root component ────────────────────────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("orders");
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "orders", label: t("admin.orders") },
    { key: "payments", label: t("admin.payments") },
    { key: "products", label: t("admin.products") },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("admin.dashboard")}</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label={t("admin.orders")} value={stats.total_orders} color="bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100" />
          <StatCard label="Revenue" value={formatCurrency(stats.total_revenue)} color="bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-100" />
          <StatCard label="Pending Payments" value={stats.pending_payments} color="bg-orange-50 text-orange-900 dark:bg-orange-900/30 dark:text-orange-100" />
          <StatCard label={t("admin.products")} value={stats.total_products} color="bg-purple-50 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100" />
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === "products" && <ProductsTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "payments" && <PaymentsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
