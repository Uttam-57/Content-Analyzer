
import express from "express";
import cors from "cors";
import fileUploadRoutes from "./routes/fileRoute.js";
import textRoutes from "./routes/textRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/upload", fileUploadRoutes);
app.use("/text", textRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
