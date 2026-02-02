import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Allow public paths and static assets */
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  /*
   * Note: Since JWT tokens are stored in localStorage (client-side),
   * we can't verify them in middleware. The actual auth check happens
   * in the ProtectedRoute component on the client.
   *
   * This middleware is a lightweight first-pass guard.
   * The ProtectedRoute component handles the real redirect logic.
   */

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};