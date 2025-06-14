
import { useEffect, useState } from "react";
import "../styles/chat.css"; // wenn du externes CSS nutzt

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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, profile })
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...updated, { role: "assistant", content: "Fehler bei der Antwort." }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {isTyping && <div className="message assistant"><div className="bubble typing">Tippt…</div></div>}
      </div>
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
