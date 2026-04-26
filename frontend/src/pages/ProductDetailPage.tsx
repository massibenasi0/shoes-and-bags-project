import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductById, clearCurrentProduct } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { Spinner } from "../components/common/Spinner";
import { Button } from "../components/common/Button";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading, error } = useAppSelector((s) => s.products);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => { dispatch(clearCurrentProduct()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? "");
      setSelectedColor(product.colors[0] ?? "");
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    dispatch(addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity,
      size: selectedSize,
      color: selectedColor,
    }));
    toast.success("Added to cart!");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  if (error || !product) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-gray-500">{error ?? "Product not found"}</p>
      <Button variant="secondary" onClick={() => navigate(-1)}>{t("common.back")}</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        ← {t("common.back")}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={product.images[activeImage] || "https://placehold.co/600x600?text=No+Image"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === activeImage ? "border-primary-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {product.brand && (
            <p className="text-sm uppercase tracking-wide text-gray-400 font-medium">{product.brand}</p>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatCurrency(product.compare_at_price)}</span>
                <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-semibold px-2 py-0.5 rounded">
                  {t("product.sale")}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {product.stock > 0 ? `${t("product.in_stock")} (${product.stock})` : t("product.out_of_stock")}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("product.size")}: <span className="font-bold">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("product.color")}: <span className="font-bold">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("product.quantity")}</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            size="lg"
            className="w-full"
          >
            {product.stock === 0 ? t("product.out_of_stock") : t("product.add_to_cart")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
