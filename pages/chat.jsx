
import { useEffect, useState } from "react";

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
        body: JSON.stringify({ message: input, profile }),
      });

      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages([...updated, { role: "assistant", content: "Fehler beim Abrufen." }]);
    }

    setIsTyping(false);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {isTyping && <p className="typing-indicator">Tippt...</p>}
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

      <style jsx>{`
        .chat-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0d0d0d;
          color: #eee;
          font-family: 'Segoe UI', sans-serif;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .chat-bubble {
          margin-bottom: 12px;
          display: flex;
        }

        .chat-bubble.user {
          justify-content: flex-end;
        }

        .chat-bubble.assistant {
          justify-content: flex-start;
        }

        .bubble {
          background: #333;
          color: #eee;
          padding: 12px 16px;
          border-radius: 20px;
          max-width: 70%;
          white-space: pre-wrap;
        }

        .chat-bubble.user .bubble {
          background: #00ff88;
          color: #111;
        }

        .typing-indicator {
          font-style: italic;
          color: #aaa;
          padding: 0 16px;
        }

        .chat-input {
          padding: 16px;
          display: flex;
          border-top: 1px solid #222;
        }

        .chat-input input {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          background: #1a1a1a;
          color: #fff;
          border: none;
        }

        .chat-input button {
          margin-left: 10px;
          background: #00ff88;
          color: #111;
          border: none;
          border-radius: 8px;
          padding: 0 20px;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .bubble {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}
