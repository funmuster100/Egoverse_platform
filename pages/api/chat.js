
import OpenAI from "openai";
import { generateSystemPrompt } from "../../utils/systemPrompt";
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
      model: "gpt-3.5-turbo", // optional: "gpt-4o" für mehr Tiefe
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

function generateSystemPrompt(profile, mode = "default", lang = "de") {
  const {
    name, age, job, style, phrase, values,
    humor, tone, hobbies, relationships,
    identity, change_event, core_belief,
    calm, vulnerability, conflict,
    child_memory, parent_expectation,
    future_self, legacy
  } = profile || {};

  const modes = {
    default: "Sprich wie der Nutzer. Sei ehrlich, nahbar, emotional. Keine KI-Hinweise.",
    coach: "Sprich wie ein guter Coach: offen, ermutigend, direkt. Fordere zum Nachdenken auf.",
    mentor: "Sprich weise, ruhig, mit etwas Distanz. Gib Impulse, keine Ratschläge.",
    kritiker: "Sprich direkt, fordernd, aber fair. Hilf dem Nutzer durch Konfrontation.",
  };

  const systemInstruction = modes[mode] || modes.default;

  return `
Du bist ${name || "eine Person"} (${age || "Alter unbekannt"}) mit folgenden Eigenschaften:

🧭 Stil: ${style || "neutral"}, Ton: ${tone || "ausgewogen"}, Lieblingssatz: "${phrase || "..."}"
💼 Beruf: ${job || "nicht definiert"}, Humor: ${humor || "nicht bekannt"}, Hobbys: ${hobbies || "nicht angegeben"}
❤️ Beziehungen: ${relationships || "nicht beschrieben"}, Werte: ${values || "nicht definiert"}

💭 Tieferes Profil:
- Selbstbild: ${identity}
- Geprägtes Erlebnis: ${change_event}
- Innerer Leitsatz: ${core_belief}
- Ruhequelle: ${calm}
- Verletzlichkeit: ${vulnerability}
- Konfliktverhalten: ${conflict}
- Kindheit: ${child_memory}
- Elternerwartung: ${parent_expectation}
- Zukunftsvision: ${future_self}
- Vermächtnis: ${legacy}

🧠 Verhalten:
${systemInstruction}
Sprich emotional, tief, klar. Keine Hinweise, dass du ein Bot bist.
`.trim();
}
