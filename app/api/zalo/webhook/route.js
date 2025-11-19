import { appendToSheet } from "@/lib/googleSheet";

let messages = [];

export async function POST(req) {
  const token = req.headers.get("x-bot-api-secret-token");

  // --- Kiểm tra token ---
  if (!token || token !== process.env.SECRET_TOKEN) {
    console.warn("Unauthorized request: Invalid token");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let data;
  try {
    data = await req.json();
  } catch (err) {
    console.error("Invalid JSON payload:", err);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  console.log("Received from Zalo:", data);

  // --- Kiểm tra dữ liệu event và message ---
  if (!data.event || !data.message) {
    console.warn("Missing event or message in payload");
    return new Response(JSON.stringify({ error: "Invalid data structure" }), { status: 400 });
  }

  // --- Chỉ xử lý tin nhắn văn bản ---
  if (data.event === "message.text.received" && data.message.text) {
    const text = data.message.text.trim();
    const fromId = data.message.from?.id;

    if (!text) {
      console.warn("Empty text message received");
      return new Response(JSON.stringify({ error: "Empty message" }), { status: 400 });
    }

    if (!fromId) {
      console.warn("Missing sender ID");
      return new Response(JSON.stringify({ error: "Missing sender info" }), { status: 400 });
    }

    // Lưu tin nhắn vào bộ nhớ tạm
    messages.push({
      from: fromId,
      text,
      time: new Date().toLocaleString(),
    });

    // --- Xử lý lệnh /add ---
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
    console.warn("Unsupported event type or missing text:", data.event);
  }

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}

// Lấy tất cả tin nhắn đã lưu (debug)
export function GET() {
  return new Response(JSON.stringify(messages), { status: 200 });
}
