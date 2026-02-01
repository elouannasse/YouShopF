"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { LoginCredentials, RegisterData } from "@/types/api.types";

/**
 * Custom hook for authentication
 * Provides login, register, logout functions and auth state
 */
export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    setUser,
    setLoading,
    isLoading,
  } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Check auth on mount - Load from localStorage
  useEffect(() => {
    const checkAuth = async () => {
      console.log("[useAuth] Checking auth on mount");
      
      // Try to load from localStorage first
      const storedToken = authService.getToken();
      const storedUser = authService.getStoredUser();
      
      if (storedToken && storedUser && !user) {
        console.log("[useAuth] Found stored auth, restoring...");
        
        // Set cookie for middleware (in case it was cleared)
        if (typeof window !== "undefined") {
          document.cookie = `authToken=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
        
        login(storedUser, storedToken);
      } else if (token && !user) {
        // If we have token in Zustand but no user, fetch profile
        try {
          setLoading(true);
          const profile = await authService.getCurrentUser();
          setUser(profile);
        } catch (err) {
          console.error("[useAuth] Auth check failed:", err);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, []); // Run only once on mount

  /**
   * Login user
   */
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useAuth] Attempting login...");
      const response = await authService.login(credentials);
      console.log("[useAuth] Login response:", response);

      // Backend returns { accessToken, user }
      const accessToken = response.accessToken || response.token;
      const user = response.user;

      if (accessToken && user) {
        console.log("[useAuth] Login successful, updating Zustand store");
        login(user, accessToken);

        // Return user so calling component can redirect immediately
        return { success: true, user };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("[useAuth] Login error:", err);
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

      console.log("[useAuth] Attempting register...");
      const response = await authService.register(data);
      console.log("[useAuth] Register response:", response);

      // Backend returns { accessToken, user }
      const accessToken = response.accessToken || response.token;
      const user = response.user;

      if (accessToken && user) {
        console.log("[useAuth] Registration successful, updating Zustand store");
        login(user, accessToken);
        router.push("/");
        return { success: true };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("[useAuth] Register error:", err);
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
      console.log("[useAuth] Logging out...");
      await authService.logout();
    } catch (err) {
      console.error("[useAuth] Logout error:", err);
    } finally {
      logout();
      router.push("/login");
    }
  };

  /**
   * Check if user is admin
   */
  const isAdmin = user?.role?.toLowerCase() === "admin";

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
