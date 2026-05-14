import { User } from "../models/User.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users.map(publicUser),
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Ошибка загрузки пользователей",
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const clients = await User.countDocuments({ role: "client" });
    const employees = await User.countDocuments({ role: "employee" });
    const admins = await User.countDocuments({ role: "admin" });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        clients,
        employees,
        admins,
        blockedUsers,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Ошибка загрузки статистики",
    });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["client", "employee", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Неверная роль",
      });
    }

    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Нельзя менять роль самому себе",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    res.json({
      success: true,
      message: "Роль пользователя обновлена",
      user: publicUser(user),
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Ошибка изменения роли",
    });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Нельзя заблокировать самого себя",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked
        ? "Пользователь заблокирован"
        : "Пользователь разблокирован",
      user: publicUser(user),
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Ошибка блокировки пользователя",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Нельзя удалить самого себя",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    res.json({
      success: true,
      message: "Пользователь удалён",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Ошибка удаления пользователя",
    });
  }
};