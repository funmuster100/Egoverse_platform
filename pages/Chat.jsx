
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
      <div style={{ padding: 16 }}>
        <AvatarUpload onUpload={(img) => setAvatar(img)} />
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", marginBottom: 12, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            {avatar && (
              <img src={avatar} style={{ width: 32, height: 32, borderRadius: "50%", margin: "0 8px" }} alt="avatar" />
            )}
            <div style={{
              background: m.role === "user" ? "#00ff88" : "#333",
              color: m.role === "user" ? "#111" : "#eee",
              padding: "10px 14px",
              borderRadius: 16,
              maxWidth: "70%",
              whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {isTyping && (
          <div style={{ color: "#888", fontStyle: "italic", marginTop: 8 }}>
            <span className="dot-flashing" />
          </div>
        )}
      </div>
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
