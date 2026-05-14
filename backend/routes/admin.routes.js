import express from "express";

import {
  getAllUsers,
  getAdminStats,
  changeUserRole,
  toggleBlockUser,
  deleteUser,
} from "../controllers/admin.controller.js";

import { protect, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);

router.put("/users/:id/role", changeUserRole);
router.put("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

export default router;