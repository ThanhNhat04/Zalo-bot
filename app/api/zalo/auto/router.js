import { appendToSheet } from "@/lib/googleSheet";

let messages = [];

export async function POST(req) {
  const token = req.headers.get("x-bot-api-secret-token");

  if (token !== process.env.SECRET_TOKEN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const data = await req.json();
  console.log("Received from Zalo:", data);

  if (data.event === "message" && data.message && data.message.text) {
    const text = data.message.text.trim();

    // Lưu tin nhắn vào bộ nhớ tạm
    messages.push({
      from: data.sender.id,
      text,
      time: new Date().toLocaleString(),
    });

    // Xử lý lệnh /add
    if (text.startsWith("/add ")) {
      const valueToAdd = text.replace("/add ", "").trim();
      if (valueToAdd) {
        try {
          await appendToSheet(
            process.env.SHEET_ID, 
            "Theo dõi đơn hàng",    
            [[valueToAdd, new Date().toLocaleString()]]
          );
          console.log("Added to Sheet:", valueToAdd);
        } catch (err) {
          console.error("Error adding to Sheet:", err);
        }
      }
    }
  }

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}

// Lấy tất cả tin nhắn đã lưu (debug)
export function GET() {
  return new Response(JSON.stringify(messages), { status: 200 });
}
