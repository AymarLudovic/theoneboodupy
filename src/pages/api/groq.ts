// /api/groq.ts
import { Groq } from "groq-sdk"; // Make sure this is correctly installed

export const config = {
  runtime: 'edge',
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { input } = await req.body;

    // Use import.meta.env for environment variables in Next.js API routes
    const groqApiKey = process.env.VITE_GROQ_API_KEY; // Use process.env in Node.js

    if (!groqApiKey) {
      console.error("VITE_GROQ_API_KEY is missing in .env file!");
      return res.status(500).json({ message: "Groq API key is missing in .env file!" });
    }

    const groq = new Groq({ apiKey: groqApiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stop: null,
    });

    const responseText = chatCompletion.choices?.[0]?.message?.content || "";

    res.status(200).json({ responseText }); // Send back the response

  } catch (error: any) {
    console.error("Error calling Groq API:", error);
    // IMPORTANT: Send a JSON response with the error message
    return res.status(500).json({ message: error.message || "An error occurred" });
  }
}