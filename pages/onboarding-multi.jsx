
import { useState } from "react";
import { useRouter } from "next/router";

const questions = [
  { key: "name", label: "Wie heißt du?" },
  { key: "age", label: "Wie alt bist du?" },
  { key: "job", label: "Was machst du beruflich?" },
  { key: "style", label: "Wie würdest du deinen Kommunikationsstil beschreiben?" },
  { key: "phrase", label: "Gibt es einen Satz, den du oft sagst?" },
  { key: "values", label: "Was sind dir im Leben besonders wichtig?" },
  { key: "humor", label: "Wie ist dein Humor?" },
  { key: "tone", label: "Wie ist dein Tonfall in Gesprächen?" },
  { key: "hobbies", label: "Was machst du gerne in deiner Freizeit?" },
  { key: "relationships", label: "Wie sieht dein Beziehungsstatus aus?" }
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleChange = (e) => {
    setAnswers({ ...answers, [questions[step].key]: e.target.value });
  };

  const next = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("ego_profile", JSON.stringify(answers));
      router.push("/chat");
    }
  };

  return (
    <div style={{ padding: "2rem", color: "#eee", background: "#111", height: "100vh" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{questions[step].label}</h1>
      <input
        type="text"
        value={answers[questions[step].key] || ""}
        onChange={handleChange}
        placeholder="Antwort hier eingeben..."
        style={{
          padding: "0.75rem",
          width: "100%",
          maxWidth: "400px",
          background: "#222",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "6px",
          marginBottom: "1rem"
        }}
      />
      <br />
      <button
        onClick={next}
        style={{
          padding: "0.5rem 1.5rem",
          background: "#00ff88",
          color: "#111",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {step < questions.length - 1 ? "Weiter" : "Zum Chat"}
      </button>
    </div>
  );
}
