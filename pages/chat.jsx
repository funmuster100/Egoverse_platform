
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/Chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("default");
  const [lang, setLang] = useState("de");

  const BOT_AVATARS = {
    default: "/avatars/bot_default.jpg",
    coach: "/avatars/bot_coach.jpg",
    mentor: "/avatars/bot_mentor.jpg",
    kritiker: "/avatars/bot_kritiker.jpg",
  };

  // Laden von Profil + Chatverlauf
  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    if (p) setProfile(JSON.parse(p));

    const saved = localStorage.getItem("ego_chat_history");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Speichern von Nachrichten
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ego_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    setIsTyping(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, profile, mode, lang }),
    });
    const data = await res.json();
    setMessages([...updated, { role: "assistant", content: data.reply }]);
    setIsTyping(false);
  };

  const getAvatar = (role) => {
    if (role === "user") {
      if (profile?.avatar?.startsWith("data:image")) return profile.avatar;
      return "/avatars/user.png";
    }
    return BOT_AVATARS[mode] || "/avatars/bot_default.jpg";
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updatedProfile = { ...profile, avatar: reader.result };
      setProfile(updatedProfile);
      localStorage.setItem("ego_profile", JSON.stringify(updatedProfile));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles["chat-container"]}>
      {/* 🧠 Chat-Header */}
      <div className={styles["chat-header"]}>
        <div className={styles["chat-header-left"]}>
          <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
            <Image
              src={getAvatar("user")}
              alt="User Avatar"
              width={36}
              height={36}
              className={styles["avatar"]}
            />
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpload}
          />
          <div>
            <div className={styles["chat-title"]}>Du (Ego)</div>
            <div className={styles["chat-status"]}>
              <span className={styles["status-dot"]} /> Online
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => {
              const html = document.documentElement;
              html.dataset.theme =
                html.dataset.theme === "dark" ? "light" : "dark";
            }}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "var(--text)",
            }}
            title="Theme wechseln"
          >
            🌓
          </button>
          <button className="chat-settings-btn">⚙️</button>
        </div>
      </div>

      {/* 🎛️ Modusauswahl */}
      <div className={styles["chat-mode-selector"]}>
        <label>Modus: </label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="default">🧠 Ich selbst</option>
          <option value="coach">🗣️ Coach</option>
          <option value="mentor">🧓 Mentor</option>
          <option value="kritiker">⚡ Kritiker</option>
        </select>
        <div className={styles["chat-reset"]}>
          <button
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("ego_chat_history");
            }}
          >
            🗑️ Verlauf löschen
          </button>
        </div>
      </div>

      <div className={styles["chat-mode-indicator"]}>
        Aktueller Modus: <strong>{mode}</strong>
      </div>

      {/* 💬 Nachrichtenverlauf */}
      <div className={styles["chat-messages"]}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles["bubble-container"]} ${styles[m.role]}`}
          >
            <Image
              src={getAvatar(m.role)}
              alt={`${m.role}-avatar`}
              width={40}
              height={40}
              className={styles["avatar"]}
            />
            <div className={styles["bubble"]}>{m.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className={styles["typing-bubble"]}>
            <div className={styles["dot"]} />
            <div className={styles["dot"]} />
            <div className={styles["dot"]} />
          </div>
        )}
      </div>

      {/* ✍️ Eingabefeld */}
      <div className={styles["chat-input"]}>
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
