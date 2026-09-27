import { NextResponse } from "next/server";
import {
  getSalesReport,
  getPurchaseReport,
  getProfitReport,
  getInventoryReport,
} from "@/services/report.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "sales";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let reportData = null;

    if (type === "sales") {
      reportData = await getSalesReport({ dateFrom, dateTo });
    } else if (type === "purchases") {
      reportData = await getPurchaseReport({ dateFrom, dateTo });
    } else if (type === "profit") {
      reportData = await getProfitReport({ dateFrom, dateTo });
    } else if (type === "inventory") {
      reportData = await getInventoryReport();
    } else {
      return NextResponse.json({ success: false, error: "Tipe laporan tidak valid." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        type,
        report: reportData,
      },
    });
  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
