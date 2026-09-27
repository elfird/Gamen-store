import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/services/setting.service";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, data: { settings } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = await updateSettings(body);
    return NextResponse.json({
      success: true,
      data: { settings: updated },
      message: "Pengaturan toko berhasil diperbarui.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
