"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [chatId, setChatId] = useState("b7258526f4731d2d4462");
  const [text, setText] = useState("");
  const [logs, setLogs] = useState([]);

  // Lấy log tin nhắn từ webhook
  const fetchLogs = async () => {
    const res = await fetch("/api/zalo/webhook");
    const data = await res.json();
    console.log("Fetched logs:", data); 
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000); // refresh 3s/lần
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!chatId || !text) return alert("Nhập chat_id và nội dung");
    await fetch("/api/zalo/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    setText("");
    fetchLogs();
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Zalo Bot Web Interface</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Chat ID"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          placeholder="Nội dung"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleSend}>Gửi tin nhắn</button>
      </div>

      <h2>Log tin nhắn nhận được</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem" }}>
        {logs.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.from}</b> [{msg.time}]: {msg.text}
          </div>
        ))}
      </div>
    </main>
  );
}
