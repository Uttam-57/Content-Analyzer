import express from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/fileController.js";

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // e.g., 10MB limit 
  }
});

router.post("/", upload.single("file"), handleFileUpload);

export default router;
