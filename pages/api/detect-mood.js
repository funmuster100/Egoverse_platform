// pages/api/detect-mood.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Kein gültiger Text" });
  }

  try {
    const allowedMoods = [
      "wütend",
      "traurig",
      "euphorisch",
      "ironisch",
      "nachdenklich",
      "neutral",
    ];

    const prompt = `
Du bist ein Stimmungserkenner.

Analysiere folgende Nachricht und antworte ausschließlich mit **einem dieser Wörter in Kleinbuchstaben**:
- wütend
- traurig
- euphorisch
- ironisch
- nachdenklich
- neutral

Beurteile die **emotionale Färbung und Tonalität** der Nachricht.
Wähle die **dominierende Stimmung**. Wenn du keine erkennst, gib "neutral" zurück.

Nachricht:
"${text}"

Antwort:
(Nur das eine Wort – keine Begründung, keine Erklärung.)
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const raw = completion.choices?.[0]?.message?.content?.toLowerCase().trim();

    const mood = allowedMoods.includes(raw) ? raw : "neutral";

    return res.status(200).json({ mood });
  } catch (err) {
    console.error("Fehler bei detect-mood:", err);
    return res.status(500).json({ error: "Fehler bei Stimmungserkennung" });
  }
}
