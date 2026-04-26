import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { Button } from "../components/common/Button";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <svg className="h-24 w-24 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">{t("cart.empty")}</h2>
        <Link to="/products">
          <Button size="lg">{t("cart.empty_cta")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t("cart.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.size}-${item.color}`}
              className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
            >
              <img
                src={item.image || "https://placehold.co/100x100?text=No+Img"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.size && <span>{t("product.size")}: {item.size} · </span>}
                  {item.color && <span>{t("product.color")}: {item.color}</span>}
                </div>
                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(updateQuantity({ product_id: item.product_id, size: item.size, color: item.color, quantity: item.quantity - 1 }))}
                      className="w-7 h-7 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ product_id: item.product_id, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                      className="w-7 h-7 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => dispatch(removeFromCart({ product_id: item.product_id, size: item.size, color: item.color }))}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
              <span>{t("cart.subtotal")}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-gray-900 dark:text-white text-lg mb-6">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <Link to="/checkout">
              <Button className="w-full" size="lg">{t("cart.checkout")}</Button>
            </Link>
            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
