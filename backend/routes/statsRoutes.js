import express from "express";
import { getDashboardStats, getUserDashboardStats } from "../controllers/statsController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cho phép cả user thường xem dashboard (với data giới hạn dựa trên permission)
router.get("/dashboard", protect, getDashboardStats);

// Dashboard riêng cho user (xem thông tin hộ gia đình của mình)
router.get("/user-dashboard", protect, getUserDashboardStats);

export default router;