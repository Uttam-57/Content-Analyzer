import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import fs from "fs";
import sharp from "sharp";

export const extractTextFromFile = async (fileBuffer, fileMimeType) => {
  const mimeType = fileMimeType.toLowerCase();
    
    // --- PDF Extraction ---
    if (mimeType === "application/pdf") {
        try {
            // pdfParse works directly on the Buffer
            const result = await pdfParse(fileBuffer);
            return result.text.trim() || "No readable text found in PDF.";
        } catch (error) {
            console.error("PDF parsing error:", error);
            throw new Error("Failed to read text from PDF.");
        }
    }

    // --- Image Extraction (JPG, JPEG, PNG) ---
    if (mimeType.startsWith("image/")) {
        try {
            // sharp works directly on the Buffer
            const image = await sharp(fileBuffer).grayscale().toBuffer();
            const { data } = await Tesseract.recognize(image, "eng", { logger: () => {} });
            return data.text.trim() || "No text detected in image.";
        } catch (error) {
            console.error("Image processing error:", error);
            throw new Error("Failed to detect text in image.");
        }
    }

    throw new Error(`Unsupported file type: ${fileMimeType}`);
};