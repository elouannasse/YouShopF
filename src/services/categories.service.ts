import api from "@/lib/api";
import type {
  Category,
  CategoriesResponse,
  ApiResponse,
} from "@/types/api.types";

/**
 * Categories Service
 * Handles all category-related API calls
 */

export const categoriesService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await api.get<CategoriesResponse>("/categories");
    return response.data.categories;
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data!;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(
      `/categories/slug/${slug}`
    );
    return response.data.data!;
  },

  /**
   * Get category tree (hierarchical structure)
   */
  async getCategoryTree(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/categories/tree");
    return response.data.data!;
  },

  /**
   * Get subcategories of a category
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>(
      `/categories/${parentId}/subcategories`
    );
    return response.data.data!;
  },

  /**
   * Create category (Admin only)
   */
  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>("/categories", data);
    return response.data.data!;
  },

  /**
   * Update category (Admin only)
   */
  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return response.data.data!;
  },

  /**
   * Delete category (Admin only)
   */
  async deleteCategory(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/categories/${id}`);
    return response.data;
  },
};
