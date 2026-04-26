import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Full checkout (Stripe + offline) is implemented in Phase 2
const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("checkout.title")}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Full checkout flow (Stripe payments + offline approval) is coming in Phase 2.
      </p>
      <Link to="/cart" className="text-primary-600 hover:underline">← {t("common.back")} to cart</Link>
    </div>
  );
};

export default CheckoutPage;
