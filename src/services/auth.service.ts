import api from "@/lib/api";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ApiResponse,
} from "@/types/api.types";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Manages localStorage for token and user data
 */

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export const authService = {
  /**
   * Login user and save to localStorage
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("[Auth Service] Login attempt:", credentials.email);
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      console.log("[Auth Service] Login response:", response.data);

      // Backend returns { accessToken, user }
      const { accessToken, user } = response.data;

      if (accessToken && user) {
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          
          // Set cookie for middleware
          document.cookie = `authToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          
          console.log("[Auth Service] Token and user saved to localStorage and cookie");
        }
      }

      return response.data;
    } catch (error: any) {
      console.error("[Auth Service] Login error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Register new user and save to localStorage
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log("[Auth Service] Register attempt:", data.email);
      const response = await api.post<AuthResponse>("/auth/register", data);
      console.log("[Auth Service] Register response:", response.data);

      // Backend returns { accessToken, user }
      const { accessToken, user } = response.data;

      if (accessToken && user) {
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          
          // Set cookie for middleware
          document.cookie = `authToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          
          console.log("[Auth Service] Token and user saved to localStorage and cookie");
        }
      }

      return response.data;
    } catch (error: any) {
      console.error("[Auth Service] Register error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Logout user and clear localStorage
   */
  async logout(): Promise<ApiResponse> {
    try {
      console.log("[Auth Service] Logout");
      const response = await api.post<ApiResponse>("/auth/logout");
      this.clearAuth();
      return response.data;
    } catch (error: any) {
      console.error("[Auth Service] Logout error:", error);
      // Clear auth even if request fails
      this.clearAuth();
      throw error;
    }
  },

  /**
   * Get current user profile from API
   */
  async getCurrentUser(): Promise<User> {
    try {
      console.log("[Auth Service] Fetching current user");
      const response = await api.get<ApiResponse<User>>("/auth/me");
      console.log("[Auth Service] Current user:", response.data.data);
      
      // Update localStorage with fresh user data
      if (response.data.data && typeof window !== "undefined") {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
      }
      
      return response.data.data!;
    } catch (error: any) {
      console.error("[Auth Service] Get current user error:", error);
      throw error;
    }
  },

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      console.log("[Auth Service] Refreshing token");
      const response = await api.post<AuthResponse>("/auth/refresh");
      
      const { accessToken } = response.data;
      if (accessToken && typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, accessToken);
        console.log("[Auth Service] Token refreshed");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("[Auth Service] Refresh token error:", error);
      throw error;
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      console.log("[Auth Service] Forgot password for:", email);
      const response = await api.post<ApiResponse>("/auth/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      console.error("[Auth Service] Forgot password error:", error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    try {
      console.log("[Auth Service] Reset password");
      const response = await api.post<ApiResponse>("/auth/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error("[Auth Service] Reset password error:", error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      console.log("[Auth Service] Update profile");
      const response = await api.put<ApiResponse<User>>("/auth/profile", data);
      
      // Update localStorage with fresh user data
      if (response.data.data && typeof window !== "undefined") {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
      }
      
      return response.data.data!;
    } catch (error: any) {
      console.error("[Auth Service] Update profile error:", error);
      throw error;
    }
  },

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    try {
      console.log("[Auth Service] Change password");
      const response = await api.post<ApiResponse>("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      console.error("[Auth Service] Change password error:", error);
      throw error;
    }
  },

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem(TOKEN_KEY);
    const hasToken = !!token;
    console.log("[Auth Service] Is authenticated:", hasToken);
    return hasToken;
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr) as User;
      console.log("[Auth Service] Stored user:", user.email);
      return user;
    } catch (error) {
      console.error("[Auth Service] Error parsing stored user:", error);
      return null;
    }
  },

  /**
   * Get stored token from localStorage
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(TOKEN_KEY);
    console.log("[Auth Service] Token exists:", !!token);
    return token;
  },

  /**
   * Check if stored user is admin
   */
  isAdmin(): boolean {
    const user = this.getStoredUser();
    const isAdmin = user?.role === "admin";
    console.log("[Auth Service] Is admin:", isAdmin);
    return isAdmin;
  },

  /**
   * Clear all auth data from localStorage and cookies
   */
  clearAuth(): void {
    if (typeof window === "undefined") return;
    
    console.log("[Auth Service] Clearing auth data");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("auth-storage"); // Clear Zustand store
    
    // Clear cookie by setting it with expired date
    document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
  },
};
