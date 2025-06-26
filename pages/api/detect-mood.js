// pages/api/detect-mood.js

export default async function handler(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Kein Text übergeben" });
  }

  const systemPrompt = `Du bist ein Stimmungs-Analysator. Deine Aufgabe ist es, die Stimmung eines kurzen Texts zu erkennen. Antworte nur mit einem einzigen Wort aus der folgenden Liste:

- wütend
- traurig
- euphorisch
- ironisch
- nachdenklich
- neutral

Wenn du keine Stimmung sicher zuordnen kannst, antworte mit "neutral".`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        max_tokens: 10,
        temperature: 0.3,
      }),
    });

    const json = await openaiRes.json();
    const mood = json.choices?.[0]?.message?.content?.toLowerCase().trim() || "neutral";

    res.status(200).json({ mood });
  } catch (err) {
    console.error("Fehler bei Stimmungserkennung:", err);
    res.status(500).json({ error: "Fehler bei Analyse" });
  }
}
