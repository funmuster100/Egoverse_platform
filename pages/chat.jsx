
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/Chat.module.css";

export default function Chat() {
  // States
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("default");
  const [lang, setLang] = useState("de");
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [textSpeed, setTextSpeed] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [brandingLogo, setBrandingLogo] = useState(null);
  const [brandingColor, setBrandingColor] = useState("#00ff88");

  // Load profile, chat history and theme on mount
  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    if (p) {
      const parsed = JSON.parse(p);
      setProfile(parsed);
      if (parsed.brandingLogo) setBrandingLogo(parsed.brandingLogo);
      if (parsed.brandingColor) setBrandingColor(parsed.brandingColor);
      if (parsed.mode) setMode(parsed.mode);
      if (parsed.lang) setLang(parsed.lang);
    }
    const saved = localStorage.getItem("ego_chat_history");
    if (saved) setMessages(JSON.parse(saved));
    const theme = document.documentElement.dataset.theme;
    setDarkMode(theme === "dark");
  }, []);

  // Save messages to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ego_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Save mode & lang & branding changes to profile in localStorage
  useEffect(() => {
    if (!profile) return;
    const updatedProfile = {
      ...profile,
      mode,
      lang,
      brandingLogo,
      brandingColor,
    };
    setProfile(updatedProfile);
    localStorage.setItem("ego_profile", JSON.stringify(updatedProfile));
  }, [mode, lang, brandingLogo, brandingColor]);

  // Theme toggler
  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = newTheme;
    setDarkMode(newTheme === "dark");
  };

  // Send message handler
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

  // Avatar management
  const BOT_AVATARS = {
    default: "/avatars/bot_default.jpeg",
    coach: "/avatars/bot_coach.jpeg",
    mentor: "/avatars/bot_mentor.jpeg",
    kritiker: "/avatars/bot_kritiker.jpeg",
  };

  const getAvatar = (role) => {
    if (role === "user") {
      if (profile?.avatar?.startsWith("data:image")) return profile.avatar;
      return "/avatars/user.png";
    }
    return BOT_AVATARS[mode] || BOT_AVATARS.default;
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

  // Branding logo upload
  const handleBrandingLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBrandingLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Branding color change
  const handleBrandingColorChange = (e) => {
    setBrandingColor(e.target.value);
  };

  return (
    <>
      <div
        className={styles["chat-container"]}
        style={{ borderTopColor: brandingColor }}
      >
        {/* Chat Header */}
        <div
          className={styles["chat-header"]}
          style={{ borderBottomColor: brandingColor }}
        >
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
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
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

            {/* Settings button */}
            <button
              className="chat-settings-btn"
              onClick={() => setShowSettings(true)}
              title="Einstellungen öffnen"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--text)",
              }}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Mode selector + reset */}
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

        {/* Mode indicator */}
        <div className={styles["chat-mode-indicator"]}>
          Aktueller Modus: <strong>{mode}</strong>
        </div>

        {/* Messages */}
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

        {/* Input */}
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

      {/* Settings Modal */}
      {showSettings && (
        <div
          className={styles["settings-modal"]}
          onClick={() => setShowSettings(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg)",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "100%",
              color: "var(--text)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2>Einstellungen</h2>

            <div style={{ marginBottom: "1rem" }}>
              <label>
                Modus wählen:{" "}
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  style={{ padding: "6px", fontSize: "1rem", borderRadius: "6px" }}
                >
                  <option value="default">Ich selbst</option>
                  <option value="coach">Coach</option>
                  <option value="mentor">Mentor</option>
                  <option value="kritiker">Kritiker</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>
                Sprache:{" "}
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  style={{ padding: "6px", fontSize: "1rem", borderRadius: "6px" }}
                >
                  <option value="de">Deutsch</option>
                  <option value="en">Englisch</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>
                Sprachausgabe aktivieren:{" "}
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                  style={{ transform: "scale(1.2)", marginLeft: "8px" }}
                />
              </label>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>
                Geschwindigkeit der Sprachausgabe:{" "}
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={textSpeed}
                  onChange={(e) => setTextSpeed(Number(e.target.value))}
                />
              </label>
            </div>

            {/* Branding nur wenn Influencer */}
            {profile?.isInfluencer === "yes" && (
              <>
                <hr style={{ margin: "1.5rem 0" }} />
                <h3>Branding Einstellungen</h3>

                <div style={{ marginBottom: "1rem" }}>
                  <label>
                    Logo hochladen:{" "}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBrandingLogoUpload}
                    />
                  </label>
                  {brandingLogo && (
                    <img
                      src={brandingLogo}
                      alt="Branding Logo"
                      style={{
                        maxWidth: "100px",
                        marginTop: "0.5rem",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label>
                    Branding-Farbe:{" "}
                    <input
                      type="color"
                      value={brandingColor}
                      onChange={handleBrandingColorChange}
                      style={{ width: "100%", height: "40px", cursor: "pointer" }}
                    />
                  </label>
                </div>
              </>
            )}

            <button
              onClick={() => setShowSettings(false)}
              style={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
