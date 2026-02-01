import api from "@/lib/api";
import type {
  Order,
  OrdersResponse,
  OrderResponse,
  CreateOrderData,
  CalculateOrderData,
  ApiResponse,
  PaginationParams,
} from "@/types/api.types";

/**
 * Orders Service
 * Handles all order-related API calls
 */

export const ordersService = {
  /**
   * Get all orders for current user
   */
  async getOrders(pagination?: PaginationParams): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>("/orders", {
      params: pagination,
    });
    return response.data;
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<OrderResponse>(`/orders/${id}`);
    return response.data.order;
  },

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get<OrderResponse>(
      `/orders/number/${orderNumber}`
    );
    return response.data.order;
  },

  /**
   * Create new order
   */
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post<OrderResponse>("/orders", data);
    return response.data.order;
  },

  /**
   * Calculate order summary WITHOUT creating order
   * Used in checkout to verify stock and get totals
   */
  async calculateOrderSummary(data: CalculateOrderData): Promise<Order> {
    const response = await api.post<OrderResponse>("/orders/calculate", data);
    return response.data.order;
  },

  /**
   * Pay an order
   */
  async payOrder(id: string): Promise<Order> {
    const response = await api.patch<OrderResponse>(`/orders/${id}/pay`);
    return response.data.order;
  },

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const response = await api.post<OrderResponse>(`/orders/${id}/cancel`, {
      reason,
    });
    return response.data.order;
  },

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(
    id: string,
    status: Order["orderStatus"]
  ): Promise<Order> {
    const response = await api.patch<OrderResponse>(`/orders/${id}/status`, {
      status,
    });
    return response.data.order;
  },

  /**
   * Update payment status (Admin only)
   */
  async updatePaymentStatus(
    id: string,
    status: Order["paymentStatus"]
  ): Promise<Order> {
    const response = await api.patch<OrderResponse>(`/orders/${id}/payment`, {
      status,
    });
    return response.data.order;
  },

  /**
   * Add tracking number (Admin only)
   */
  async addTracking(id: string, trackingNumber: string): Promise<Order> {
    const response = await api.patch<OrderResponse>(`/orders/${id}/tracking`, {
      trackingNumber,
    });
    return response.data.order;
  },

  /**
   * Get all orders (Admin only)
   */
  async getAllOrders(
    filters?: {
      status?: string;
      paymentStatus?: string;
      startDate?: string;
      endDate?: string;
    },
    pagination?: PaginationParams
  ): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>("/admin/orders", {
      params: { ...filters, ...pagination },
    });
    return response.data;
  },

  /**
   * Get order statistics (Admin only)
   */
  async getOrderStats(): Promise<any> {
    const response = await api.get<ApiResponse>("/admin/orders/stats");
    return response.data.data;
  },
};
