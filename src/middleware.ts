import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection
 * Protects admin, checkout, profile, and orders routes
 * Redirects to login with redirect query param
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!token;

  // Define route patterns
  const isAdminRoute = pathname.startsWith("/admin");
  const isCheckoutRoute = pathname.startsWith("/checkout");
  const isProfileRoute = pathname.startsWith("/profile");
  const isOrdersRoute = pathname.startsWith("/orders");
  const isPublicAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Redirect authenticated users away from register only
  if (isAuthenticated && pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected routes that require authentication
  const requiresAuth =
    isAdminRoute || isCheckoutRoute || isProfileRoute || isOrdersRoute;

  // Redirect unauthenticated users from protected routes with redirect param
  if (!isAuthenticated && requiresAuth) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Note: Admin role check should be done in server components
  // Middleware cannot decode JWT to check user role

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
