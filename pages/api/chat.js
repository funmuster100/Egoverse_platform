
import OpenAI from "openai";
import { generateSystemPrompt } from "../../utils/systemPrompt"; // ✅ externer Import

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { message, profile, mode = "default", lang = "de" } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key fehlt." });
  }

  try {
    const systemPrompt = generateSystemPrompt(profile, mode, lang);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // optional: "gpt-4o"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "Ich konnte gerade nichts antworten. Versuch's bitte nochmal.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Fehler beim GPT-Abruf.", details: error.message });
  }
}
