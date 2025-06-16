
import { useState } from "react";
import { useRouter } from "next/router";
import AvatarUpload from "../components/AvatarUpload";

const questions = [
  { key: "origin", label: "Wo kommst du ursprünglich her?", tip: "Der Ort hilft uns, deinen Dialekt realistisch zu spiegeln." },
  { key: "name", label: "Wie heißt du?", tip: "Du kannst auch einen Spitznamen angeben." },
  { key: "age", label: "Wie alt bist du?", tip: "Dein Alter hilft deinem Ego, dich besser zu spiegeln." },
  { key: "job", label: "Was machst du beruflich?", tip: "Stell dir vor, du erklärst es einem Kind." },
  { key: "style", label: "Wie würdest du deinen Kommunikationsstil beschreiben?", tip: "Kurz, direkt oder blumig und verspielt?" },
  { key: "phrase", label: "Gibt es einen Satz, den du oft sagst?", tip: "Vielleicht ein typischer Spruch von dir?" },
  { key: "values", label: "Was sind dir im Leben besonders wichtig?", tip: "Werte wie Ehrlichkeit, Freiheit oder Familie?" },
  { key: "humor", label: "Wie ist dein Humor?", tip: "Ironisch, albern, schwarz oder ganz trocken?" },
  { key: "tone", label: "Wie ist dein Tonfall in Gesprächen?", tip: "Eher ruhig, energisch oder freundlich-direkt?" },
  { key: "hobbies", label: "Was machst du gerne in deiner Freizeit?", tip: "Denk an Dinge, die dich wirklich erfüllen." },
  { key: "relationships", label: "Wie sieht dein Beziehungsleben aus?", tip: "Offen, ehrlich – so viel du magst." },
  { key: "identity", label: "Wie würdest du dich selbst in drei Worten beschreiben?", tip: "Intuitiv antworten – was kommt dir zuerst?" },
  { key: "change_event", label: "Gab es ein Ereignis, das dich besonders geprägt hat?", tip: "Ein Wendepunkt in deinem Leben?" },
  { key: "core_belief", label: "Gibt es einen Leitsatz, an dem du dich orientierst?", tip: "Ein Satz, der dich durchs Leben begleitet?" },
  { key: "calm", label: "Was bringt dich innerlich zur Ruhe?", tip: "Vielleicht ein Ort, ein Gedanke oder ein Mensch?" },
  { key: "vulnerability", label: "Wann fühlst du dich verletzlich?", tip: "Keine falsche Scheu – sei ehrlich zu dir." },
  { key: "conflict", label: "Wie gehst du mit inneren Konflikten um?", tip: "Was passiert, wenn du mit dir haderst?" },
  { key: "child_memory", label: "Was ist deine stärkste Erinnerung aus der Kindheit?", tip: "Schließ kurz die Augen und spür hinein." },
  { key: "parent_expectation", label: "Was wollten deine Eltern, dass du wirst?", tip: "Und wie fühlt sich das heute für dich an?" },
  { key: "future_self", label: "Was möchtest du in 10 Jahren über dich sagen können?", tip: "Schreib’s wie eine kurze Vision." },
  { key: "legacy", label: "Welche Spuren möchtest du bei anderen hinterlassen?", tip: "Was sollen Menschen mit dir verbinden?" }
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

      // Dialekt automatisch erkennen
      if (finalProfile.origin) {
        const region = finalProfile.origin.trim().toLowerCase();
        const dialectMap = {
          wilhelmsdorf: "schwäbisch",
          berlin: "berlinerisch",
          münchen: "bairisch",
          hamburg: "norddeutsch",
          köln: "rheinisch",
          leipzig: "sächsisch",
          frankfurt: "hessisch",
          stuttgart: "schwäbisch",
          wien: "österreichisch",
          zürich: "schweizerdeutsch",
          bremen: "norddeutsch",
          dresden: "sächsisch",
          nürnberg: "fränkisch",
          hannover: "hochdeutsch",
          freiburg: "badisch"
        };
        finalProfile.dialect = dialectMap[region] || "hochdeutsch";
      }

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
                marginBottom: "0.8rem",
                outline: "none"
              }}
              autoFocus
            />
            {currentQuestion.tip && (
              <p style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "1.5rem" }}>
                {currentQuestion.tip}
              </p>
            )}
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
