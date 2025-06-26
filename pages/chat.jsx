
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/Chat.module.css";

export default function Chat() {
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
const [mood, setMood] = useState(null);

useEffect(() => {
  if (!mood) return;
  const timeout = setTimeout(() => setMood(null), 3000);
  return () => clearTimeout(timeout);
}, [mood]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
  const p = localStorage.getItem("ego_profile");
  if (p) {
    const parsed = JSON.parse(p);
    if (parsed.styleProfile) {
      console.log("Gelernter Stil:", parsed.styleProfile);
      // 🛠️ Wichtig: direkte Übergabe des styleProfile an setProfile
      setProfile((prev) => ({
        ...prev,
        ...parsed,
        styleProfile: parsed.styleProfile // sicherstellen dass erhalten
      }));
    } else {
      setProfile(parsed);
    }

    if (parsed.brandingLogo) setBrandingLogo(parsed.brandingLogo);
    if (parsed.brandingColor) setBrandingColor(parsed.brandingColor);
    if (parsed.mode) setMode(parsed.mode);
    if (parsed.lang) setLang(parsed.lang);
  }

  const saved = localStorage.getItem("ego_chat_history");
  if (saved) setMessages(JSON.parse(saved));
  setDarkMode(document.documentElement.dataset.theme === "dark");
}, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("ego_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (!profile) return;
    const updated = { ...profile, mode, lang, brandingLogo, brandingColor };
    setProfile(updated);
    localStorage.setItem("ego_profile", JSON.stringify(updated));
  }, [mode, lang, brandingLogo, brandingColor]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = next;
    setDarkMode(next === "dark");
  };

 const send = async () => {
  if (!input.trim()) return;

  const updated = [...messages, { role: "user", content: input }];
  setMessages(updated);

  // Profil + Kontextvokabular laden
  const currentProfile = profile || JSON.parse(localStorage.getItem("ego_profile") || "{}");
  const styleProfile = currentProfile?.styleProfile || {};
  const vocab = styleProfile?.contextualVocabulary || {};

  console.log("🧠 StyleProfile aktiv:", styleProfile);

  // Stimmung anhand User-Eingabe erkennen
  let detectedMood = null;
const cleanedInput = input.toLowerCase();

for (const moodKey of Object.keys(vocab)) {
  const phrases = vocab[moodKey];
  if (!Array.isArray(phrases)) continue;

  for (const phrase of phrases) {
    const cleanedPhrase = phrase.toLowerCase();
    if (cleanedInput.includes(cleanedPhrase)) {
      detectedMood = moodKey;
      break;
    }
  }
  if (detectedMood) break;
}

  if (detectedMood) {
    console.log("🎯 Stimmung (User) erkannt:", detectedMood);
    setMood(detectedMood);
  } else {
    console.log("😕 Keine Stimmung erkannt (User)");
  }

  setInput("");
  setIsTyping(true);

  const safeProfile = { ...currentProfile, styleProfile };
  delete safeProfile.brandingLogo;

  const recent = updated.slice(-10);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: safeProfile,
      mode,
      lang,
      messages: recent,
    }),
  });

  if (!res.ok) {
    console.error("Chat API Error:", await res.text());
    setIsTyping(false);
    return;
  }

  const { reply } = await res.json();
  const replyText = reply;

  console.log("Antwort vom Bot:", replyText);
  console.log("StyleProfile:", styleProfile);

  setMessages([...updated, { role: "assistant", content: replyText }]);
  setIsTyping(false);
  inputRef.current?.focus();
};
    const remember = (text) => {
    const egoProfile = JSON.parse(localStorage.getItem("ego_profile") || "{}");
    if (!egoProfile.learningJournal) egoProfile.learningJournal = [];
    egoProfile.learningJournal.push({
      text,
      date: new Date().toISOString(),
    });
    localStorage.setItem("ego_profile", JSON.stringify(egoProfile));
    alert("Gemerkter Eintrag gespeichert ✨");
  };

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
        className={styles["chat-container"]}
        style={{ borderTopColor: brandingColor }}
      >
        {/* Header */}
        <div
          className={styles["chat-header"]}
          style={{ borderBottomColor: brandingColor }}
        >
          <div className={styles["chat-header-left"]}>
            {brandingLogo && (
              <img
                src={brandingLogo}
                alt="Branding Logo"
                className={styles["branding-logo"]}
              />
            )}
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
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
            />
            <div>
              <div className={styles["chat-title"]}>Du (Ego)</div>
              <div className={styles["chat-status"]}>
                <span
                  className={styles["status-dot"]}
                  style={{ background: brandingColor }}
                />{" "}
                Online
              </div>
            </div>
          </div>
         <div className={styles["chat-header-right"]}>
  <button onClick={toggleTheme} title="Theme wechseln">🌓</button>
  <button onClick={() => setShowSettings(true)} title="Einstellungen">⚙️</button>
