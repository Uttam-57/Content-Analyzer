import fs from "fs";
import { extractTextFromFile } from "../services/extractService.js";
import { generateAISuggestion } from "../services/Aisuggestion.js"; // online (HaggingFace)

export const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    const fileBuffer = req.file.buffer;
    const fileMimeType = req.file.mimetype;
    const fileName = req.file.originalname;

    // 2. Extract text directly from the Buffer
    const extractedText = await extractTextFromFile(fileBuffer, fileMimeType);
    // 2️ Try online AI suggestion first
    let suggestion;
    try {
      suggestion = await generateAISuggestion(extractedText);
    } catch (aiError) {
      console.warn("⚠️ AI service failed, switching to offline mode:", aiError.message);
    }


    // 4️ Send combined structured response
    res.json({
      success: true,
      extractedText,
      suggestion,
    });
  } catch (err) {
    console.error("❌ File upload handler error:", err.message);
    res.status(500).json({
      success: false,
      error: "Internal server error during processing",
    });
  }
};
