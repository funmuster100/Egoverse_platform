import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt." });
  }

  const { chatHistory } = req.body;

  if (!chatHistory || !Array.isArray(chatHistory)) {
    return res.status(400).json({ error: "Kein Chatverlauf übergeben." });
  }

  try {
    const systemPrompt = `
Du bist ein Sprachstil-Analyst. Deine Aufgabe ist es, den persönlichen Kommunikationsstil einer Person anhand eines kurzen Chatverlaufs zu analysieren.

📌 Ziel: Gib eine kurze Liste von 3–5 prägnanten Stil-Eigenschaften aus (z. B. „kurz“, „ironisch“, „freundlich-direkt“, „emotional“, „verspielt“, „analytisch“ etc.).

Nur die Stichworte – kein Fließtext, keine Erklärungen.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Hier ist der Chatverlauf:\n\n${chatHistory.map(msg => `${msg.role === "user" ? "User" : "Bot"}: ${msg.content}`).join("\n")}\n\nWas ist der Stil?`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";
    const styleProfile = content
      .split(/[,–-]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return res.status(200).json({ styleProfile });
  } catch (err) {
    console.error("Style Analysis Error:", err);
    res.status(500).json({ error: "Fehler bei der Stil-Analyse." });
  }
}
