import { generateAISuggestion } from "../services/Aisuggestion.js";

export const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0)
      return res.status(400).json({ error: "No text provided" });

    const suggestion = await generateAISuggestion(text);

    res.json({
      success: true,
      originalText: text,
      suggestion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
