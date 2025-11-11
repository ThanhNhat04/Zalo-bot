let messages = []; // lưu tạm memory, có thể đổi sang DB

import axios from "axios";

export async function POST(req) {
  const token = req.headers.get("x-bot-api-secret-token");
  if (token !== process.env.SECRET_TOKEN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const data = await req.json();
  console.log("Received from Zalo:", data);

  if (data.event === "message" && data.message) {
    messages.push({
      from: data.sender.id,
      text: data.message.text || "",
      time: new Date().toLocaleString()
    });
  }

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}

// Export để client có thể fetch log tin nhắn
export function GET() {
  return new Response(JSON.stringify(messages), { status: 200 });
}
