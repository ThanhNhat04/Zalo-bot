import { getSheetValues } from "@/lib/googleSheet";

export async function GET() {
  try {
    const rows = await getSheetValues("Theo dõi đơn hàng");
    return Response.json({
      ok: true,
      rows,
    });

  } catch (err) {
    return Response.json({
      ok: false,
      error: err.message,
    }, { status: 500 });
  }
}
