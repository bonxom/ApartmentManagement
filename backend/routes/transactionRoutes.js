import express from "express";
import { 
  createTransaction, 
  getTransactions, 
  updateTransaction, // Nhớ import hàm này
  deleteTransaction  // Nhớ import hàm này
} from "../controllers/transactionController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizePermission("RECORD PAYMENT"), createTransaction);
router.get("/", protect, authorizePermission("VIEW FEES"), getTransactions);

// --- BỔ SUNG 2 DÒNG NÀY ---
router.put("/:id", protect, authorizePermission("RECORD PAYMENT"), updateTransaction);
router.delete("/:id", protect, authorizePermission("RECORD PAYMENT"), deleteTransaction);

export default router;
