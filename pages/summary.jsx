import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Summary() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    if (!p) return router.push("/onboarding-multi");
    setProfile(JSON.parse(p));
  }, []);

  if (!profile) return <div style={styles.container}>Lade Profil...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>🧠</div>
        <h2 style={styles.name}>Hallo {profile.name || "unbekannte Person"}</h2>
        <p><strong>Beruf:</strong> {profile.job || "nicht definiert"}</p>
        <p><strong>Kommunikationsstil:</strong> {profile.style || "neutral"}</p>
        <p><strong>Typischer Satz:</strong> “{profile.phrase || "..."}”</p>
        <p><strong>Werte:</strong> {profile.values || "–"}</p>
        <p><strong>Humor:</strong> {profile.humor || "–"}</p>
        <p><strong>Tonfall:</strong> {profile.tone || "–"}</p>
        <p><strong>Hobbys:</strong> {profile.hobbies || "–"}</p>
        <p><strong>Beziehungen:</strong> {profile.relationships || "–"}</p>
        <button style={styles.button} onClick={() => router.push("/chat")}>
          Weiter zum Chat
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#111",
    color: "#eee",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  },
  avatar: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 10,
  },
  name: {
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    background: "#00ff88",
    color: "#111",
    padding: "10px 20px",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 20,
    width: "100%",
  },
};
