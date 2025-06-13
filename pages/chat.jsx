
import { useEffect, useState } from "react";
import AvatarUpload from "../components/AvatarUpload";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    if (p) setProfile(JSON.parse(p));

    const a = localStorage.getItem("ego_avatar");
    if (a) setAvatar(a);
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
      body: JSON.stringify({ message: input, profile })
    });
    const data = await res.json();
    setMessages([...updated, { role: "assistant", content: data.reply }]);
    setIsTyping(false);
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#eee", height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Avatar & Upload */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #222" }}>
        {avatar ? (
          <img src={avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: "50%", marginRight: 12 }} />
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#444", marginRight: 12 }} />
        )}
        <AvatarUpload onUpload={(base64) => {
          setAvatar(base64);
          localStorage.setItem("ego_avatar", base64);
        }} />
      </div>

      {/* Chatverlauf */}
      <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", marginBottom: 10 }}>
            <div style={{
              display: "inline-block",
              background: m.role === "user" ? "#00ff88" : "#333",
              color: m.role === "user" ? "#111" : "#eee",
              padding: "10px 14px",
              borderRadius: 16,
              maxWidth: "70%",
              whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {isTyping && <p style={{ fontStyle: "italic", color: "#888" }}>💬 tippt...</p>}
      </div>

      {/* Eingabefeld */}
      <div style={{ padding: 16, display: "flex", borderTop: "1px solid #333" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Frag dein Ego..."
          style={{ flex: 1, padding: 12, background: "#222", color: "#eee", borderRadius: 6, border: "none" }}
        />
        <button onClick={send} style={{ marginLeft: 10, background: "#00ff88", color: "#111", border: "none", borderRadius: 6, padding: "0 16px" }}>
          Senden
        </button>
      </div>
    </div>
  );
}
