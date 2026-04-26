import { Product, ProductFilters, ProductListResponse } from "../types/product";
import apiClient from "./client";

export const productsApi = {
  list: (filters: ProductFilters = {}) =>
    apiClient.get<ProductListResponse>("/api/products", { params: filters }),

  getById: (id: string) =>
    apiClient.get<Product>(`/api/products/${id}`),

  create: (data: Partial<Product>) =>
    apiClient.post<Product>("/api/products", data),

  update: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/api/products/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/products/${id}`),
};
