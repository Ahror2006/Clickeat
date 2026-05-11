import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ClickEat backend is working",
  });
});

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error.message);
    process.exit(1);
  }
}

startServer();