import api from "@/lib/api";
import type {
  Product,
  ProductsResponse,
  ProductFilters,
  ApiResponse,
  PaginationParams,
} from "@/types/api.types";

/**
 * Products Service
 * Handles all product-related API calls
 */

export const productsService = {
  /**
   * Get all products with filters and pagination
   */
  async getProducts(
    filters?: ProductFilters,
    pagination?: PaginationParams
  ): Promise<ProductsResponse> {
    const params = {
      ...filters,
      ...pagination,
    };
    const response = await api.get<any>("/products", { params });
    
    // NestJS returns { data: [], total, page, limit }
    // Transform to frontend format
    return {
      success: true,
      products: response.data.data || [],
      pagination: {
        page: response.data.page || 1,
        limit: response.data.limit || 12,
        total: response.data.total || 0,
        pages: Math.ceil((response.data.total || 0) / (response.data.limit || 12)),
      },
    };
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return response.data.data!;
  },

  /**
   * Search products
   */
  async searchProducts(
    query: string,
    pagination?: PaginationParams
  ): Promise<ProductsResponse> {
    const response = await api.get<any>("/products/search", {
      params: { q: query, ...pagination },
    });
    
    // Transform NestJS response
    return {
      success: true,
      products: response.data.data || [],
      pagination: {
        page: response.data.page || 1,
        limit: response.data.limit || 12,
        total: response.data.total || 0,
        pages: Math.ceil((response.data.total || 0) / (response.data.limit || 12)),
      },
    };
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const response = await api.get<any>("/products/featured", {
      params: { limit },
    });
    return response.data.data || [];
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: string,
    pagination?: PaginationParams
  ): Promise<ProductsResponse> {
    const response = await api.get<any>(
      `/products/category/${categoryId}`,
      { params: pagination }
    );
    
    // Transform NestJS response
    return {
      success: true,
      products: response.data.data || [],
      pagination: {
        page: response.data.page || 1,
        limit: response.data.limit || 12,
        total: response.data.total || 0,
        pages: Math.ceil((response.data.total || 0) / (response.data.limit || 12)),
      },
    };
  },

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string, limit?: number): Promise<Product[]> {
    const response = await api.get<any>(
      `/products/${productId}/related`,
      { params: { limit } }
    );
    return response.data.data || [];
  },

  /**
   * Create product (Admin only)
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>("/products", data);
    return response.data.data!;
  },

  /**
   * Update product (Admin only)
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete product (Admin only)
   */
  async deleteProduct(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/products/${id}`);
    return response.data;
  },

  /**
   * Update product stock (Admin only)
   */
  async updateStock(id: string, stock: number): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(
      `/products/${id}/stock`,
      { stock }
    );
    return response.data.data!;
  },
};
