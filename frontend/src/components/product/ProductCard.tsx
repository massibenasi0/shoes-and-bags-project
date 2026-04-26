import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatCurrency";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const image = product.images[0] || "https://placehold.co/400x400?text=No+Image";
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{t("product.out_of_stock")}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.price)}
          </span>
          {product.compare_at_price && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
