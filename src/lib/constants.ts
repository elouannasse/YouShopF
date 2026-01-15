/**
 * Application constants for YouShop
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: "/products/search",
    FEATURED: "/products/featured",
    BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
  },
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id: string) => `/categories/${id}`,
  },
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  CART: {
    GET: "/cart",
    ADD: "/cart/items",
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: "/cart/clear",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/profile",
    ADDRESSES: "/users/addresses",
  },
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

// Payment methods
export const PAYMENT_METHODS = {
  CARD: "card",
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Carte bancaire",
  paypal: "PayPal",
  bank_transfer: "Virement bancaire",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER: "user",
  CART: "cart",
  THEME: "theme",
} as const;

// Image placeholders
export const PLACEHOLDERS = {
  PRODUCT: "/placeholder-product.jpg",
  AVATAR: "/placeholder-avatar.jpg",
  CATEGORY: "/placeholder-category.jpg",
} as const;

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_REGEX: /^(\+33|0)[1-9](\d{2}){4}$/,
  POSTAL_CODE_REGEX: /^\d{5}$/,
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Toast duration (ms)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 3000,
} as const;

// Navbar height
export const LAYOUT = {
  NAVBAR_HEIGHT: 64,
  FOOTER_HEIGHT: 200,
} as const;

// Breakpoints (sync with Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Max file upload size (bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed file types for uploads
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
