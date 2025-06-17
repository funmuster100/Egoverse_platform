import { useState, useEffect } from "react";

const QUESTIONS = [
  "Hey! 😊 Stell dir vor, ich bin dein Ego – wie würdest du mich begrüßen?",
  "Was war heute das erste, was dir durch den Kopf ging?",
  "Wie würdest du einem Freund erzählen, wie dein Tag gerade läuft?",
  "Was bringt dich auf die Palme? 🙃",
  "Und was bringt dich zum Lachen – so richtig?",
  "Wie würdest du reagieren, wenn ich gerade mies drauf wäre?",
  "Hast du einen Spruch oder Satz, den du oft verwendest?",
  "Zum Schluss: Was sollte ich unbedingt über dich wissen, damit ich wie du klinge?"
];

export default function StyleTest({ onComplete }) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([{ from: "bot", text: QUESTIONS[0] }]);
  const [input, setInput] = useState("");
  const [styleProfile, setStyleProfile] = useState([]);

  const sendAnswer = () => {
    if (!input.trim()) return;

    const updated = [
      ...messages,
      { from: "user", text: input },
    ];

    setMessages(updated);
    setStyleProfile((prev) => [...prev, input]);
    setInput("");

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => {
        setMessages([...updated, { from: "bot", text: QUESTIONS[step + 1] }]);
        setStep(step + 1);
      }, 700);
    } else {
      setTimeout(() => {
        onComplete(styleProfile.concat(input));
      }, 500);
    }
  };

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.05)",
      padding: "2rem",
      borderRadius: "16px",
      maxWidth: "600px",
      margin: "2rem auto",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#eee",
      boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    }}>
      <h2 style={{ marginBottom: "1rem" }}>🗣 Schreibstil-Test</h2>

      <div style={{
        maxHeight: "300px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "1rem",
        background: "#111",
        borderRadius: "12px",
        fontSize: "1rem",
        lineHeight: "1.5",
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
              background: msg.from === "user" ? "#2563eb" : "rgba(255,255,255,0.1)",
              padding: "10px 14px",
              borderRadius: "14px",
              maxWidth: "80%",
              color: "#fff",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
          placeholder="Deine Antwort..."
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#222",
            color: "#eee",
          }}
        />
        <button
          onClick={sendAnswer}
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            padding: "0 18px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Senden
        </button>
      </div>
    </div>
  );
}
