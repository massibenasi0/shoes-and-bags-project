export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  brand: string | null;
  created_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductFilters {
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  sort_by?: "price_asc" | "price_desc" | "newest" | "name";
  is_featured?: boolean;
  page?: number;
  page_size?: number;
}
