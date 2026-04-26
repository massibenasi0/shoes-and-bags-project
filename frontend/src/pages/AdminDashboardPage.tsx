import React from "react";
import { useTranslation } from "react-i18next";

// Full admin dashboard (product/order/payment management) is implemented in Phase 3
const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("admin.dashboard")}</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Full admin dashboard (products, orders, offline payment approval) coming in Phase 3.
      </p>
    </div>
  );
};

export default AdminDashboardPage;
