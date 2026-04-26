import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts } from "../store/productSlice";
import ProductGrid from "../components/product/ProductGrid";
import { categoriesApi, Category } from "../api/categories";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.products);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    dispatch(fetchProducts({ is_featured: true, page_size: 8 }));
    categoriesApi.list().then((r) => setCategories(r.data));
  }, [dispatch]);

  const shoesCategory = categories.find((c) => c.slug === "shoes");
  const bagsCategory = categories.find((c) => c.slug === "bags");

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              {t("home.hero_title")}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              {t("home.hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={shoesCategory ? `/products?category_id=${shoesCategory.id}` : "/products"}
                className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
              >
                {t("home.shop_shoes")}
              </Link>
              <Link
                to={bagsCategory ? `/products?category_id=${bagsCategory.id}` : "/products"}
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                {t("home.shop_bags")}
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative shape */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50 dark:bg-gray-950" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </section>

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t("home.categories")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to={shoesCategory ? `/products?category_id=${shoesCategory.id}` : "/products"}
            className="group relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-end p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div>
              <h3 className="text-3xl font-bold text-white">{t("nav.shoes")}</h3>
              <p className="text-indigo-200 mt-1">{t("home.shop_shoes")} →</p>
            </div>
          </Link>
          <Link
            to={bagsCategory ? `/products?category_id=${bagsCategory.id}` : "/products"}
            className="group relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 flex items-end p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div>
              <h3 className="text-3xl font-bold text-white">{t("nav.bags")}</h3>
              <p className="text-amber-200 mt-1">{t("home.shop_bags")} →</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("home.featured")}</h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={list?.items ?? []} loading={loading} />
      </section>
    </div>
  );
};

export default HomePage;
