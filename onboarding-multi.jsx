
import { useState } from "react";
import { useRouter } from "next/router";

const categories = [
  {
    name: "Name",
    questions: ["Wie heißt du?"]
  },
  {
    name: "Alter",
    questions: ["Wie alt bist du?"]
  },
  {
    name: "Kommunikation",
    questions: [
      "Wie würdest du deinen Kommunikationsstil beschreiben?",
      "Was ist dir in Gesprächen wichtig?"
    ]
  },
  {
    name: "Werte",
    questions: [
      "Welche Werte sind dir besonders wichtig im Leben?",
      "Was motiviert dich?"
    ]
  },
  {
    name: "Freizeit",
    questions: [
      "Was machst du in deiner Freizeit gern?",
      "Welche Hobbys oder Leidenschaften hast du?"
    ]
  },
  {
    name: "Beziehungen",
    questions: [
      "Wie würdest du deine Beziehungen zu anderen Menschen beschreiben?",
      "Was ist dir in Beziehungen wichtig?"
    ]
  }
];

export default function OnboardingMulti() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const router = useRouter();
  const currentCategory = categories[step];

  const handleAnswer = (question, answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentCategory.name]: {
        ...prev[currentCategory.name],
        [question]: answer
      }
    }));
  };

  const handleNext = () => {
    if (step < categories.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("ego_profile", JSON.stringify(answers));
      router.push("/chat");
    }
  };

  return (
    <div style={{ padding: 20, color: "#eee", backgroundColor: "#111", minHeight: "100vh" }}>
      <h2>{currentCategory.name}</h2>
      {currentCategory.questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <label>{q}</label><br />
          <input
            type="text"
            onChange={(e) => handleAnswer(q, e.target.value)}
            style={{ width: "100%", padding: 8, backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
          />
        </div>
      ))}
      <button onClick={handleNext} style={{ marginTop: 20, padding: "10px 20px", backgroundColor: "#00ff88", border: "none", borderRadius: 6 }}>
        {step < categories.length - 1 ? "Weiter" : "Abschließen"}
      </button>
    </div>
  );
}
