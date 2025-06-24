import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Keine gültigen Nachrichten übergeben." });
  }

  const prompt = `
Analysiere den Schreibstil dieser Person auf Basis der folgenden Chatverläufe. Gib eine Liste mit 5 bis 8 prägnanten Merkmalen zurück. Beispiele: "ironisch", "emotional", "kurze Sätze", "direkt", "regionaler Slang", "viele Emojis", "jugendsprachlich", "freundlich-provokant" etc. Nur die Liste, keine Einleitung.

Verlauf:
${messages.map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.content}`).join("\n")}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Du bist ein präziser Stil-Analyst." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
    });

    const analysis = completion.choices?.[0]?.message?.content?.trim().split("\n").map((s) => s.replace(/^[-•*]\s*/, "").trim()) || [];

    res.status(200).json({ styleProfile: analysis });
  } catch (error) {
    console.error("Analyse-Fehler:", error);
    res.status(500).json({ error: "Fehler bei der Stil-Analyse." });
  }
}
