import { suggestions as offlineSuggestion } from "./suggestService.js";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const hfClient = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

export const generateAISuggestion = async (text) => {
  if (!text || text.trim().length === 0) {
    return {
      summary: "No content provided.",
      tone: "neutral",
      confidence: 0,
      suggestions: ["Please enter some text to analyze."],
    };
  }

  // ----------------------------
  // TRY HUGGINGFACE ROUTER
  // ----------------------------
  if (process.env.HF_API_KEY) {
    try {
      console.log("⚡ Trying HuggingFace Router…");

      const prompt = `
Return STRICT JSON ONLY:

{
  "summary": "",
  "tone": "",
  "confidence": 0.0,
  "suggestions": ["", "", ""]
}

Content:
${text}
`;

      const completion = await hfClient.chat.completions.create({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are an expert content analyzer. Return ONLY valid JSON format with filling all the mention filled acording to your analyzation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Validate HF response
      if (
        !completion ||
        !completion.choices ||
        !completion.choices[0] ||
        !completion.choices[0].message
      ) {
        throw new Error("HF returned empty response");
      }

      let raw = completion.choices[0].message.content;
      if (!raw) throw new Error("HF content is empty");

      raw = raw.trim();
      console.log("🟣 [HF Raw]:", raw);

      // Remove markdown code blocks ```
      raw = raw.replace(/```json|```/g, "").trim();

      // Extract first JSON object safely
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON not found in HF response");

      const json = JSON.parse(jsonMatch[0]);
      return json;
    } catch (err) {
      console.log(
        " HuggingFace FAILED → Falling to offline:",
        err.response?.data || err.message
      );
    }
  }

  // ----------------------------
  // FINAL OFFLINE FALLBACK
  // ----------------------------
  console.log("Using offline suggestion");

  const offline = await offlineSuggestion(text);

  return {
    summary: offline.summary,
    tone: offline.tone,
    confidence: offline.confidence,
    suggestions: offline.suggestions,
  };
};
