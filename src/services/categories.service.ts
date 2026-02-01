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
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await api.get<any>("/categories");
      console.log("[Categories Service] Raw response:", response.data);
      
      // Handle different response formats
      let categories: Category[] = [];
      
      if (response.data) {
        // Format 1: NestJS paginated response { data: [...], total, page, limit }
        if (response.data.data && Array.isArray(response.data.data)) {
          categories = response.data.data;
        }
        // Format 2: Direct array response
        else if (Array.isArray(response.data)) {
          categories = response.data;
        }
        // Format 3: Already formatted response { success: true, categories: [...] }
        else if (response.data.categories && Array.isArray(response.data.categories)) {
          categories = response.data.categories;
        }
        // Format 4: Single category object wrapped
        else if (response.data.success && response.data.data) {
          categories = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        }
      }
      
      console.log("[Categories Service] Processed categories:", categories.length, categories);
      
      return {
        success: true,
        categories: categories,
      };
    } catch (error) {
      console.error("[Categories Service] Error fetching categories:", error);
      throw error;
    }
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
    console.log("[Categories Service] Updating category:", id, data);
    try {
      const response = await api.patch<ApiResponse<Category>>(
        `/categories/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      console.error("[Categories Service] Update error:", error);
      throw error;
    }
  },

  /**
   * Delete category (Admin only)
   */
  async deleteCategory(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/categories/${id}`);
    return response.data;
  },
};
