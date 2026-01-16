import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// Use relative /api path - Next.js rewrites will proxy to backend (port 3001)
// Frontend: /api/auth/login → Next.js rewrite → Backend: /auth/login
// The /api prefix is removed before forwarding to backend
const API_URL = "/api";

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable CORS credentials
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Zustand store (via localStorage persist)
    if (typeof window !== "undefined") {
      // Try to get token from Zustand persisted state first
      const authStorage = localStorage.getItem("auth-storage");
      let token = null;

      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed.state?.token;
        } catch (e) {
          console.error("Failed to parse auth storage", e);
        }
      }

      // Fallback to direct authToken (backward compatibility)
      if (!token) {
        token = localStorage.getItem("authToken");
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.error("[API Error] 401 Unauthorized - Clearing auth data");
      if (typeof window !== "undefined") {
        // Clear all auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        localStorage.removeItem("user");
        localStorage.removeItem("auth-storage"); // Clear Zustand store

        // Redirect to login page (avoid infinite loop)
        if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
          console.log("[API Error] Redirecting to login");
          window.location.href = "/login?error=session_expired";
        }
      }
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      console.error("[API Error] 403 Forbidden - Insufficient permissions");
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("[API Error] 404 Not Found - Resource not found", error.config?.url);
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("[API Error] 500 Server Error");
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }

    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export default api;
