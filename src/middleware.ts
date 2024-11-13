import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect both /tokens/holders and individual token routes
  if (
    request.nextUrl.pathname.startsWith("/tokens/holders") ||
    (request.nextUrl.pathname.startsWith("/tokens/") &&
      request.nextUrl.pathname !== "/tokens")
  ) {
    const isAuthorized =
      request.cookies.get("memecoin_terminal_isAuthorized")?.value === "true";

    if (!isAuthorized) {
      return NextResponse.redirect(new URL("/tokens", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tokens/holders/:path*",
    "/tokens/:id*", // Add matcher for token ID routes
  ],
};
