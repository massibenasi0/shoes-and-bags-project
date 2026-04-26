import React from "react";
import { useTranslation } from "react-i18next";
import { ProductFilters } from "../../types/product";

interface Category {
  id: string;
  name: string;
}

interface ProductFilterProps {
  filters: ProductFilters;
  categories: Category[];
  onChange: (updated: Partial<ProductFilters>) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ filters, categories, onChange }) => {
  const { t } = useTranslation();

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t("product.filters")}</h3>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category_id}
              onChange={() => onChange({ category_id: undefined })}
              className="text-primary-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">All</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category_id === cat.id}
                onChange={() => onChange({ category_id: cat.id })}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("product.price_range")}</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price ?? ""}
            onChange={(e) => onChange({ min_price: e.target.value ? Number(e.target.value) : undefined })}
            className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm dark:bg-gray-800"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price ?? ""}
            onChange={(e) => onChange({ max_price: e.target.value ? Number(e.target.value) : undefined })}
            className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ category_id: undefined, min_price: undefined, max_price: undefined, search: undefined })}
        className="text-sm text-primary-600 hover:underline"
      >
        Reset filters
      </button>
    </aside>
  );
};

export default ProductFilter;
