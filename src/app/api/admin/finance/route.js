import { NextResponse } from "next/server";
import { getFinanceOverview } from "@/services/finance.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const overview = await getFinanceOverview({ dateFrom, dateTo });
    return NextResponse.json({ success: true, data: overview });
  } catch (error) {
    console.error("Finance Overview Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
