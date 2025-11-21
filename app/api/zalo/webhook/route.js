import { appendToSheet , addOrderFromText  } from "@/lib/googleSheet";

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
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const event = data.event_name || data.event;
  const message = data.result?.message || data.message;

  if (!event || !message) {
    console.warn(`Invalid payload structure. Event: ${event}`);
    return new Response(JSON.stringify({ error: "Invalid data structure" }), { status: 400 });
  }

  if (event === "message.text.received" && message.text) {
    const text = message.text.trim();
    const fromId = message.from?.id;

    if (!text || !fromId) {
      return new Response(JSON.stringify({ error: "Missing text or sender info" }), { status: 400 });
    }

    messages.push({
      from: fromId,
      text,
      time: new Date().toLocaleString(),
    });

    if (text.startsWith("/add ")) {
      const valueToAdd = text.replace("/add ", "").trim();
      if (valueToAdd) {
        try {
          await addOrderFromText(valueToAdd);
        } catch (err) {
          return new Response(JSON.stringify({ error: "Failed to append to Sheet" }), { status: 500 });
        }
      }
    }
  } 

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}

export function GET() {
  return new Response(JSON.stringify(messages, null, 2), { status: 200 });
}