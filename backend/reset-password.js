import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/User.js";

dotenv.config();

const email = "admin2@clickeat.uz";
const newPassword = "11110000";

await mongoose.connect(process.env.MONGO_URI);
console.log("DB:", mongoose.connection.name);
console.log("HOST:", mongoose.connection.host);

const users = await User.find().select("+password");
console.log(
  users.map((user) => ({
    email: user.email,
    role: user.role,
    hasPasswordHash: user.password?.startsWith("$2b$"),
  }))
);

const hashedPassword = await bcrypt.hash(newPassword, 10);

const user = await User.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  {
    password: hashedPassword,
    role: "employee",
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