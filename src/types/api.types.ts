/**
 * API Types for YouShop Backend
 * All TypeScript interfaces matching the backend API
 */

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
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
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  images: string[];
  category: Category | string;
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
  createdAt: string;
  updatedAt: string;
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
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Category | string | null;
  children?: Category[];
  productsCount?: number;
  isActive?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
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
