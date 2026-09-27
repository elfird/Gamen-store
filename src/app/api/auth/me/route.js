import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getAdminProfile } from "@/services/admin-auth.service";

export async function GET() {
  const session = await getServerSession();
  if (!session || !session.userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const profile = await getAdminProfile(session.userId);
  if (!profile) {
    return NextResponse.json(
      { success: false, error: "Pengguna tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { user: profile },
  });
}
