
import { useRouter } from 'next/router';
import { useState } from 'react';

const steps = [
  { key: "name", q: "Wie heißt du?" },
  { key: "age", q: "Wie alt bist du?" },
  { key: "location", q: "Wo wohnst du?" },
  { key: "job", q: "Was machst du beruflich (oder gerne)?" },
  { key: "style", q: "Wie redest du?" },
  { key: "phrase", q: "Was sagst du oft?" },
  { key: "humor", q: "Wie ist dein Humor?" },
  { key: "tone", q: "Wie wirkst du auf andere?" },
  { key: "trigger", q: "Was nervt dich?" },
  { key: "calm", q: "Was beruhigt dich?" },
  { key: "values", q: "Was sind deine Werte?" },
  { key: "relationship", q: "Wie ist deine Beziehungssituation?" },
  { key: "hobbies", q: "Was machst du gerne?" },
  { key: "habits", q: "Welche Gewohnheiten hast du?" }
];

export default function Onboarding() {
  const [form, setForm] = useState({});
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("ego_profile", JSON.stringify(form));
      router.push("/chat");
    }
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#eee", height: "100vh", padding: 40, fontFamily: "Inter" }}>
      <h2>Frage {step + 1} / {steps.length}</h2>
      <p style={{ fontSize: "1.2rem" }}>{steps[step].q}</p>
      <input
        type="text"
        autoFocus
        name={steps[step].key}
        value={form[steps[step].key] || ""}
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
        style={{ marginTop: 12, padding: 10, width: "100%", background: "#222", color: "#eee", borderRadius: 6, border: "none" }}
      />
      <button onClick={handleNext} style={{ marginTop: 20, padding: "10px 20px", background: "#00ff88", color: "#111", border: "none", borderRadius: 6 }}>
        Weiter
      </button>
    </div>
  );
}
