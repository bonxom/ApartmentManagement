import { Router } from "express";
import { 
  createRole, 
  deleteRole, 
  getAllRoles, 
  getRole, 
  updateRole,
  getRolePermissions,
  updateRolePermissions
} from "../controllers/roleController.js";
import { protect, authorize, authorizePermission } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, authorize("HAMLET LEADER"), createRole);
router.get("/", protect, authorize("HAMLET LEADER"), getAllRoles);
router.get("/:id", protect, authorize("HAMLET LEADER"), getRole);
router.put("/:id", protect, authorize("HAMLET LEADER"), updateRole);
router.delete("/:id", protect, authorize("HAMLET LEADER"), deleteRole);
router.get("/:id/permissions", protect, authorize("HAMLET LEADER"), getRolePermissions);
router.put("/:id/permissions", protect, authorize("HAMLET LEADER"), updateRolePermissions);

export default router;
