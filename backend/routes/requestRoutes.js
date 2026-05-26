import express from "express";
import {
  createUpdateRequest,
  createPaymentRequest,   
  createTemporaryResidenceRequest,
  createTemporaryAbsenceRequest,
  createBirthRequest,
  createDeathRequest,         
  getAllRequests,
  getMyHouseholdRequests,
  getMyHouseholdPaymentRequests,
  reviewRequest,
} from "../controllers/requestController.js";
// SỬA: Import đúng middleware authorizePermission
import { protect, authorizePermission } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// --- KHU VỰC DÀNH CHO CƯ DÂN & NGƯỜI DÙNG ---
router.post("/update-info", protect, createUpdateRequest);
router.post("/payment", protect, createPaymentRequest); // Route mới cho nộp tiền
router.post("/temporary-residence", protect, createTemporaryResidenceRequest);
router.post("/temporary-absence", protect, createTemporaryAbsenceRequest);
router.post("/birth", protect, createBirthRequest);
router.post("/death", protect, createDeathRequest);
router.get("/my-household", protect, getMyHouseholdRequests);
router.get("/my-household/payments", protect, getMyHouseholdPaymentRequests);
// --- KHU VỰC DÀNH RIÊNG CHO TỔ TRƯỞNG ---

// Xem danh sách: Yêu cầu quyền READ REQUESTS LIST (đã define trong initialize.js)
router.get(
  "/",
  protect,
  authorizePermission("READ REQUESTS LIST"), 
  getAllRequests
);

// Duyệt đơn: Yêu cầu quyền APPROVE REQUEST
router.put(
  "/:id/review",
  protect,
  authorizePermission("APPROVE REQUEST"), 
  reviewRequest
);

export default router;
