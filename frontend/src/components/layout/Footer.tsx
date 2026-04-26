import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">ShoesBags</h3>
            <p className="text-sm">Premium shoes and bags for every style.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">{t("nav.shoes")}</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">{t("nav.bags")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">{t("nav.login")}</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">{t("nav.register")}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} ShoesBags. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
