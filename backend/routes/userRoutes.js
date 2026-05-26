import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  getMyHousehold
} from "../controllers/userController.js";
import { protect, authorize, authorizePermission } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", protect, authorizePermission("CREATE USER"), createUser);
router.get("/", protect, authorizePermission("VIEW USER LIST"), getAllUsers);
// Route cụ thể phải đặt trước route có param
router.get("/me/household", protect, getMyHousehold);
router.get("/:id", protect, authorizePermission("VIEW USER"), getUserById);
router.put("/:id", protect, authorizePermission("EDIT USER"), updateUser);
router.delete("/:id", protect, authorizePermission("DELETE USER"), deleteUser);
router.patch("/:id/password", protect, (req, res, next) => {
  if (req.user?._id?.toString() === req.params.id) {
    return changePassword(req, res, next);
  }
  return authorizePermission("RESET USER PASSWORD")(req, res, () => changePassword(req, res, next));
});

export default router;
