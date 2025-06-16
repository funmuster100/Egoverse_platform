
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
    setDarkMode(document.documentElement.dataset.theme === "dark");
  }, []);

  // Persist history
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("ego_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Persist profile changes
  useEffect(() => {
    if (!profile) return;
    const updated = { ...profile, mode, lang, brandingLogo, brandingColor };
    setProfile(updated);
    localStorage.setItem("ego_profile", JSON.stringify(updated));
  }, [mode, lang, brandingLogo, brandingColor]);

  // Theme toggle
  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = next;
    setDarkMode(next === "dark");
  };

  // Send message handler with trimming to last 10 messages
  const send = async () => {
    if (!input.trim()) return;

    // 1) Add new user message locally
    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    setIsTyping(true);

    // 2) Copy profile and remove large data
    const safeProfile = { ...profile };
    delete safeProfile.brandingLogo;

    // 3) Trim history to last 10 messages
    const windowSize = 10;
    const recentMessages = updated.slice(-windowSize);

    // 4) Call API
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: recentMessages,
        profile: safeProfile,
        mode,
        lang,
      }),
    });

    if (!res.ok) {
      console.error("Chat API Error:", await res.text());
      setIsTyping(false);
      return;
    }

    // 5) Append assistant reply
    const { reply } = await res.json();
    setMessages([...updated, { role: "assistant", content: reply }]);
    setIsTyping(false);
  };

  // Avatar logic
  const BOT_AVATARS = {
    default: "/avatars/bot_default.jpeg",
    coach: "/avatars/bot_coach.jpeg",
    mentor: "/avatars/bot_mentor.jpeg",
    kritiker: "/avatars/bot_kritiker.jpeg",
  };
  const getAvatar = (role) =>
    role === "user"
      ? profile?.avatar?.startsWith("data:image")
        ? profile.avatar
        : "/avatars/user.png"
      : BOT_AVATARS[mode] || BOT_AVATARS.default;

  // Handlers for uploads & branding
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const upd = { ...profile, avatar: r.result };
      setProfile(upd);
      localStorage.setItem("ego_profile", JSON.stringify(upd));
    };
    r.readAsDataURL(file);
  };
  const handleBrandingLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setBrandingLogo(r.result);
    r.readAsDataURL(file);
  };
  const handleBrandingColorChange = (e) =>
    setBrandingColor(e.target.value);

  return (
    <>
      <div
        className={styles.chatContainer}
        style={{ borderTopColor: brandingColor }}
      >
        {/* Chat Header */}
        <div
          className={styles.chatHeader}
          style={{ borderBottomColor: brandingColor }}
        >
          <div className={styles.chatHeaderLeft}>
            {brandingLogo && (
              <img
                src={brandingLogo}
                alt="Branding Logo"
                className={styles.brandingLogo}
              />
            )}
            <label htmlFor="avatar-upload" className={styles.avatarLabel}>
              <Image
                src={getAvatar("user")}
                alt="User Avatar"
                width={36}
                height={36}
                className={styles.avatar}
              />
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleAvatarUpload}
            />
            <div>
              <div className={styles.chatTitle}>Du (Ego)</div>
              <div className={styles.chatStatus}>
                <span
                  className={styles.statusDot}
                  style={{ background: brandingColor }}
                />{" "}
                Online
              </div>
            </div>
          </div>
          <div className={styles.headerButtons}>
            <button onClick={toggleTheme} title="Theme wechseln">
              🌓
            </button>
            <button
              onClick={() => setShowSettings(true)}
              title="Einstellungen öffnen"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Mode selector + reset */}
        <div className={styles.chatModeSelector}>
          <label>Modus:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ borderColor: brandingColor }}
          >
            <option value="default">🧠 Ich selbst</option>
            <option value="coach">🗣️ Coach</option>
            <option value="mentor">🧓 Mentor</option>
            <option value="kritiker">⚡ Kritiker</option>
          </select>
          <button
            className={styles.resetButton}
            style={{ background: brandingColor }}
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("ego_chat_history");
            }}
          >
            🗑️
          </button>
        </div>

        {/* Mode indicator */}
        <div
          className={styles.chatModeIndicator}
          style={{ color: brandingColor }}
        >
          Aktueller Modus: <strong>{mode}</strong>
        </div>

        {/* Messages */}
        <div className={styles.chatMessages}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.bubbleContainer} ${styles[m.role]}`}
            >
              <Image
                src={getAvatar(m.role)}
                alt={`${m.role}-avatar`}
                width={40}
                height={40}
                className={styles.avatar}
              />
              <div className={styles.bubble}>{m.content}</div>
            </div>
          ))}
          {isTyping && (
            <div className={styles.typingBubble}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className={styles.chatInput}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Frag dein Ego..."
          />
          <button
            onClick={send}
            style={{ background: brandingColor, color: "#fff" }}
          >
            Senden
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className={styles.settingsModal}>
          <div
            className={styles.settingsContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Einstellungen</h2>

            <label>
              Modus:
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="default">Ich selbst</option>
                <option value="coach">Coach</option>
                <option value="mentor">Mentor</option>
                <option value="kritiker">Kritiker</option>
              </select>
            </label>

            <label>
              Sprache:
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="de">Deutsch</option>
                <option value="en">Englisch</option>
              </select>
            </label>

            <label>
              Sprachausgabe:
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
              />
            </label>

            <label>
              Geschwindigkeit:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={textSpeed}
                onChange={(e) => setTextSpeed(+e.target.value)}
              />
            </label>

            {profile?.isInfluencer === "yes" && (
              <>
                <hr />
                <h3>Branding</h3>

                <label>
                  Logo:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBrandingLogoUpload}
                  />
                </label>
                {brandingLogo && (
                  <img
                    src={brandingLogo}
                    alt="Logo"
                    className={styles.brandingLogo}
                  />
                )}

                <label>
                  Farbe:
                  <input
                    type="color"
                    value={brandingColor}
                    onChange={handleBrandingColorChange}
                  />
                </label>
              </>
            )}

            <button onClick={() => setShowSettings(false)}>Schließen</button>
          </div>
        </div>
      )}
    </>
  );
}
