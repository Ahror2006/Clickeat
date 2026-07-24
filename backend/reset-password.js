import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/User.js";

dotenv.config();

const email = process.env.RESET_USER_EMAIL?.toLowerCase().trim();
const newPassword = process.env.RESET_USER_PASSWORD;
const role = process.env.RESET_USER_ROLE || "client";

if (!process.env.MONGO_URI || !email || !newPassword) {
  console.error(
    "MONGO_URI, RESET_USER_EMAIL and RESET_USER_PASSWORD are required"
  );
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error("RESET_USER_PASSWORD must contain at least 8 characters");
  process.exit(1);
}

if (!["client", "employee", "admin"].includes(role)) {
  console.error("RESET_USER_ROLE must be client, employee or admin");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
const hashedPassword = await bcrypt.hash(newPassword, 10);

const user = await User.findOneAndUpdate(
  { email },
  {
    password: hashedPassword,
    role,
    isBlocked: false,
  },
  { new: true }
);

if (!user) {
  console.log("Пользователь не найден");
} else {
  console.log("Пароль обновлён:", user.email, user.role);
}

await mongoose.disconnect();
