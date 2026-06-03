import express from "express";
import {
  createMaintenance,
  getAllMaintenances,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/maintenanceController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllMaintenances);
router.post("/", protect, authorizePermission("APPROVE REQUEST"), createMaintenance);
router.put("/:id", protect, authorizePermission("APPROVE REQUEST"), updateMaintenance);
router.delete("/:id", protect, authorizePermission("APPROVE REQUEST"), deleteMaintenance);

export default router;
