"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * HOC component to protect routes requiring authentication
 * Shows loader during auth check
 * Redirects to login if not authenticated
 * Redirects to home if admin access required but user is not admin
 */
export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        // Not authenticated, redirect to login
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else if (requireAdmin && !isAdmin) {
        // Authenticated but not admin
        router.push("/");
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, requireAdmin, router]);

  // Show loader while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isLoggedIn) {
    return null;
  }

  // Authenticated but requires admin
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
};
