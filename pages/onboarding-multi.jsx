
import { useState } from "react";
import { useRouter } from "next/router";
import AvatarUpload from "../components/AvatarUpload";

const DIALECT_OPTIONS = [
  "hochdeutsch",
  "schwäbisch",
  "bayrisch",
  "berlinerisch",
  "kölsch",
  "sächsisch",
  "norddeutsch",
];

const questions = [
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
  { key: "legacy", label: "Welche Spuren möchtest du bei anderen hinterlassen?", tip: "Was sollen Menschen mit dir verbinden?" },
  { key: "origin", label: "Woher kommst du?", tip: "Ort oder Region genügt – wir erkennen deinen Dialekt automatisch." },
  { key: "dialect", label: "Wähle deinen Dialekt", tip: "Falls die automatische Erkennung nicht stimmt." },
  { key: "expressions", label: "Typische Wörter oder Sprüche", tip: "Z.B. 'weißt was ich mein?', 'passt scho'." },

  // Influencer-Frage als Dropdown
  {
    key: "isInfluencer",
    label: "Bist du Influencer oder möchtest du dein Ego öffentlich nutzen?",
    tip: "Das ermöglicht spezielles Branding und öffentliche Nutzung.",
    type: "select",
    options: [
      { value: "", label: "Bitte auswählen" },
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nein" },
    ],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [brandingLogo, setBrandingLogo] = useState(null);

  function guessDialect(origin) {
    if (!origin) return null;
    const loc = origin.toLowerCase();
    if (loc.includes("ravensburg") || loc.includes("weingarten") || loc.includes("wilhelmsdorf")) return "schwäbisch";
    if (loc.includes("münchen") || loc.includes("bayern")) return "bayrisch";
    if (loc.includes("berlin")) return "berlinerisch";
    if (loc.includes("köln")) return "kölsch";
    if (loc.includes("hamburg")) return "norddeutsch";
    if (loc.includes("dresden") || loc.includes("leipzig")) return "sächsisch";
    return null;
  }

  const handleChange = (e) => {
    const { type, checked, value, name, files } = e.target;

    if (type === "checkbox") {
      setAnswers({ ...answers, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setBrandingLogo(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAnswers({ ...answers, [name]: value });
    }
  };

  const next = () => {
    if (step === questions.length - 1 && !answers.dialect) {
      const guessed = guessDialect(answers.origin);
      setAnswers((prev) => ({ ...prev, dialect: guessed || "hochdeutsch" }));
    }

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      const finalProfile = { ...answers };
      if (avatar) finalProfile.avatar = avatar;
      if (brandingLogo && answers.isInfluencer === "yes") finalProfile.brandingLogo = brandingLogo;
      localStorage.setItem("ego_profile", JSON.stringify(finalProfile));
      router.push("/summary");
    }
  };

  const isAvatarStep = step === questions.length;
  const currentQuestion = questions[step];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0c0c0c, #1a1a1a)",
        color: "#eee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(6px)",
        }}
      >
        {isAvatarStep ? (
          <>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              Lade ein Bild hoch für dein Ego
            </h2>
            <AvatarUpload onAvatarSelect={setAvatar} />

            {answers.isInfluencer === "yes" && (
              <>
                <hr style={{ margin: "1.5rem 0" }} />
                <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                  Lade dein Branding-Logo hoch (optional)
                </h2>
                <input type="file" name="brandingLogo" accept="image/*" onChange={handleChange} />
                {brandingLogo && (
                  <img
                    src={brandingLogo}
                    alt="Branding Logo"
                    style={{ maxWidth: "100px", marginTop: "1rem", borderRadius: "8px" }}
                  />
                )}
                <h2 style={{ marginTop: "1.5rem", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                  Wähle deine Branding-Farbe
                </h2>
                <input
                  type="color"
                  name="brandingColor"
                  value={answers.brandingColor || "#00ff88"}
                  onChange={handleChange}
                  style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.4rem" }}>{currentQuestion.label}</h2>

            {currentQuestion.type === "select" ? (
              <select
                name={currentQuestion.key}
                value={answers[currentQuestion.key] || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  background: "#222",
                  border: "1px solid #333",
                  color: "#eee",
                  marginBottom: "0.8rem",
                  outline: "none",
                }}
              >
                {currentQuestion.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : currentQuestion.type === "checkbox" ? (
              <input
                type="checkbox"
                name={currentQuestion.key}
                checked={answers[currentQuestion.key] || false}
                onChange={handleChange}
                style={{ transform: "scale(1.3)", marginTop: "0.5rem" }}
              />
            ) : currentQuestion.type === "color" ? (
              <input
                type="color"
                name={currentQuestion.key}
                value={answers[currentQuestion.key] || "#00ff88"}
                onChange={handleChange}
                style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
              />
            ) : (
              <input
                type="text"
                name={currentQuestion.key}
                value={answers[currentQuestion.key] || ""}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && next()}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "1rem",
                  background: "#222",
                  border: "1px solid #333",
                  color: "#eee",
                  borderRadius: "8px",
                  marginBottom: "0.8rem",
                  outline: "none",
                }}
              />
            )}

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
            transition: "transform 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isAvatarStep ? "Fertig" : "Weiter"}
        </button>
      </div>
    </div>
  );
}
