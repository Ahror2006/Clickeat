import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Имя обязательно"],
      trim: true,
      minlength: [2, "Имя слишком короткое"],
    },

    email: {
      type: String,
      required: [true, "Email обязателен"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Пароль обязателен"],
      minlength: [6, "Пароль должен быть минимум 6 символов"],
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["client", "employee", "admin"],
      default: "client",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    pointsBalance: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
