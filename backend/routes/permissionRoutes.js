import { Router } from "express";
import { createPermission, deletePermission, getAllPermission, getPermission, updatePermission } from "../controllers/permissionController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, authorizePermission("CREATE PERMISSION"), createPermission);
router.get("/", protect, authorizePermission("VIEW PERMISSIONS"), getAllPermission);
router.get("/:id", protect, authorizePermission("VIEW PERMISSIONS"), getPermission);
router.put("/:id", protect, authorizePermission("EDIT PERMISSION"), updatePermission);
router.delete("/:id", protect, authorizePermission("DELETE PERMISSION"), deletePermission);

export default router;
