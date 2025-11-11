import axios from "axios";

export async function POST(req) {
  const body = await req.json();
  const { chat_id, text } = body;

  if (!chat_id || !text) {
    return new Response(JSON.stringify({ error: "chat_id and text are required" }), { status: 400 });
  }

  try {
    const res = await axios.post(`https://bot-api.zapps.me/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id,
      text
    });

    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, data: err.response?.data }), { status: 500 });
  }
}
