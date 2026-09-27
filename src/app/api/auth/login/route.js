import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/services/admin-auth.service";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const { user, token } = await authenticateAdmin({ email, password });

    const response = NextResponse.json({
      success: true,
      data: { user },
      message: "Login berhasil.",
    });

    // Set secure session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal melakukan autentikasi.",
      },
      { status: 401 }
    );
  }
}
