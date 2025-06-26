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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Du bist ein Stimmungserkenner. Analysiere die Stimmung des Users basierend auf dessen Nachricht. 
Antwort nur mit einem einzigen Wort in Kleinbuchstaben: "wütend", "traurig", "euphorisch", "ironisch", "nachdenklich" oder "neutral".
Wenn du zwischen zwei Stimmungen schwankst, nimm die dominierende. Wenn du nichts erkennst, antworte mit "neutral".`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    const mood = completion.choices[0]?.message?.content?.toLowerCase().trim();

    if (
      ["wütend", "traurig", "euphorisch", "ironisch", "nachdenklich", "neutral"].includes(mood)
    ) {
      return res.status(200).json({ mood });
    } else {
      return res.status(200).json({ mood: "neutral" });
    }
  } catch (err) {
    console.error("Fehler bei detect-mood:", err);
    return res.status(500).json({ error: "Fehler bei Stimmungserkennung" });
  }
}
