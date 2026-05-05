import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts } from "../store/productSlice";
import { ProductFilters } from "../types/product";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilter from "../components/product/ProductFilter";
import { Pagination } from "../components/common/Pagination";
import { categoriesApi, Category } from "../api/categories";
import { SORT_OPTIONS } from "../utils/constants";
import { Input } from "../components/common/Input";

const ProductListPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  const slugParam = searchParams.get("category");
  const idParam = searchParams.get("category_id");

  const [filters, setFilters] = useState<ProductFilters>({
    category_id: idParam ?? undefined,
    search: searchParams.get("search") ?? undefined,
    sort_by: (searchParams.get("sort_by") as ProductFilters["sort_by"]) ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    page_size: 12,
  });

  // Load categories once
  useEffect(() => {
    categoriesApi.list().then((r) => setCategories(r.data));
  }, []);

  // Resolve slug → category_id once categories are loaded (only if no id in URL yet)
  useEffect(() => {
    if (slugParam && categories.length > 0 && !idParam) {
      const cat = categories.find((c) => c.slug === slugParam);
      if (cat) {
        setFilters((prev) => ({ ...prev, category_id: cat.id, page: 1 }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]); // only re-run when categories first load

  // Fetch products whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters, dispatch]);

  // Sync filters → URL (runs after fetch, no circular dependency)
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.category_id) params.category_id = filters.category_id;
    if (slugParam) params.category = slugParam;
    if (filters.search) params.search = filters.search;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.page && filters.page > 1) params.page = String(filters.page);
    setSearchParams(params, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // intentionally exclude setSearchParams to prevent infinite loop

  const updateFilters = useCallback((updated: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated, page: 1 }));
  }, []);

  const activeCategory = categories.find(
    (c) => c.id === filters.category_id || c.slug === slugParam
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page title when filtered by category */}
      {activeCategory && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeCategory.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeCategory.description}
          </p>
        </div>
      )}

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder={t("product.search")}
            value={filters.search ?? ""}
            onChange={(e) => updateFilters({ search: e.target.value || undefined })}
          />
        </div>
        <select
          value={filters.sort_by ?? ""}
          onChange={(e) => updateFilters({ sort_by: (e.target.value as ProductFilters["sort_by"]) || undefined })}
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">{t("product.sort_by")}</option>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <ProductFilter
            filters={filters}
            categories={categories}
            onChange={updateFilters}
          />
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {!loading && list && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {list.total} {list.total === 1 ? "product" : "products"} found
            </p>
          )}
          <ProductGrid products={list?.items ?? []} loading={loading} />
          {list && (
            <Pagination
              currentPage={filters.page ?? 1}
              totalPages={list.total_pages}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
