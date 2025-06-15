
import { useState } from "react";
import { useRouter } from "next/router";
import AvatarUpload from "../components/AvatarUpload";

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
  { key: "relationships", label: "Wie sieht dein Beziehungsleben aus?" },
  { key: "identity", label: "Wie würdest du dich selbst in drei Worten beschreiben?" },
  { key: "change_event", label: "Gab es ein Ereignis, das dich besonders geprägt hat?" },
  { key: "core_belief", label: "Gibt es einen Leitsatz, an dem du dich orientierst?" },
  { key: "calm", label: "Was bringt dich innerlich zur Ruhe?" },
  { key: "vulnerability", label: "Wann fühlst du dich verletzlich?" },
  { key: "conflict", label: "Wie gehst du mit inneren Konflikten um?" },
  { key: "child_memory", label: "Was ist deine stärkste Erinnerung aus der Kindheit?" },
  { key: "parent_expectation", label: "Was wollten deine Eltern, dass du wirst?" },
  { key: "future_self", label: "Was möchtest du in 10 Jahren über dich sagen können?" },
  { key: "legacy", label: "Welche Spuren möchtest du bei anderen hinterlassen?" }
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    setAnswers({ ...answers, [questions[step]?.key]: e.target.value });
  };

  const next = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      const finalProfile = { ...answers };
      if (avatar) {
        finalProfile.avatar = avatar;
        localStorage.setItem("ego_avatar", avatar);
      }
      localStorage.setItem("ego_profile", JSON.stringify(finalProfile));
      router.push("/summary");
    }
  };

  const isAvatarStep = step === questions.length;

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
      color: "#f4f4f4",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      textAlign: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        {isAvatarStep ? (
          <>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem" }}>
              Wähle ein Avatar-Bild
            </h2>
            <AvatarUpload onAvatarSelect={setAvatar} />
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              {questions[step].label}
            </h2>
            <input
              type="text"
              value={answers[questions[step].key] || ""}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && next()}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                background: "#222",
                border: "none",
                color: "#eee",
                fontSize: "1rem",
                outline: "none",
              }}
              autoFocus
            />
          </>
        )}
        <button
          onClick={next}
          style={{
            marginTop: "2rem",
            padding: "12px 24px",
            background: "linear-gradient(to right, #00ffcc, #00ff88)",
            color: "#111",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(0, 255, 170, 0.3)",
            transition: "transform 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isAvatarStep ? "Fertig" : "Weiter"}
        </button>
      </div>
    </div>
  );
}
