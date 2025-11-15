import axios from "axios";
import { sendToSheet } from "@/lib/googleSheet.js";

let messages = []; 

export async function POST(req) {
  const token = req.headers.get("x-bot-api-secret-token");
  
  if (token !== process.env.SECRET_TOKEN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const data = await req.json();
  const msg = data.message;
  console.log("Received message:", msg);
  // if (!msg.text) 

  const text =msg.text.trim();
  const chatId = msg.chat.id

  if (text.startsWith("/add ")) {
    const value = text.slice(5).trim();

    try {
      await sendToSheet("add", value);

      // Gửi về Zalo
      await axios.post(`https://bot-api.zapps.me/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `Đã gửi yêu cầu thêm vào Google Sheet`
      });

    } catch (err) {
      await axios.post(`https://bot-api.zapps.me/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `Lỗi: ${err.message}`
      });
    }
  }

  return Response.json({ ok: true });


  // if (data.event === "message" && data.message) {
  //   messages.push({
  //     from: data.sender.id,
  //     text: data.message.text || "",
  //     time: new Date().toLocaleString()
  //   });
  // }

  // return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}

export function GET() {
  return new Response(JSON.stringify(messages), { status: 200 });
}
