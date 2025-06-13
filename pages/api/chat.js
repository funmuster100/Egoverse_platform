import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { message, prompt } = req.body;

  if (!configuration.apiKey) {
    return res.status(500).json({ error: "API key fehlt." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ],
    });

    res.status(200).json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Fehler beim GPT-Abruf.",
      details: error.response?.data || error.message,
    });
  }
}