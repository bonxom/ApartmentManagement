import express from "express";
import { 
  createFee, 
  getAllFees, 
  getFeeStatistics, 
  getMyHouseholdFees,
  updateFee, // Import mới
  deleteFee,  // Import mới
  getHouseholdFeesByAdmin
} from "../controllers/feeController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizePermission("CREATE FEE"), createFee);
router.get("/", protect, authorizePermission("VIEW FEES"), getAllFees);

// Route cho Cư dân (User)
router.get("/my-household", protect, getMyHouseholdFees);
// API Kế toán xem chi tiết 1 hộ (MỚI)
router.get(
    "/household/:householdId", 
    protect, 
    authorizePermission("CALCULATE FEE"), // Chỉ Kế toán/Tổ trưởng được xem
    getHouseholdFeesByAdmin
);

// Route thống kê
router.get("/:id/statistics", protect, authorizePermission("CALCULATE FEE"), getFeeStatistics);

// --- CÁC ROUTE CRUD MỚI ---
router.put("/:id", protect, authorizePermission("EDIT FEE"), updateFee);
router.delete("/:id", protect, authorizePermission("DELETE FEE"), deleteFee);

export default router;