import { appendToSheet } from "@/lib/googleSheet";

let messages = [];

export async function POST(req) {
  const token = req.headers.get("x-bot-api-secret-token");

  if (!token || token !== process.env.SECRET_TOKEN) {
    console.warn("Unauthorized request: Invalid token");
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let data;
  try {
    data = await req.json();
    console.log("Received payload:", data);
  } catch (err) {
    console.error("Invalid JSON payload:", err);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  // Log dữ liệu raw từ Zalo
  console.log("=== ZALO WEBHOOK RECEIVED ===");
  console.log(JSON.stringify(data, null, 2));
  console.log("=============================");

  const event = data.event_name || data.event;
  const message = data.result?.message || data.message;

  if (!event || !message) {
    console.warn("Missing event or message in payload");
    return new Response(JSON.stringify({ error: "Invalid data structure" }), { status: 400 });
  }

  if (event === "message.text.received" && message.text) {
    const text = message.text.trim();
    const fromId = message.from?.id;

    if (!text) {
      console.warn("Empty text message received");
      return new Response(JSON.stringify({ error: "Empty message" }), { status: 400 });
    }

    if (!fromId) {
      console.warn("Missing sender ID");
      return new Response(JSON.stringify({ error: "Missing sender info" }), { status: 400 });
    }

    // Lưu tin nhắn vào bộ nhớ tạm
    const logMessage = {
      from: fromId,
      text,
      time: new Date().toLocaleString(),
    };
    messages.push(logMessage);

    // Log chi tiết tin nhắn ra console Vercel
    console.log("=== MESSAGE LOGGED ===");
    console.log(JSON.stringify(logMessage, null, 2));
    console.log("======================");

    // Xử lý lệnh /add
    if (text.startsWith("/add ")) {
      const valueToAdd = text.replace("/add ", "").trim();
      if (valueToAdd) {
        try {
          await appendToSheet(process.env.SHEET_ID, "Theo dõi đơn hàng", [
            [valueToAdd, new Date().toLocaleString()],
          ]);
          console.log("Added to Sheet:", valueToAdd);
        } catch (err) {
          console.error("Error adding to Sheet:", err);
          return new Response(JSON.stringify({ error: "Failed to append to Sheet" }), { status: 500 });
        }
      } else {
        console.warn("Command /add received but no value provided");
      }
    }
  } else {
    console.warn("Unsupported event type or missing text:", event);
  }

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}

// Lấy tất cả tin nhắn đã lưu (debug)
export function GET() {
  return new Response(JSON.stringify(messages, null, 2), { status: 200 });
}
