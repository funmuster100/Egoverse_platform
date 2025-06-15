
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    if (p) setProfile(JSON.parse(p));
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    setIsTyping(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, profile }),
    });
    const data = await res.json();
    setMessages([...updated, { role: "assistant", content: data.reply }]);
    setIsTyping(false);
  };

  return (
    <div className="chat-container">
      {/* 🧠 Chat-Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <Image
            src="/avatars/bot.png"
            alt="Bot Avatar"
            width={36}
            height={36}
            className="avatar"
          />
          <div>
            <div className="chat-title">Du (Ego)</div>
            <div className="chat-status">
              <span className="status-dot" /> Online
            </div>
          </div>
        </div>
        <button className="chat-settings-btn">⚙️</button>
      </div>

      {/* 💬 Nachrichtenverlauf */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`bubble-container ${m.role}`}>
            <Image
              src={`/avatars/${m.role === "user" ? "user.png" : "bot.png"}`}
              alt={`${m.role}-avatar`}
              width={40}
              height={40}
              className="avatar"
            />
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-bubble">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        )}
      </div>

      {/* ✍️ Eingabefeld */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Frag dein Ego..."
        />
        <button onClick={send}>Senden</button>
      </div>
    </div>
  );
}
