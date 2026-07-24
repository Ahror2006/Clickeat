import express from "express";
import { Feedback } from "../models/Feedback.js";
import { allowRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
const allowedKinds = ["review", "support", "complaint"];

router.post("/", async (req, res) => {
  try {
    const { kind, name, contact, category, rating, message, fileName, fileData } =
      req.body;

    if (!allowedKinds.includes(kind) || !name?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Тип, имя и сообщение обязательны",
      });
    }

    if (["support", "complaint"].includes(kind) && !contact?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Укажите email или телефон",
      });
    }

    const feedback = await Feedback.create({
      kind,
      name,
      contact,
      category,
      rating: kind === "review" ? rating : undefined,
      message,
      fileName,
      fileData,
    });

    return res.status(201).json({ success: true, id: feedback._id.toString() });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Не удалось сохранить обращение",
    });
  }
});

router.get("/reviews", async (_req, res) => {
  const reviews = await Feedback.find({ kind: "review" })
    .select("name category rating message createdAt")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return res.json({ success: true, reviews });
});

router.get("/", protect, allowRoles("admin"), async (req, res) => {
  const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(500);
  return res.json({ success: true, feedback });
});

export default router;
