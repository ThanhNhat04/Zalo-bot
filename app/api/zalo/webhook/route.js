// import axios from "axios";

// let messages = []; 

// export async function POST(req) {
//   const token = req.headers.get("x-bot-api-secret-token");
//   console.log("Received token:", token);
  
//   if (token !== process.env.SECRET_TOKEN) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//   }

//   const data = await req.json();
//   console.log("Received from Zalo:", data);

//   if (data.event === "message" && data.message) {
//     messages.push({
//       from: data.sender.id,
//       text: data.message.text || "",
//       time: new Date().toLocaleString()
//     });
//   }

//   return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
// }

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

  if (!msg || !msg.text) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const text = msg.text.trim();
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Lưu message ngay lập tức không chờ sendToSheet
  messages.push({
    from: userId,
    text,
    time: new Date().toLocaleString(),
  });

  // ==============================
  // COMMAND HANDLER – mở rộng dễ dàng
  // ==============================
  const commands = {
    "/add": async (args) => {
      await sendToSheet("add", args);
      return "Đã thêm vào Google Sheet";
    },
    "/help": async () => "Các lệnh:\n/add <text>\n/ping\n/help",
    "/ping": async () => "Pong!",
  };

  const [cmd, ...argsArr] = text.split(" ");
  const args = argsArr.join(" ").trim();

  const handler = commands[cmd];

  if (handler) {
    // Không chặn thread chính, trả lời client nhanh
    handler(args)
      .then((reply) => sendMessageToClient(chatId, reply))
      .catch((err) =>
        sendMessageToClient(chatId, "Lỗi: " + (err?.message || err))
      );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // Nếu không phải lệnh → trả lời default
  sendMessageToClient(chatId, "Không hiểu lệnh, gõ /help");

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

// ==============================
// SEND MESSAGE KHÔNG CHẶN
// ==============================
async function sendMessageToClient(chatId, text) {
  try {
    await axios.post(
      `https://bot-api.zapps.me/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`,
      { chat_id: chatId, text }
    );
  } catch (err) {
    console.error("Failed to send message:", err.message);
  }
}

// GET messages nhanh
export function GET() {
  return new Response(JSON.stringify(messages), { status: 200 });
}
