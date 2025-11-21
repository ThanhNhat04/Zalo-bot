import { getSheetValues } from "@/lib/googleSheet";
import { NextResponse } from "next/server"; 
export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    const allRows = await getSheetValues("Theo dõi đơn hàng");

    if (!allRows || allRows.length === 0) {
      return NextResponse.json({ ok: true, rows: [], pagination: {} });
    }
    const headers = allRows[0];
    let dataRows = allRows.slice(1);

    //Tính tổng doanh thu 
    const revenueColIndex = headers.findIndex((h) => 
      h && (h.includes("Thành Tiền"))
    );
    console.log("Revenue Column Index:", revenueColIndex);

    let totalRevenue = 0;

    if (revenueColIndex !== -1) {
      totalRevenue = dataRows.reduce((sum, row) => {
        const cellValue = row[revenueColIndex];
        
        if (!cellValue) return sum;
        const cleanValue = cellValue.toString().replace(/[^0-9]/g, "");
        const numberValue = parseInt(cleanValue, 10);

        return sum + (isNaN(numberValue) ? 0 : numberValue);
      }, 0);
    }
    console.log("Total Revenue:", totalRevenue);

    dataRows.reverse();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRows = dataRows.slice(startIndex, endIndex);

    return NextResponse.json({
      ok: true,
      headers: headers,
      rows: paginatedRows,
      totalRevenue: totalRevenue,
      pagination: {
        currentPage: page,
        limit: limit,
        totalItems: dataRows.length,
        totalPages: Math.ceil(dataRows.length / limit),
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
