"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LoginCredentials, RegisterData } from "@/types/api.types";

/**
 * Custom hook for authentication
 * Provides login, register, logout functions and auth state
 */
export const useAuth = () => {
  const router = useRouter();
  const { user, token, isAuthenticated, login, logout, setLoading, isLoading } =
    useAuthStore();
  const [error, setError] = useState<string | null>(null);

  /**
   * Login user
   */
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success && response.token && response.user) {
        login(response.user, response.token);
        router.push("/");
        return { success: true };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const handleRegister = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(data);

      if (response.success && response.token && response.user) {
        login(response.user, response.token);
        router.push("/");
        return { success: true };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      router.push("/login");
    }
  };

  /**
   * Check if user is admin
   */
  const isAdmin = user?.role === "admin";

  /**
   * Check if user is logged in
   */
  const isLoggedIn = isAuthenticated && !!user;

  return {
    user,
    token,
    isAuthenticated,
    isLoggedIn,
    isAdmin,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    setError,
  };
};
