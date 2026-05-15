import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
    role: user.role || "client",
    isBlocked: Boolean(user.isBlocked),
    createdAt: user.createdAt,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Имя, email и пароль обязательны",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();
    const normalizedPhone = phone ? phone.trim() : "";

    if (normalizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Имя слишком короткое",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Пароль должен быть минимум 8 символов",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      avatar: "",
      role: "client",
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Регистрация успешна",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка регистрации",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email и пароль обязательны",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Аккаунт заблокирован",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Вход выполнен успешно",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка входа",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: publicUser(req.user),
  });
});

router.patch("/me", protect, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    if (name !== undefined) {
      const normalizedName = name.trim();

      if (normalizedName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Имя слишком короткое",
        });
      }

      req.user.name = normalizedName;
    }

    if (phone !== undefined) {
      req.user.phone = phone.trim();
    }

    if (avatar !== undefined) {
      req.user.avatar = avatar;
    }

    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Профиль обновлён",
      user: publicUser(req.user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка обновления профиля",
      error: error.message,
    });
  }
});

export default router;