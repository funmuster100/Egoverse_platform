import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Kein Text übergeben." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Falls du nur gpt-3.5 nutzt, kannst du hier zurückschalten
      messages: [
        {
          role: "system",
          content: `
Analysiere den folgenden Text und beantworte:

1. Wie ist der Schreibstil? (z. B. direkt, verspielt, ironisch)
2. Welche typischen Wörter oder Redewendungen verwendet die Person?
3. Welcher Dialekt ist erkennbar? Ist es Hochdeutsch mit Färbung? Wenn ja, welche?
4. Wie wirkt der Tonfall? (z. B. locker, ruhig, provokativ)
5. Erstelle ein kurzes Beispiel, wie diese Person auf „Mir geht's heute nicht gut“ reagieren würde.

Antworte im folgenden JSON-Format:
{
  "stil": "...",
  "dialektBasis": "...",
  "dialektMischung": "...",
  "expressions": ["...", "..."],
  "ton": "...",
  "beispielAntwort": "..."
}
`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    try {
      const json = JSON.parse(reply);
      return res.status(200).json(json);
    } catch {
      return res.status(500).json({ error: "Antwort konnte nicht als JSON geparst werden.", raw: reply });
    }
  } catch (err) {
    console.error("Fehler bei GPT:", err);
    res.status(500).json({ error: "Analyse fehlgeschlagen." });
  }
}
