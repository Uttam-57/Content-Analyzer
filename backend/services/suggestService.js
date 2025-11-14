

process.env.ONNX_LOG_LEVEL = 'fatal';

import { pipeline } from "@xenova/transformers";

let sentimentAnalyzer = null;
let summarizer = null;


// Load models once
const loadModels = async () => {
  if (!sentimentAnalyzer)
    sentimentAnalyzer = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");
  if (!summarizer)
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-12-6");
};

//  Analyze content and generate suggestions
export const suggestions = async (text) => {
  await loadModels();

  // --- Step 1: Analyze sentiment ---
  const sentiment = await sentimentAnalyzer(text);
  const tone = sentiment[0].label;
  const confidence = sentiment[0].score.toFixed(2);

  // --- Step 2: Summarize for context ---
  const summary = await summarizer(text, { max_length: 60, min_length: 25 });
  const shortSummary = summary[0].summary_text;

  // --- Step 3: Generate suggestions ---
  const suggestions = [];

  if (tone === "NEGATIVE") {
    suggestions.push("Your tone seems a bit negative — try using more optimistic or supportive language.");
  } else if (tone === "POSITIVE") {
    suggestions.push("Good positive tone! Consider adding a clear call-to-action to increase engagement.");
  }

  if (text.length < 100) {
    suggestions.push("The post feels short. Add more details or context to make it more informative.");
  } else if (text.length > 300) {
    suggestions.push("The post is quite long. Try summarizing the main message to keep it punchy.");
  }

  if (!/[!?]/.test(text)) {
    suggestions.push("Add engaging punctuation like exclamation marks or questions to invite responses.");
  }

  if (!/\b(https?:\/\/|www\.)\b/.test(text)) {
    suggestions.push("Consider adding a relevant link or hashtag to increase discoverability.");
  }

  // --- Step 4: Combine response ---
  return {
    summary: shortSummary,
    tone,
    confidence,
    suggestions,
  };
};
