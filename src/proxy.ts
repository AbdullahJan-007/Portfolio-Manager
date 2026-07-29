import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "portfolio_session";

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

// Next.js 16 renamed the `middleware` file/export convention to `proxy` (see
// https://nextjs.org/docs/messages/middleware-to-proxy). The behavior here
// is unchanged from the original middleware.ts — only the file name and
// exported function name changed, per the official migration guide. The
// `config`/`matcher` export below works identically either way.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const authed = await isValidToken(token);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  // Redirect unauthenticated users away from protected pages. This only
  // checks "is there a valid session" — role-specific access (e.g. only
  // ADMIN may reach /admin) is enforced in the relevant layout.tsx, where a
  // database lookup for the user's role is possible.
  if (isProtected && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from the auth pages.
  if (isAuthPage && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
