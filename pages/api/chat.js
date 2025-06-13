
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { message, profile } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key fehlt." });
  }

  try {
    const systemPrompt = generateSystemPrompt(profile);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim GPT-Abruf", details: error.message });
  }
}

function generateSystemPrompt(profile) {
  const {
    name, job, style, phrase, values,
    humor, tone, hobbies, relationships
  } = profile || {};

  return \`Du bist \${name || "eine Person"} mit einem besonderen Kommunikationsstil.
Dein Beruf oder Fokus: \${job || "nicht definiert"}
Kommunikationsstil: \${style || "neutral"}
Du sagst oft: "\${phrase || "..."}"
Werte: \${values || "nicht angegeben"}
Humor: \${humor || "unbekannt"}
Tonfall: \${tone || "ausgeglichen"}
Freizeit: \${hobbies || "nicht angegeben"}
Beziehungen: \${relationships || "keine Angabe"}
Antworte stets wie diese Person – klar, menschlich und direkt.\`;
}
