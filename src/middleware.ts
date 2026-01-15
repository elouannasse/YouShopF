import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection
 * Protects admin and authenticated routes
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie or check for auth
  const token = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!token;

  // Define protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/(auth)");
  const isPublicAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Redirect authenticated users away from login/register
  if (isAuthenticated && isPublicAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && isAuthRoute && !isPublicAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (isAdminRoute) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Note: Additional role check should be done in the server component
    // as middleware cannot access user role from token without verification
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
