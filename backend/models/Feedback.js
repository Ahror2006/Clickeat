import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["review", "support", "complaint"],
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    contact: { type: String, trim: true, maxlength: 200, default: "" },
    category: { type: String, trim: true, maxlength: 100, default: "" },
    rating: { type: Number, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    fileName: { type: String, trim: true, maxlength: 255, default: "" },
    fileData: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
