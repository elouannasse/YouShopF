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
 */

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/logout");
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data!;
  },

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh");
    return response.data;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>("/auth/profile", data);
    return response.data.data!;
  },

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
