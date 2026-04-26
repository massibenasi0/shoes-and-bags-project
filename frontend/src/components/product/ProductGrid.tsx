import React from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import { Spinner } from "../common/Spinner";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, emptyMessage }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p>{emptyMessage ?? t("product.no_results")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
