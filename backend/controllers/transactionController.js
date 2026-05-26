import Transaction from "../models/Transaction.js";
import Fee from "../models/Fee.js";
import Household from "../models/Household.js";

// @desc    Ghi nhận nộp tiền
// @route   POST /api/transactions
export const createTransaction = async (req, res) => {
  const { feeId, householdId, amount, note } = req.body;

  try {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee not found" });
    if (fee.status === "COMPLETED") {
       return res.status(400).json({ message: "This fee collection is closed" });
    }

    const household = await Household.findById(householdId);
    if (!household) return res.status(404).json({ message: "Household not found" });

    // Logic Q3: Mặc định người nộp là Chủ hộ
    const payerId = household.leader;

    const transaction = await Transaction.create({
      fee: feeId,
      household: householdId,
      payer: payerId, 
      amount: parsedAmount,
      note,
      status: "VERIFIED",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xem lịch sử giao dịch
// @route   GET /api/transactions
export const getTransactions = async (req, res) => {
    // Có thể lọc theo Hộ hoặc theo Đợt thu
    const { feeId, householdId } = req.query;
    const filter = {};
    if (feeId) filter.fee = feeId;
    if (householdId) filter.household = householdId;

    try {
        const transactions = await Transaction.find(filter)
            .populate("fee", "name type")
            .populate("household", "houseHoldID address")
            .populate("payer", "name") // Hiện tên chủ hộ nộp tiền
            .sort({ createdAt: -1 });
        
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Sửa giao dịch (Ví dụ: Nhập sai số tiền hoặc ghi chú)
// @route   PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const { amount, note } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Giao dịch không tồn tại" });
    }

    // Cho phép sửa tiền và ghi chú
    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
      }
      transaction.amount = parsedAmount;
    }
    if (note) transaction.note = note;

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa giao dịch (Hủy phiếu thu)
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Giao dịch không tồn tại" });
    }

    // Có thể thêm logic: Chỉ cho phép xóa giao dịch mới tạo trong vòng 24h
    // Hoặc chỉ Admin mới được xóa. Ở đây ta dùng Middleware authorizePermission để chặn.

    await transaction.deleteOne();
    res.status(200).json({ message: "Đã xóa giao dịch thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
