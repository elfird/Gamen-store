import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "gamen-store-super-secret-jwt-key-production-ready-2026"
);

const COOKIE_NAME = "gamen_admin_session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow login page and public auth API endpoints freely
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/orders") ||
    pathname.startsWith("/api/cart") ||
    pathname.startsWith("/api/products")
  ) {
    return NextResponse.next();
  }

  // 2. Protect Admin Pages (/admin/*)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (!payload || !payload.userId) {
        throw new Error("Invalid payload");
      }
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // 3. Protect Admin API Routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (!payload || !payload.userId) {
        return NextResponse.json(
          { success: false, error: "Sesi tidak valid." },
          { status: 401 }
        );
      }
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { success: false, error: "Sesi kedaluwarsa. Silakan login kembali." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
