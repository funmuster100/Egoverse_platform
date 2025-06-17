import { useState } from "react";

const styleQuestions = [
  "Wie war dein Tag bisher?",
  "Was regt dich momentan am meisten auf?",
  "Wie würdest du einem Freund ein Problem erklären?",
  "Was bedeutet Glück für dich?",
  "Welche Rolle spielen Emotionen in deinem Alltag?",
];

export default function StyleTest({ onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.response.value.trim();
    if (input) {
      setAnswers((prev) => [...prev, input]);
      e.target.reset();
      if (step < styleQuestions.length - 1) {
        setStep(step + 1);
      } else {
        const styleProfile = {
          emojiUse: answers.join(" ").match(/[\u{1F600}-\u{1F6FF}]/gu)?.length || 0,
          avgLength: Math.round(answers.reduce((sum, a) => sum + a.length, 0) / answers.length),
          punctuation: answers.join(" ").match(/[!?]/g)?.length || 0,
          sample: answers.join("\n"),
        };
        localStorage.setItem("styleProfile", JSON.stringify(styleProfile));
        onFinish();
      }
    }
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: "16px",
      padding: "2rem",
      color: "#eee",
      maxWidth: "600px",
      margin: "0 auto",
      marginTop: "2rem",
    }}>
      <h2 style={{ marginBottom: "1rem" }}>
        Schreibstil-Test ({step + 1}/{styleQuestions.length})
      </h2>
      <p style={{ marginBottom: "1rem", color: "#aaa" }}>{styleQuestions[step]}</p>
      <form onSubmit={handleSubmit}>
        <textarea
          name="response"
          rows={4}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            background: "#222",
            border: "1px solid #444",
            borderRadius: "8px",
            color: "#eee",
            resize: "none",
          }}
          autoFocus
        />
        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(to right, #00ffcc, #00ff88)",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Weiter
        </button>
      </form>
    </div>
  );
}
