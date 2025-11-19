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

// Định nghĩa commands ngoài hàm POST để không tạo lại mỗi lần
const commands = {
  "/add": async (param) => {
    // Gửi bất đồng bộ, không chặn trả về
    sendToSheet("add", param).catch(console.error);
    return "Đã thêm vào Google Sheet";
  },

  "/help": async () => {
    return "Các lệnh:\n/add <text>\n/ping\n/help";
  },

  "/ping": async () => {
    return "Pong!";
  },
};

// Hàm gửi message đến client (theo cấu trúc bạn cung cấp)
async function sendMessageToClient(chatId, text) {
  try {
    return axios.post(
      `https://bot-api.zapps.me/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: text,
      }
    );
  } catch (err) {
    console.error("Send message error:", err.message);
  }
}

export async function POST(req) {
  const token = req.headers.get("x-bot-api-secret-token");
  if (token !== process.env.SECRET_TOKEN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const data = await req.json();
  const msg = data.message;
  if (!msg?.text) return Response.json({ ok: true });

  const text = msg.text.trim();
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Tách lệnh và tham số chỉ một lần
  const [cmd, ...args] = text.split(" ");
  const param = args.join(" ").trim();

  let reply = "Không hiểu lệnh, gõ /help";

  if (commands[cmd]) {
    try {
      reply = await commands[cmd](param);
    } catch (err) {
      reply = "Lỗi: " + err.message;
    }
  }

  // Gửi message bất đồng bộ, không block response
  sendMessageToClient(chatId, reply).catch(console.error);

  return Response.json({ ok: true });
}



// async function sendMessageToClient(chatId, text) {
//   return axios.post(
//     `https://bot-api.zapps.me/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`,
//     {
//       chat_id: chatId,         
//       text: text
//     }
//   );
// }

export function GET() {
  return new Response(JSON.stringify(messages), { status: 200 });
}
