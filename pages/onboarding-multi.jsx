
import { useState } from "react";
import { useRouter } from "next/router";
import AvatarUpload from "../components/AvatarUpload";

const questions = [
  { key: "name", label: "Wie heißt du?", tip: "Nutze deinen echten Namen oder einen Spitznamen." },
  { key: "age", label: "Wie alt bist du?", tip: "Nur du kannst dein Alter einschätzen." },
  { key: "job", label: "Was machst du beruflich?", tip: "Beschreib es so, wie du es deiner Oma erklären würdest." },
  { key: "style", label: "Wie würdest du deinen Kommunikationsstil beschreiben?", tip: "Bist du eher direkt, empathisch oder humorvoll?" },
  { key: "phrase", label: "Gibt es einen Satz, den du oft sagst?", tip: "Vielleicht ein typischer Spruch oder ein Leitsatz?" },
  { key: "values", label: "Was sind dir im Leben besonders wichtig?", tip: "Denk an Familie, Freiheit, Ehrlichkeit..." },
  { key: "humor", label: "Wie ist dein Humor?", tip: "Zynisch, trocken, albern?" },
  { key: "tone", label: "Wie ist dein Tonfall in Gesprächen?", tip: "Eher ruhig? Ironisch? Leidenschaftlich?" },
  { key: "hobbies", label: "Was machst du gerne in deiner Freizeit?", tip: "Alles von Gärtnern bis Gaming zählt." },
  { key: "relationships", label: "Wie sieht dein Beziehungsleben aus?", tip: "So offen wie du willst." },
  { key: "identity", label: "Wie würdest du dich selbst in drei Worten beschreiben?", tip: "Spontan, tiefgründig, kreativ…?" },
  { key: "change_event", label: "Gab es ein Ereignis, das dich besonders geprägt hat?", tip: "Ein Schlüsselmoment in deinem Leben." },
  { key: "core_belief", label: "Gibt es einen Leitsatz, an dem du dich orientierst?", tip: "Was gibt dir Richtung oder Halt?" },
  { key: "calm", label: "Was bringt dich innerlich zur Ruhe?", tip: "Was hilft dir, abzuschalten?" },
  { key: "vulnerability", label: "Wann fühlst du dich verletzlich?", tip: "Nur wenn du möchtest – das kann sehr ehrlich sein." },
  { key: "conflict", label: "Wie gehst du mit inneren Konflikten um?", tip: "Flucht, Dialog, Analyse?" },
  { key: "child_memory", label: "Was ist deine stärkste Erinnerung aus der Kindheit?", tip: "Ein Moment, der geblieben ist." },
  { key: "parent_expectation", label: "Was wollten deine Eltern, dass du wirst?", tip: "Was war ihre Vorstellung?" },
  { key: "future_self", label: "Was möchtest du in 10 Jahren über dich sagen können?", tip: "Stell dir dein ideales Selbst vor." },
  { key: "legacy", label: "Welche Spuren möchtest du bei anderen hinterlassen?", tip: "Wie sollen Menschen dich in Erinnerung behalten?" }
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [avatar, setAvatar] = useState(() => localStorage.getItem("ego_avatar") || null);

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
  const currentQuestion = questions[step];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #0c0c0c, #1a1a1a)",
      color: "#eee",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      fontFamily: "'Segoe UI', sans-serif",
      position: "relative"
    }}>
      {/* Optionaler Avatar oben rechts */}
      {avatar && (
        <img
          src={avatar}
          alt="Avatar"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2px solid #00ff88",
            objectFit: "cover"
          }}
        />
      )}

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
        {!isAvatarStep && (
          <>
            <div style={{ marginBottom: "0.5rem", opacity: 0.6 }}>
              Frage {step + 1} von {questions.length}
            </div>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.4rem" }}>{currentQuestion.label}</h2>
            <input
              value={answers[currentQuestion.key] || ""}
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
                marginBottom: "0.75rem",
                outline: "none"
              }}
              autoFocus
            />
            <p style={{
              fontSize: "0.9rem",
              color: "#aaa",
              marginBottom: "1.5rem"
            }}>
              {currentQuestion.tip}
            </p>
          </>
        )}

        {isAvatarStep && (
          <>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              Lade ein Bild hoch für dein Ego
            </h2>
            <AvatarUpload onAvatarSelect={setAvatar} />
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
