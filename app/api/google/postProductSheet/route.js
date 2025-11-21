import { appendToSheet } from "@/lib/googleSheet";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, quantity, price, date, customer_name } = body;

    // Validate nhanh
    if (!name || !quantity || !price) {
      return new Response(
        JSON.stringify({ ok: false, message: "Thiếu dữ liệu" }),
        { status: 400 }
      );
    }

    const row = [
      "",
      date || new Date().toLocaleDateString(),
      "",
      customer_name || "",
      "",
      name || "",
      Number(quantity) || 0,
      price || 0,
      "",
      "",
    ];

    await appendToSheet(process.env.SPREADSHEET_ID, "Theo dõi đơn hàng", [row]);

    return new Response(
      JSON.stringify({ ok: true, message: "Đã thêm vào Google Sheet" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
    });
  }
}