</div>
        </div>

        {/* Mode */}
        <div className={styles["chat-mode-selector"]}>
          <label>Modus:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="default">🧠 Ich selbst</option>
            <option value="coach">🗣️ Coach</option>
            <option value="mentor">🧓 Mentor</option>
            <option value="kritiker">⚡ Kritiker</option>
            <option value="reflexion">Reflexion</option>
          </select>
          <button
            className={styles["chat-reset"]}
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("ego_chat_history");
            }}
          >
            🗑️
          </button>
        </div>

        <div className={styles["chat-mode-indicator"]}>
          {mood && (
  <div className={styles["mood-indicator"]}>
    💭 Stimmung erkannt: <strong>{mood}</strong>
  </div>
)}
          Aktueller Modus: <strong>{mode}</strong>
        </div>
<div style={{ padding: "1rem", textAlign: "center" }}>
  <button
    onClick={() => {
      const p = JSON.parse(localStorage.getItem("ego_profile") || "{}");
      const input = prompt("Test-Satz eingeben:");
      const normalize = (str) =>
        str.toLowerCase().replace(/[.,!?\"'()\[\]{}:;–—\-]/g, "").trim();
      const vocab = p?.styleProfile?.contextualVocabulary || {};

      let detected = null;
      for (const moodKey of Object.keys(vocab)) {
        for (const phrase of vocab[moodKey]) {
          if (
            normalize(input).includes(normalize(phrase)) ||
            normalize(phrase).includes(normalize(input))
          ) {
            detected = moodKey;
            break;
          }
        }
        if (detected) break;
      }

      alert(detected ? `🎯 Stimmung erkannt: ${detected}` : "😕 Keine Stimmung erkannt");
    }}
    style={{
      marginTop: "0.5rem",
      background: "#444",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    }}
  >
    🔍 Stimmung testen
  </button>
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
              <div className={styles["bubble"]}>{m.content}
                {m.role === "assistant" && (
                  <button
                    onClick={() => remember(m.content)}
                    className={styles["remember-button"]}
                  >
                    ⭐ merken
                  </button>
                )}
              </div>
            </div>
            
          ))}
          {isTyping && (
            <div className={styles["typing-bubble"]}>
              <div className={styles["dot"]} />
              <div className={styles["dot"]} />
              <div className={styles["dot"]} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles["chat-input"]}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Frag dein Ego..."
          />
          <button onClick={send} style={{ background: brandingColor }}>
            Senden
          </button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div
          className={styles["settings-modal"]}
          onClick={() => setShowSettings(false)}
        >
          <div
            className={styles["settings-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Einstellungen</h2>
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
                    className={styles["branding-logo"]}
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
            {/* Debug: Stimmungsvokabular manuell setzen */}
      {!mood && (
        <div style={{ margin: "1rem", textAlign: "center" }}>
          <button
            style={{
              padding: "10px 20px",
              background: "#0f0",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              const profile = JSON.parse(localStorage.getItem("ego_profile") || "{}");
              profile.styleProfile = profile.styleProfile || {};
              profile.styleProfile.contextualVocabulary = {
                wütend: ["regt mich richtig auf", "was soll der scheiß"],
                euphorisch: ["mega", "geil", "yesss"],
                traurig: ["macht mich traurig", "fühlt sich schwer an"],
                ironisch: ["na super", "ironisch gemeint"],
                nachdenklich: ["hm", "ich frag mich", "weiß nicht genau"]
              };
              localStorage.setItem("ego_profile", JSON.stringify(profile));
              alert("Debug-Vokabular gesetzt ✅");
            }}
          >
            🔧 Stimmungsvokabular setzen
          </button>
        </div>
      )}
    <     {mood && (
      <div
        style={{
          position: "fixed",
          bottom: "90px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1e1e1e",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: "14px",
          fontSize: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          zIndex: 9999,
        }}
      >
        💭 Stimmung erkannt: <strong>{mood}</strong>
      </div>
    )}
  </>
);
}

