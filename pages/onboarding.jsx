
import { useState } from "react";
import { useRouter } from "next/router";

const questions = [
  {
    category: "Identität & Werte",
    prompts: [
      "Wie würdest du dich selbst in drei Worten beschreiben?",
      "Was ist dir im Leben besonders wichtig?",
      "Gibt es einen Satz, der zu deinem Leben passt?"
    ]
  },
  {
    category: "Kommunikation & Stil",
    prompts: [
      "Wie redest du normalerweise? Locker? Direkt? Eher diplomatisch?",
      "Welche Redewendungen oder Sprüche verwendest du oft?",
      "Wie gehst du mit Kritik um?"
    ]
  },
  {
    category: "Alltag & Beruf",
    prompts: [
      "Was machst du beruflich – oder wofür brennst du?",
      "Wie sieht ein typischer Tag bei dir aus?",
      "Gibt es Dinge, die dir auf den Keks gehen?"
    ]
  },
  {
    category: "Beziehungen & Persönlichkeit",
    prompts: [
      "Bist du eher extrovertiert oder zurückhaltend?",
      "Wie würdest du dich in einer Diskussion verhalten?",
      "Was erwarten deine Freunde oder Familie von dir?"
    ]
  },
  {
    category: "Humor & Reaktionen",
    prompts: [
      "Was bringt dich zum Lachen?",
      "Wie reagierst du auf dumme Kommentare?",
      "Wie reagierst du, wenn jemand dich nervt?"
    ]
  }
];

export default function Onboarding() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const router = useRouter();

  const current = questions[step];
  const updateAnswer = (i, value) => {
    const key = `${step}-${i}`;
    setAnswers({ ...answers, [key]: value });
  };

  const next = () => {
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      const profile = Object.values(answers);
      localStorage.setItem("ego_profile_raw", JSON.stringify(profile));
      router.push("/chat");
    }
  };

  return (
    <div style={{ padding: 40, color: "#eee", background: "#0d0d0d", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>{current.category}</h1>
      {current.prompts.map((q, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <label>{q}</label>
          <input
            style={{ width: "100%", padding: 10, marginTop: 5, background: "#222", color: "#eee", border: "1px solid #333", borderRadius: 4 }}
            value={answers[`${step}-${i}`] || ""}
            onChange={(e) => updateAnswer(i, e.target.value)}
          />
        </div>
      ))}
      <button onClick={next} style={{ padding: "10px 20px", background: "#00ff88", border: "none", borderRadius: 4, marginTop: 20 }}>
        Weiter
      </button>
    </div>
  );
}
