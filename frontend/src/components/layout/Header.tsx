import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/authSlice";
import { toggleTheme, setLanguage } from "../../store/uiSlice";

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { theme } = useAppSelector((s) => s.ui);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleLangToggle = () => {
    const next = i18n.language === "en" ? "pl" : "en";
    i18n.changeLanguage(next);
    dispatch(setLanguage(next as "en" | "pl"));
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-primary-600 dark:text-primary-400"
        : "text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">ShoesBags</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>{t("nav.home")}</NavLink>
            <NavLink to="/products?category=shoes" className={navLinkClass}>{t("nav.shoes")}</NavLink>
            <NavLink to="/products?category=bags" className={navLinkClass}>{t("nav.bags")}</NavLink>
            <NavLink to="/contact" className={navLinkClass}>{t("nav.contact")}</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={handleLangToggle}
              className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle language"
            >
              {i18n.language === "en" ? "PL" : "EN"}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={`${t("nav.cart")} (${cartCount})`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === "admin" && (
                  <Link to="/admin" className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                    {t("nav.admin")}
                  </Link>
                )}
                <Link to="/profile" className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  {user?.full_name?.split(" ")[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-3">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>{t("nav.home")}</NavLink>
            <NavLink to="/products" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t("nav.shoes")}</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t("nav.contact")}</NavLink>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block text-sm text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>{t("nav.profile")}</Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="block text-sm text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>{t("nav.admin")}</Link>
                )}
                <button onClick={handleLogout} className="block text-sm text-red-500">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/register" className="block text-sm text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>{t("nav.register")}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
