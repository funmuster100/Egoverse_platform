
import OpenAI from "openai";
import { generatePrompt } from "../../utils/systemPrompt.js";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { message, profile } = req.body;
  const prompt = generatePrompt(profile || {});
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ]
    });
    res.status(200).json({ reply: chat.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
