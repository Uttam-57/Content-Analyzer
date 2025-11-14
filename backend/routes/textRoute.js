import express from "express";
import { analyzeText } from "../controllers/textController.js";

const router = express.Router();

router.post("/", analyzeText);

export default router;
