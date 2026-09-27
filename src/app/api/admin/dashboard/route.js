import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/services/dashboard.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const data = await getDashboardMetrics(period, { dateFrom, dateTo });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat dashboard." },
      { status: 500 }
    );
  }
}
