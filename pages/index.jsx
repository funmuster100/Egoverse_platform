
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const start = () => {
    router.push("/onboarding-multi");
  };

  return (
    <div style={{
      background: "#0d0d0d",
      color: "#f4f4f4",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Willkommen bei EgoVerse™</h1>
      <p style={{ fontSize: "1.25rem", maxWidth: "600px", marginBottom: "2rem" }}>
        Erstelle jetzt deinen persönlichen digitalen Zwilling – dein Ego denkt, redet und fühlt wie du.
      </p>
      <button
        onClick={start}
        style={{
          padding: "1rem 2rem",
          fontSize: "1rem",
          background: "#00ff88",
          color: "#111",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Jetzt starten
      </button>
    </div>
  );
}
