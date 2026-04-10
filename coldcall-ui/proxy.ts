import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/prospects", "/campaigns", "/calls", "/reports"];
const authPages = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = authPages.includes(pathname);
  const accessToken = request.cookies.get("access_token")?.value;

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isProtected) return NextResponse.next();

  if (accessToken) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/prospects/:path*", "/campaigns/:path*", "/calls/:path*", "/reports/:path*"],
};

