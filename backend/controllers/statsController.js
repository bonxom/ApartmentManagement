import User from "../models/User.js";
import Household from "../models/Household.js";
import Transaction from "../models/Transaction.js";
import Fee from "../models/Fee.js";
import Request from "../models/Request.js";

// @desc    Lấy số liệu tổng quan cho Dashboard (Admin/Leader)
// @route   GET /api/stats/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Kiểm tra permission của user
    const userPermissions = (req.user?.permissions || []).map((p) => p.toUpperCase());
    const canViewFeeStats = userPermissions.includes("VIEW FEE STATS");
    const canViewBasicStats = userPermissions.includes("VIEW BASIC STATS");

    // Nếu user không có permission nào thì từ chối
    if (!canViewFeeStats && !canViewBasicStats) {
      return res.status(403).json({ 
        message: "You don't have permission to view dashboard statistics" 
      });
    }

    // 1. Đếm nhân khẩu
    const totalUsers = await User.countDocuments({ status: "VERIFIED" });
    
    // 2. Đếm hộ khẩu
    const totalHouseholds = await Household.countDocuments({});

    // 3. Thống kê nhanh: Nam/Nữ (Vẽ biểu đồ tròn)
    const males = await User.countDocuments({ sex: "Nam" });
    const females = await User.countDocuments({ sex: "Nữ" });

    const response = {
      demographics: {
        total_users: totalUsers,
        total_households: totalHouseholds,
        gender: { male: males, female: females }
      }
    };

    // Chỉ hiển thị thông tin tài chính nếu có permission VIEW FEE STATS
    if (canViewFeeStats) {
      // 4. Tổng tiền đã thu (Tất cả các đợt)
      const allTransactions = await Transaction.find({});
      const totalRevenue = allTransactions.reduce((sum, t) => sum + t.amount, 0);

      // 5. Đếm khoản thu đang mở
      const activeFees = await Fee.countDocuments({ status: "ACTIVE" });

      // 6. Tính tổng tiền phải thu và đã thu cho các khoản ACTIVE
      const activeFeeList = await Fee.find({ status: "ACTIVE" });
      const activeFeeIdList = activeFeeList.map(f => f._id);
      
      // Tổng tiền đã thu cho các khoản đang ACTIVE
      const activeTransactions = await Transaction.find({
        fee: { $in: activeFeeIdList }
      });
      const totalPaidForActiveFees = activeTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Tính tổng tiền phải thu (chỉ cho phí bắt buộc)
      let totalRequiredAmount = 0;
      for (const fee of activeFeeList) {
        if (fee.type === "MANDATORY") {
          const months = 12; // Giả sử thu theo năm
          // Lấy số thành viên của tất cả các hộ
          const allHouseholds = await Household.find({}).populate('members');
          for (const household of allHouseholds) {
            const memberCount = household.members?.length || 0;
            totalRequiredAmount += fee.unitPrice * months * memberCount;
          }
        }
      }
      
      const totalUnpaid = totalRequiredAmount > totalPaidForActiveFees 
        ? totalRequiredAmount - totalPaidForActiveFees 
        : 0;

      response.financial = {
        total_revenue: totalRevenue,
        active_campaigns: activeFees,
        payment_status: {
          paid_amount: totalPaidForActiveFees,
          unpaid_amount: totalUnpaid,
          total_required: totalRequiredAmount
        }
      };
    } else {
      // User thường chỉ thấy thông tin cơ bản
      response.financial = {
        total_revenue: 0,
        active_campaigns: 0,
        payment_status: {
          paid_amount: 0,
          unpaid_amount: 0,
          total_required: 0
        }
      };
    }

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thống kê Dashboard cho User (về hộ gia đình của họ)
// @route   GET /api/stats/user-dashboard
export const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userHouseholdId = req.user.household;

    // Kiểm tra user có thuộc hộ nào không
    if (!userHouseholdId) {
      return res.status(400).json({ 
        message: "Bạn chưa thuộc hộ gia đình nào"
      });
    }

    // Lấy thông tin hộ gia đình
    const household = await Household.findById(userHouseholdId)
      .populate('leader', 'name userCardID')
      .populate('members', '_id name');

    if (!household) {
      return res.status(404).json({ message: "Không tìm thấy hộ gia đình" });
    }

    // 1. Thông tin hộ gia đình
    const householdInfo = {
      householdId: household.houseHoldID,
      address: household.address,
      leaderName: household.leader?.name || 'N/A'
    };

    // 2. Số thành viên
    const memberCount = household.members?.length || 0;

    // 3. Lấy tất cả khoản thu đang ACTIVE
    const activeFees = await Fee.find({ status: 'ACTIVE' });

    // 4. Lấy các giao dịch đã VERIFIED của hộ này
    const paidTransactions = await Transaction.find({
      household: userHouseholdId,
      $or: [{ status: "VERIFIED" }, { status: { $exists: false } }],
    });

    // 5. Tính toán chi tiết từng khoản thu (giống getUnpaidAndPaidFees)
    const unpaidFees = [];
    const paidFees = [];
    let totalAmountDue = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;

    activeFees.forEach(fee => {
      const isMandatory = fee.type === "MANDATORY";
      const paidTrans = paidTransactions.filter(t => t.fee.toString() === fee._id.toString());
      const paidAmount = paidTrans.reduce((sum, t) => sum + t.amount, 0);
      
      let requiredAmount = 0;
      let status = "UNPAID";

      if (isMandatory) {
        const months = 12;
        requiredAmount = fee.unitPrice * months * memberCount;
        
        if (paidAmount === 0) {
          status = "UNPAID";
        } else if (paidAmount < requiredAmount) {
          status = "PARTIAL";
        } else {
          status = "COMPLETED";
        }
      } else {
        // Phí tự nguyện
        requiredAmount = 0;
        status = paidAmount > 0 ? "CONTRIBUTED" : "NO_CONTRIBUTION";
      }

      const remaining = requiredAmount > paidAmount ? requiredAmount - paidAmount : 0;

      const feeDetail = {
        feeId: fee._id,
        name: fee.name,
        type: fee.type,
        description: fee.description,
        unitPrice: fee.unitPrice,
        memberCount: memberCount,
        requiredAmount: requiredAmount,
        paidAmount: paidAmount,
        remainingAmount: remaining,
        remaining: remaining,
        status: status,
        lastPaymentDate: paidTrans.length > 0 ? paidTrans[paidTrans.length - 1].createdAt : null
      };
      
      if (isMandatory) {
        totalAmountDue += requiredAmount;
        totalPaid += paidAmount;
      }
      
      // Phân loại
      if (remaining > 0) {
        unpaidFees.push(feeDetail);
        if (isMandatory) {
          totalUnpaid += remaining;
        }
      }
      
      if (paidAmount > 0) {
        paidFees.push(feeDetail);
      }
    });

    // 6. Số yêu cầu chờ duyệt của user này
    const pendingRequests = await Request.countDocuments({
      requester: userId,
      status: "PENDING",
    });

    // 7. Thống kê thanh toán cho biểu đồ
    const paymentStats = {
      paid: totalPaid,
      unpaid: totalUnpaid,
      total: totalAmountDue
    };

    res.status(200).json({
      household: householdInfo,
      members: memberCount,
      finance: {
        total_due: totalAmountDue,
        total_paid: totalPaid,
        total_unpaid: totalUnpaid
      },
      pending_requests: pendingRequests,
      payment_stats: paymentStats,
      fees_detail: {
        unpaidFees: unpaidFees,
        paidFees: paidFees
      }
    });

  } catch (error) {
    console.error('❌ Error in getUserDashboardStats:', error);
    res.status(500).json({ message: error.message });
  }
};
