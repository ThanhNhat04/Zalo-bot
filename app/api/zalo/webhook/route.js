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
    return Response.json({ ok: true });
  }

  // Theo đúng format bạn yêu cầu
  const text = msg.text.trim();
  const chatId = msg.chat.id;        // bạn yêu cầu dùng chat.id
  const userId = msg.from.id;        // nếu cần

  console.log("Received:", text, "From:", userId);

  // ==============================
  // COMMAND HANDLER – mở rộng 100+ lệnh
  // ==============================
  const commands = {
    "/add": async () => {
      const value = text.replace("/add", "").trim();
      await sendToSheet("add", value);
      return "Đã thêm vào Google Sheet";
    },

    "/ping": async () => {
      return "Pong!";
    },

    "/help": async () => {
      return "Các lệnh:\n/add <text>\n/ping\n/help";
    },

    // sau này thêm:
    // "/export": async () => {},
    // "/delete": async () => {},
    // "/update": async () => {},
  };

  // Tìm lệnh đầu tiên trong message
  const cmd = text.split(" ")[0];

  if (commands[cmd]) {
    let reply = "";

    try {
      reply = await commands[cmd]();

    } catch (err) {
      reply = "Lỗi: " + err.message;
    }

    await sendMessageToClient(chatId, reply);

    return Response.json({ ok: true });
  }

  // Nếu không phải lệnh → trả lời default
  await sendMessageToClient(chatId, "Không hiểu lệnh, gõ /help");

  return Response.json({ ok: true });
}


// ==============================
// Hàm gửi tin nhắn
// (theo format bạn yêu cầu)
// ==============================
async function sendMessageToClient(chatId, text) {
  return axios.post(
    `https://bot-api.zapps.me/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`,
    {
      chat_id: chatId,         // bạn nói cần dùng chat_id
      text: text
    }
  );
}

export function GET() {
  return new Response(JSON.stringify(messages), { status: 200 });
}
