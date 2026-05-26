import Fee from "../models/Fee.js";
import Household from "../models/Household.js";
import Transaction from "../models/Transaction.js";

// @desc    Tạo khoản thu mới
// @route   POST /api/fees
export const createFee = async (req, res) => {
  try {
    const { name, type, description, unitPrice } = req.body;

    // Validate: Nếu là phí bắt buộc thì phải có đơn giá
    if (type === "MANDATORY" && (!unitPrice || unitPrice < 0)) {
      return res.status(400).json({ message: "This mandatory fee should have unit price" });
    }

    const fee = await Fee.create({ name, type, description, unitPrice });
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách khoản thu
// @route   GET /api/fees
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find({}).sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xem báo cáo tình hình thu (Quan trọng nhất)
// @route   GET /api/fees/:id/statistics
export const getFeeStatistics = async (req, res) => {
  const { id } = req.params; // ID khoản thu

  try {
    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    // 1. Lấy danh sách tất cả hộ khẩu và thành viên hiện tại
    // (Logic Q1: Căn cứ số nhân khẩu hiện tại)
    const households = await Household.find({}).populate("members", "_id");

    // 2. Lấy tất cả giao dịch đã nộp cho khoản này
    const transactions = await Transaction.find({ fee: id });

    // 3. Tính toán từng hộ
    let totalExpected = 0; 
    let totalCollected = 0;

    const householdStats = households.map((h) => {
      // Tổng tiền hộ này đã nộp (cộng dồn các lần nộp lẻ tẻ - Logic Q2)
      const paidTrans = transactions.filter(t => t.household.toString() === h._id.toString());
      const paidAmount = paidTrans.reduce((sum, t) => sum + t.amount, 0);
      
      let requiredAmount = 0;
      let status = "COMPLETED"; 

      if (fee.type === "MANDATORY") {
        // --- LOGIC TÍNH TIỀN: 6000 * 12 * Số người hiện tại ---
        const currentMemberCount = h.members.length;
        const months = 12; // Mặc định thu theo năm như slide
        requiredAmount = fee.unitPrice * months * currentMemberCount;
        
        // Xác định trạng thái đóng
        if (paidAmount === 0) status = "UNPAID"; // Chưa đóng
        else if (paidAmount < requiredAmount) status = "PARTIAL"; // Đóng thiếu
        else status = "COMPLETED"; // Đủ
        
        totalExpected += requiredAmount;
      } else {
        // Phí tự nguyện: Không có định mức
        requiredAmount = 0;
        status = paidAmount > 0 ? "CONTRIBUTED" : "NO_CONTRIBUTION";
      }

      totalCollected += paidAmount;

      return {
        household_id: h._id,
        household_code: h.houseHoldID,
        address: h.address,
        member_count: h.members.length,
        required: requiredAmount,
        paid: paidAmount,
        remaining: fee.type === "MANDATORY" ? (requiredAmount - paidAmount) : 0,
        status: status,
      };
    });

    res.status(200).json({
      fee_info: fee,
      summary: {
        total_households: households.length,
        total_expected: totalExpected,
        total_collected: totalCollected,
      },
      details: householdStats // Danh sách chi tiết từng hộ để hiển thị bảng
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin khoản thu (Tên, mô tả, trạng thái)
// @route   PUT /api/fees/:id
export const updateFee = async (req, res) => {
  try {
    const { name, description, status, unitPrice } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ message: "Khoản thu không tồn tại" });
    }

    // Cập nhật các trường nếu có gửi lên
    if (name) fee.name = name;
    if (description) fee.description = description;
    if (status) fee.status = status; // Ví dụ: Đóng đợt thu (COMPLETED)
    
    // Lưu ý: Nếu cập nhật unitPrice cho phí bắt buộc, cần cân nhắc kỹ
    // vì nó sẽ ảnh hưởng đến báo cáo của những người chưa đóng.
    if (unitPrice !== undefined && fee.type === "MANDATORY") {
        fee.unitPrice = unitPrice;
    }

    const updatedFee = await fee.save();
    res.status(200).json(updatedFee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa khoản thu
// @route   DELETE /api/fees/:id
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ message: "Khoản thu không tồn tại" });
    }

    // --- RÀNG BUỘC DỮ LIỆU ---
    // Kiểm tra xem đã có ai đóng tiền cho khoản này chưa
    const hasTransactions = await Transaction.findOne({ fee: req.params.id });
    if (hasTransactions) {
      return res.status(400).json({ 
        message: "Không thể xóa khoản thu này vì đã phát sinh giao dịch nộp tiền. Hãy chuyển trạng thái sang 'COMPLETED' thay vì xóa." 
      });
    }

    await fee.deleteOne();
    res.status(200).json({ message: "Đã xóa khoản thu thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xem công nợ của hộ mình (Dành cho Cư dân/Chủ hộ)
// @route   GET /api/fees/my-household
export const getMyHouseholdFees = async (req, res) => {
  try {
    const user = req.user;
    if (!user.household) {
      return res.status(400).json({ message: "Bạn chưa thuộc hộ khẩu nào." });
    }

    // 1. Lấy thông tin Hộ khẩu để biết số lượng thành viên
    // (Cần thiết để tính phí theo đầu người)
    const household = await Household.findById(user.household);
    if (!household) {
        return res.status(404).json({ message: "Không tìm thấy thông tin hộ khẩu." });
    }
    const memberCount = household.members.length;

    // 2. Lấy tất cả khoản thu đang ACTIVE
    const activeFees = await Fee.find({ status: "ACTIVE" });
    
    // 3. Lấy các giao dịch nhà này đã đóng
    const myTransactions = await Transaction.find({ household: user.household });

    // 4. Tính toán từng khoản
    const result = activeFees.map(fee => {
      // Tổng tiền đã nộp cho khoản này
      const paidTrans = myTransactions.filter(t => t.fee.toString() === fee._id.toString());
      const paidAmount = paidTrans.reduce((sum, t) => sum + t.amount, 0);
      
      let required = 0;
      let status = "UNPAID"; // Mặc định là chưa đóng

      if (fee.type === "MANDATORY") {
        // --- LOGIC TÍNH TOÁN ĐÃ HOÀN THIỆN ---
        // Công thức: Đơn giá * 12 tháng * Số nhân khẩu
        const months = 12; 
        required = fee.unitPrice * months * memberCount;
        
        // Xác định trạng thái
        if (paidAmount === 0) {
            status = "UNPAID";
        } else if (paidAmount < required) {
            status = "PARTIAL"; // Đóng thiếu
        } else {
            status = "COMPLETED"; // Đóng đủ
        }

      } else {
        // Với phí tự nguyện
        required = 0;
        status = paidAmount > 0 ? "CONTRIBUTED" : "NO_CONTRIBUTION";
      }

      // Tính số tiền còn nợ (không âm)
      const remaining = required > paidAmount ? required - paidAmount : 0;

      return {
        feeId: fee._id,
        name: fee.name,
        type: fee.type,
        description: fee.description,
        unitPrice: fee.unitPrice,
        memberCount: memberCount, // Trả về để frontend hiển thị giải trình tính phí
        requiredAmount: required,
        paidAmount: paidAmount,
        remainingAmount: remaining,
        status: status,
        lastPaymentDate: paidTrans.length > 0 ? paidTrans[0].createdAt : null
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xem công nợ của một hộ cụ thể (Dành cho Kế toán/Tổ trưởng tra cứu)
// @route   GET /api/fees/household/:householdId
export const getHouseholdFeesByAdmin = async (req, res) => {
  const { householdId } = req.params;

  try {
    // 1. Kiểm tra hộ khẩu tồn tại không
    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({ message: "Hộ khẩu không tồn tại" });
    }
    const memberCount = household.members.length;

    // 2. Lấy tất cả khoản thu đang ACTIVE
    const activeFees = await Fee.find({ status: "ACTIVE" });
    
    // 3. Lấy các giao dịch hộ này đã đóng
    const myTransactions = await Transaction.find({ household: householdId });

    // 4. Tính toán từng khoản
    const result = activeFees.map(fee => {
      const paidTrans = myTransactions.filter(t => t.fee.toString() === fee._id.toString());
      const paidAmount = paidTrans.reduce((sum, t) => sum + t.amount, 0);
      
      let required = 0;
      let status = "UNPAID";

      if (fee.type === "MANDATORY") {
        const months = 12; 
        required = fee.unitPrice * months * memberCount;
        
        if (paidAmount === 0) status = "UNPAID";
        else if (paidAmount < required) status = "PARTIAL";
        else status = "COMPLETED";
      } else {
        required = 0;
        status = paidAmount > 0 ? "CONTRIBUTED" : "NO_CONTRIBUTION";
      }

      const remaining = required > paidAmount ? required - paidAmount : 0;

      return {
        feeId: fee._id,
        name: fee.name,
        type: fee.type,
        unitPrice: fee.unitPrice,
        memberCount: memberCount,
        requiredAmount: required,
        paidAmount: paidAmount,
        remainingAmount: remaining,
        status: status,
      };
    });

    res.status(200).json({
        household: {
            id: household._id,
            name: household.houseHoldID,
            address: household.address,
            leader: household.leader // Có thể populate thêm tên chủ hộ nếu cần
        },
        fees: result
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};