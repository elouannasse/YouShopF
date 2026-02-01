/**
 * API Types for YouShop Backend
 * All TypeScript interfaces matching the backend API
 */

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string; // Deprecated, kept for backward compatibility
  email: string;
  role: "user" | "admin" | "ADMIN" | "CLIENT"; // Support both cases
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success?: boolean;
  accessToken: string; // Backend returns accessToken
  token?: string; // Deprecated, for backward compatibility
  user: User;
  message?: string;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
  id: string; // NestJS uses 'id', not '_id'
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  imageUrl?: string; // NestJS uses single imageUrl
  images?: string[]; // Optional array for multiple images
  category?: Category | string;
  categoryId?: string;
  brand?: string;
  stock: number;
  sku?: string;
  tags?: string[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  soldCount?: number;
  slug?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  options: string[];
  price?: number;
  stock?: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular" | "rating";
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id?: string; // NestJS uses 'id'
  _id?: string; // MongoDB uses '_id' - support both for compatibility
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parent?: Category | string | null;
  children?: Category[];
  productsCount?: number;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  _id?: string;
  product: Product | string;
  productId?: string;
  name?: string;
  price?: number;
  image?: string;
  quantity: number;
  variant?: {
    name: string;
    option: string;
  };
  subtotal?: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  subtotal: number;
  tax?: number;
  shippingCost?: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  variant?: {
    name: string;
    option: string;
  };
}

export interface UpdateCartItemData {
  quantity: number;
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";

export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: "card" | "paypal" | "bank_transfer";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  status: OrderStatus; // Simplified status for frontend
  expiresAt: string; // When PENDING order expires (30 min after creation)
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id?: string;
  product: Product | string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: {
    name: string;
    option: string;
  };
  subtotal: number;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    variant?: {
      name: string;
      option: string;
    };
  }>;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: "card" | "paypal" | "bank_transfer";
  notes?: string;
}

export interface CalculateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  _id: string;
  product: Product | string;
  user: User | string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpful?: number;
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}

export interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  averageRating?: number;
  totalReviews?: number;
}

// ============================================
// COMMON TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// ============================================
// STATISTICS & DASHBOARD TYPES (Admin)
// ============================================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
}
