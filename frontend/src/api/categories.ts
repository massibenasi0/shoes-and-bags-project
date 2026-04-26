import apiClient from "./client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const categoriesApi = {
  list: () => apiClient.get<Category[]>("/api/categories"),
  getById: (id: string) => apiClient.get<Category>(`/api/categories/${id}`),
  create: (data: { name: string; slug: string; description?: string }) =>
    apiClient.post<Category>("/api/categories", data),
  delete: (id: string) => apiClient.delete(`/api/categories/${id}`),
};
