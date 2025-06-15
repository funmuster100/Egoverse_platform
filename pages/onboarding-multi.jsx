
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
    setAnswers({ ...answers, [questions[step].key]: e.target.value });
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
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #0c0c0c, #1a1a1a)",
      color: "#eee",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "16px",
        padding: "2rem",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)"
      }}>
        {isAvatarStep ? (
          <>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              Lade ein Bild hoch für dein Ego
            </h2>
            <AvatarUpload onAvatarSelect={setAvatar} />
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.4rem" }}>{questions[step].label}</h2>
            <input
              value={answers[questions[step].key] || ""}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && next()}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                background: "#222",
                border: "1px solid #333",
                color: "#eee",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                outline: "none"
              }}
              autoFocus
            />
          </>
        )}

        <button
          onClick={next}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(to right, #00ffcc, #00ff88)",
            color: "#111",
            cursor: "pointer",
            boxShadow: "0 0 16px rgba(0, 255, 170, 0.3)",
            transition: "transform 0.2s ease-in-out"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {isAvatarStep ? "Fertig" : "Weiter"}
        </button>
      </div>
    </div>
  );
}
