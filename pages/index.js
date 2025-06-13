
import Link from "next/link";
export default function Home() {
  return (
    <div style={{ background: "#0d0d0d", color: "#eee", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Inter" }}>
      <h1 style={{ fontSize: 32 }}>Willkommen bei EgoVerse™</h1>
      <p>Erstelle deinen digitalen Klon und erlebe dich selbst neu.</p>
      <Link href="/onboarding">
        <button style={{ marginTop: 20, background: "#00ff88", color: "#111", padding: "10px 24px", borderRadius: 6, border: "none" }}>Jetzt starten</button>
      </Link>
    </div>
  );
}
