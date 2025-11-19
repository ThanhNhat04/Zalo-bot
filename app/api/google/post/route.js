import { appendToSheet } from "@/lib/googleSheet";

export async function POST(req) {
  try {
    const body = await req.json();
    const { result } = body;
    const { message } = result || {};

    if (!message?.text) {
      return new Response(JSON.stringify({ ok: false, message: "No text input" }), { status: 400 });
    }

    const input = message.text.split(";");

    const [tenSP, soLuongStr, giaBanStr] = input;
    const soLuong = parseFloat(soLuongStr);
    const giaBan = parseFloat(giaBanStr);


    const row = [
      "", 
      new Date().toLocaleDateString(), 
      "",
      "", 
      "", 
      tenSP, 
      soLuong, 
      giaBan, 
      "",
      "", 
      "", 
      ""  
    ];

    await appendToSheet(process.env.SPREADSHEET_ID, "Theo dõi đơn hàng", [row]);

    return new Response(JSON.stringify({ ok: true, message: "Đã thêm đơn hàng vào Sheet" }));

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
