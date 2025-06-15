import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Summary() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    const avatar = localStorage.getItem("ego_avatar");
    if (!p) return router.push("/onboarding-multi");

    const parsed = JSON.parse(p);
    if (avatar) parsed.avatar = avatar;
    setProfile(parsed);
  }, []);

  if (!profile) return <div style={styles.container}>Lade Profil...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt="Avatar"
            width={80}
            height={80}
            style={styles.avatarImage}
          />
        ) : (
          <div style={styles.avatarFallback}>🧠</div>
        )}

        <h2 style={styles.name}>Willkommen, {profile.name || "unbekannte Person"}</h2>
        <ul style={styles.infoList}>
          <Info label="Beruf" value={profile.job} />
          <Info label="Kommunikationsstil" value={profile.style} />
          <Info label="Typischer Satz" value={`„${profile.phrase}“`} />
          <Info label="Werte" value={profile.values} />
          <Info label="Humor" value={profile.humor} />
          <Info label="Tonfall" value={profile.tone} />
          <Info label="Hobbys" value={profile.hobbies} />
          <Info label="Beziehungen" value={profile.relationships} />
        </ul>

        <button style={styles.button} onClick={() => router.push("/chat")}>
          Starte dein Gespräch
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <li style={styles.infoItem}>
      <strong style={styles.label}>{label}:</strong> {value || "–"}
    </li>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to bottom, #0c0c0c, #1a1a1a)",
    color: "#eee",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 520,
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
  },
  avatarImage: {
    borderRadius: "50%",
    marginBottom: 16,
    objectFit: "cover",
  },
  avatarFallback: {
    fontSize: 56,
    textAlign: "center",
    marginBottom: 16,
  },
  name: {
    textAlign: "center",
    fontSize: "1.6rem",
    marginBottom: 24,
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  infoItem: {
    marginBottom: 10,
    lineHeight: 1.4,
  },
  label: {
    color: "#00ff88",
  },
  button: {
    marginTop: 24,
    background: "linear-gradient(to right, #00ffcc, #00ff88)",
    color: "#111",
    border: "none",
    borderRadius: 10,
    padding: "14px 20px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 0 12px rgba(0,255,170,0.3)",
    transition: "transform 0.2s ease-in-out",
  },
};
