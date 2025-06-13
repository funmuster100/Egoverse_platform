
import { useState } from "react";
import { useRouter } from "next/router";

const questions = [
  // Ursprüngliche Fragen
  { key: "name", label: "Wie heißt du?" },
  { key: "age", label: "Wie alt bist du?" },
  { key: "job", label: "Was machst du beruflich?" },
  { key: "style", label: "Wie würdest du deinen Kommunikationsstil beschreiben?" },
  { key: "phrase", label: "Gibt es einen Satz, den du oft sagst?" },
  { key: "values", label: "Was sind dir im Leben besonders wichtig?" },
  { key: "humor", label: "Wie ist dein Humor?" },
  { key: "tone", label: "Wie ist dein Tonfall in Gesprächen?" },
  { key: "hobbies", label: "Was machst du gerne in deiner Freizeit?" },
  { key: "relationships", label: "Wie sieht dein Beziehungsleben aus?" },

  // Erweiterte Fragen – Selbstbild & Persönlichkeit
  { key: "identity", label: "Wie würdest du dich selbst in drei Worten beschreiben?" },
  { key: "change_event", label: "Gab es ein Ereignis, das dich besonders geprägt hat?" },
  { key: "core_belief", label: "Gibt es einen Leitsatz, an dem du dich orientierst?" },

  // Emotion & Tiefe
  { key: "calm", label: "Was bringt dich innerlich zur Ruhe?" },
  { key: "vulnerability", label: "Wann fühlst du dich verletzlich?" },
  { key: "conflict", label: "Wie gehst du mit inneren Konflikten um?" },

  // Prägung
  { key: "child_memory", label: "Was ist deine stärkste Erinnerung aus der Kindheit?" },
  { key: "parent_expectation", label: "Was wollten deine Eltern, dass du wirst?" },

  // Zukunft & Sinn
  { key: "future_self", label: "Was möchtest du in 10 Jahren über dich sagen können?" },
  { key: "legacy", label: "Welche Spuren möchtest du bei anderen hinterlassen?" }
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
      router.push("/summary");
    }
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#eee", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>{questions[step].label}</h2>
      <input
        value={answers[questions[step].key] || ""}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && next()}
        style={{ padding: 12, borderRadius: 6, border: "none", background: "#222", color: "#eee", width: "100%", maxWidth: 500 }}
        autoFocus
      />
      <button onClick={next} style={{ marginTop: 20, padding: "10px 20px", background: "#00ff88", color: "#111", border: "none", borderRadius: 6 }}>
        Weiter
      </button>
    </div>
  );
}
