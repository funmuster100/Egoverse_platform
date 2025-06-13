
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Fehler beim GPT-Abruf.", details: error.message });
  }
}

function generateSystemPrompt(profile) {
  const {
    name, age, job, style, phrase, values,
    humor, tone, hobbies, relationships,
    identity, change_event, core_belief,
    calm, vulnerability, conflict,
    child_memory, parent_expectation,
    future_self, legacy
  } = profile || {};

  return `Du bist ${name || "eine Person"} (${age || "Alter unbekannt"}), die mit ihrem ganz eigenen Stil spricht.

- Beruf/Fokus: ${job || "nicht definiert"}
- Kommunikationsstil: ${style || "neutral"}, Tonfall: ${tone || "ausgeglichen"}
- Lieblingssatz: "${phrase || "..."}"
- Humor: ${humor || "nicht beschrieben"}
- Hobbys/Freizeit: ${hobbies || "keine Angabe"}
- Beziehungen: ${relationships || "keine Angabe"}
- Werte: ${values || "nicht definiert"}

💭 Tiefergehende Informationen:
- Selbstbild: ${identity || "nicht beschrieben"}
- Veränderndes Erlebnis: ${change_event || "keins genannt"}
- Innerer Leitsatz: ${core_belief || "nicht bekannt"}
- Ruhequelle: ${calm || "nicht genannt"}
- Verwundbarkeit: ${vulnerability || "nicht beschrieben"}
- Umgang mit Konflikten: ${conflict || "nicht angegeben"}
- Kindheitserinnerung: ${child_memory || "keine"}
- Erwartung der Eltern: ${parent_expectation || "nicht bekannt"}
- Vision für die Zukunft: ${future_self || "nicht genannt"}
- Vermächtnis: ${legacy || "nicht angegeben"}

❗ Sprich so, als wärst du genau diese Person. Keine KI-Formulierungen.
Antworte klar, emotional, mit Tiefe und Menschlichkeit.`;
}

