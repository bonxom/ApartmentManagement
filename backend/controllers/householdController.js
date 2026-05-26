import Household from "../models/Household.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import ResidentHistory from "../models/ResidentHistory.js";
import Request from "../models/Request.js"; // Import thêm Request để lấy lịch sử Sinh/Tử
import { getHouseMemberRoleId, getMemberRoleId } from "../utils/roleUtils.js";
// import { autoAddToChat } from "../middleware/chatMiddleware.js";
// @desc    Tạo hộ khẩu mới
// @route   POST /api/households
export const createHousehold = async (req, res) => {
  const { houseHoldID, address, leaderId } = req.body;

  try {
    if (!houseHoldID || !address || !leaderId) {
      return res.status(400).json({ message: "Please provide household ID, address, and leader" });
    }

    if (await Household.findOne({ houseHoldID })) {
      return res.status(400).json({ message: "Household ID already exists" });
    }

    const leader = await User.findById(leaderId);
    if (!leader) {
      return res.status(404).json({ message: "Leader user not found" });
    }

    if (leader.household) {
      return res.status(400).json({ message: "Leader already belongs to another household" });
    }

    const household = await Household.create({
      houseHoldID,
      address,
      leader: leaderId,
      members: [leaderId], // Khởi tạo với chủ hộ là thành viên đầu tiên
    });
    const houseMemberRoleId = await getHouseMemberRoleId();
    await User.findByIdAndUpdate(leaderId, {
      household: household._id,
      relationshipWithHead: "Chủ hộ",
      role: houseMemberRoleId,
    });

    // Tự động thêm chủ hộ vào chat
    // try {
    //   await autoAddToChat(leaderId, "HOUSE_MEMBER");
    // } catch (chatError) {
    //   console.error("Error adding household leader to chat:", chatError);
    //   // Không throw error vì tạo household đã thành công
    // }

    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy tất cả hộ khẩu
// @route   GET /api/households
export const getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.find({})
      .populate("leader", "name email phoneNumber userCardID").sort({ createdAt: -1 }); 

    res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy 1 hộ khẩu bằng ID
// @route   GET /api/households/:id
export const getHouseholdById = async (req, res) => {
  try {
    const isOwnHousehold = req.user?.household?.toString() === req.params.id;
    const userPermissions = (req.user?.permissions || []).map(p => p.toUpperCase());
    const canViewAll = userPermissions.includes("VIEW HOUSEHOLD LIST");
    if (!isOwnHousehold && !canViewAll) {
      return res.status(403).json({ message: "You can only view your household" });
    }

    const household = await Household.findById(req.params.id)
      .populate("leader", "name email phoneNumber userCardID")

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách thành viên chi tiết của một hộ
// @route   GET /households/:id/users
export const getHouseholdResidents = async (req, res) => {
  try {
    const isOwnHousehold = req.user?.household?.toString() === req.params.id;
    const userPermissions = (req.user?.permissions || []).map(p => p.toUpperCase());
    const canViewAll = userPermissions.includes("VIEW HOUSEHOLD LIST");
    if (!isOwnHousehold && !canViewAll) {
      return res.status(403).json({ message: "You can only view members of your household" });
    }

    const household = await Household.findById(req.params.id).populate({
      path: "members",
      // Lấy các trường thông tin cá nhân cần thiết
      select: "name userCardID dob sex job relationshipWithHead birthLocation ethnic phoneNumber",
    });

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.status(200).json(household.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật hộ khẩu (địa chỉ, chủ hộ)
// @route   PUT /api/households/:id
export const updateHousehold = async (req, res) => {
  const { houseHoldID, address, leaderId } = req.body;
  try {
    const household = await Household.findById(req.params.id);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    const oldLeaderId = household.leader?.toString();

    // Update Mã hộ và Địa chỉ nếu có gửi lên
    if (houseHoldID) {
        if (houseHoldID !== household.houseHoldID) {
             const duplicate = await Household.findOne({ houseHoldID });
             if (duplicate) return res.status(400).json({ message: "Duplicate Household ID" });
        }
        household.houseHoldID = houseHoldID;
    }
    if (address) household.address = address;

    // Xử lý logic đổi chủ hộ
    if (leaderId && leaderId !== household.leader.toString()) {
      const houseMemberRoleId = await getHouseMemberRoleId();
      const newLeader = await User.findById(leaderId);
      if (!newLeader) return res.status(404).json({ message: "User not found" });

      if (
        newLeader.household &&
        newLeader.household.toString() !== household._id.toString()
      ) {
        return res.status(400).json({ message: "New leader belongs to another household" });
      }

      const oldLeaderId = household.leader;
      household.leader = leaderId;
      if (!household.members.includes(leaderId)) {
        household.members.push(leaderId);
      }

      await User.findByIdAndUpdate(oldLeaderId, { 
        relationshipWithHead: "member",
        role: houseMemberRoleId,
      });
      await User.findByIdAndUpdate(leaderId, { 
        household: household._id,
        relationshipWithHead: "household owner",
        role: houseMemberRoleId,
      });
    }

    const updatedHousehold = await household.save();

    // Nếu đổi leader, đảm bảo cả old và new leader đều có household reference đúng
    const newLeaderId = household.leader?.toString();
    if (oldLeaderId && newLeaderId && oldLeaderId !== newLeaderId) {
      // New leader đã được cập nhật bởi post-save hook
      // Nhưng ta cần đảm bảo old leader vẫn trong household (nếu còn là member)
      const isOldLeaderStillMember = household.members.some(
        (m) => m.toString() === oldLeaderId
      );
      if (!isOldLeaderStillMember) {
        const memberRoleId = await getMemberRoleId();
        await User.findByIdAndUpdate(oldLeaderId, {
          household: null,
          relationshipWithHead: null,
          role: memberRoleId,
        });
      }
    }

    const populatedHousehold = await Household.findById(req.params.id)
      .populate("leader", "name email userCardID")
      .populate("members", "name email userCardID");

    res.status(200).json(populatedHousehold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa hộ khẩu
// @route   DELETE /api/households/:id
export const deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const memberIds = [
      household.leader,
      ...(household.members || []),
    ].filter(Boolean);

    if (memberIds.length) {
      const memberRoleId = await getMemberRoleId();
      await User.updateMany(
        { _id: { $in: memberIds } },
        { $set: { household: null, relationshipWithHead: null, role: memberRoleId } }
      );
    }

    await household.deleteOne();
    res.status(200).json({ message: "Household deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thêm thành viên vào hộ
// @route   POST /api/households/:id/members
export const addMember = async (req, res) => {
  const { userId, relationship } = req.body;
  const householdId = req.params.id;

  try {
    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.household && user.household.toString() !== householdId) {
        return res.status(400).json({ message: "This user is already in another household" });
    }
    const alreadyMember = household.members.some(
      (member) => member?.toString() === userId
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a household member" });
    }

    household.members.push(userId);
    await household.save();

    user.household = householdId;
    user.relationshipWithHead = relationship || "Thành viên";
    user.role = await getHouseMemberRoleId();
    await user.save();
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa thành viên khỏi hộ
// @route   DELETE /api/households/:householdId/members/:memberId
export const removeMember = async (req, res) => {
  const { householdId, memberId } = req.params;

  try {
    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    // --- LOGIC MỚI: XỬ LÝ CHỦ HỘ ---
    if (household.leader.toString() === memberId) {
        // Kiểm tra xem có phải người cuối cùng không
        if (household.members.length === 1) {
            // CASE ĐẶC BIỆT: Hộ chỉ có 1 người (là chủ hộ) -> Xóa luôn hộ
            await household.deleteOne();

            const memberRoleId = await getMemberRoleId();
            // Cập nhật User về trạng thái tự do
            await User.findByIdAndUpdate(memberId, { 
                household: null,
                relationshipWithHead: null,
                role: memberRoleId,
            });

            return res.status(200).json({ 
                message: "Household deleted because the last member was removed" 
            });
        } else {
            // CASE THƯỜNG: Còn người khác -> Bắt chuyển quyền trước
            return res.status(400).json({ 
                message: "Cannot remove the household leader. Please assign a new leader first." 
            });
        }
    }

    // --- LOGIC THƯỜNG (KHÔNG PHẢI CHỦ HỘ) ---

    // Lọc (pull) thành viên ra khỏi mảng
    household.members.pull(memberId);
    await household.save();

    // Cập nhật User (Set về null)
    const memberRoleId = await getMemberRoleId();
    await User.findByIdAndUpdate(memberId, { 
        household: null,
        relationshipWithHead: null,
        role: memberRoleId,
    });

    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Lấy danh sách thành viên của hộ theo ID (lấy CCCD, tên, Quan hệ với chủ hộ, Ngày tháng năm sinh)
// @route  GET /api/households/:householdId/member-summaries
export const getHouseholdMemberSummaries = async (req, res) => {
  const { id } = req.params;
  try {
    const isOwnHousehold = req.user?.household?.toString() === id;
    const userPermissions = (req.user?.permissions || []).map((p) => p.toUpperCase());
    const canViewAll = userPermissions.includes("VIEW HOUSEHOLD LIST");
    if (!isOwnHousehold && !canViewAll) {
      return res.status(403).json({ message: "You can only view members of your household" });
    }

    const household = await Household.findById(id);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const members = await User.find({ _id: { $in: household.members } })
      .select("-password");
    res.status(200).json(members);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  } 
}

// @desc    Lấy thông tin chi tiết một thành viên trong hộ gia đình
// @route   GET /api/households/:householdId/member/:userId
export const getHouseholdMemberById = async (req, res) => {
  const { householdId, userId } = req.params;
  try {
    // Kiểm tra quyền: phải là thành viên của hộ đó hoặc có quyền VIEW HOUSEHOLD LIST
    const isOwnHousehold = req.user?.household?.toString() === householdId;
    const userPermissions = (req.user?.permissions || []).map((p) => p.toUpperCase());
    const canViewAll = userPermissions.includes("VIEW HOUSEHOLD LIST");
    
    if (!isOwnHousehold && !canViewAll) {
      return res.status(403).json({ message: "You can only view members of your household" });
    }

    // Kiểm tra household tồn tại
    const household = await Household.findById(householdId).populate("leader", "name");
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    // Kiểm tra user có phải là thành viên của household không
    const isMember = household.members.some(m => m.toString() === userId);
    if (!isMember) {
      return res.status(404).json({ message: "User is not a member of this household" });
    }

    // Lấy thông tin user
    const member = await User.findById(userId)
      .select("-password")
      .populate("household", "houseHoldID address leader");
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Tách hộ (Một thành viên ra ở riêng, lập hộ mới)
// @route   POST /api/households/split
export const splitHousehold = async (req, res) => {
  const { userId, newHouseHoldID, newAddress } = req.body;

  try {
    // 1. Kiểm tra dữ liệu đầu vào
    if (!userId || !newHouseHoldID || !newAddress) {
      return res.status(400).json({ message: "Please provide enough information" });
    }

    // 2. Kiểm tra trùng mã hộ mới
    const existingHousehold = await Household.findOne({ houseHoldID: newHouseHoldID });
    if (existingHousehold) {
      return res.status(400).json({ message: "New household ID has existed" });
    }

    // 3. Lấy thông tin User và Hộ cũ
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.household) {
      return res.status(400).json({ message: "This user doesn't have any household" });
    }

    const oldHousehold = await Household.findById(user.household);
    if (!oldHousehold) return res.status(404).json({ message: "Old household is not existed" });

    // 4. Validate: Chủ hộ KHÔNG ĐƯỢC tách hộ (phải đổi chủ trước)
    if (oldHousehold.leader.toString() === userId) {
      return res.status(400).json({ 
        message: "Can't split household for the household owner" 
      });
    }

    // --- BẮT ĐẦU TÁCH HỘ ---

    // 5. Rút tên khỏi hộ cũ
    oldHousehold.members.pull(userId);
    await oldHousehold.save();

    // 6. Tạo hộ mới (User này làm chủ hộ)
    const newHousehold = await Household.create({
      houseHoldID: newHouseHoldID,
      address: newAddress,
      leader: userId,
      members: [userId],
    });

    // 7. Cập nhật thông tin User
    user.household = newHousehold._id;
    user.relationshipWithHead = "household owner"; // Cập nhật thành chủ hộ
    user.role = await getHouseMemberRoleId();
    await user.save();

    res.status(201).json({
      message: "Split success",
      newHousehold,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Chuyển hộ (Chuyển thành viên từ hộ A sang hộ B)
// @route   POST /api/households/move
export const moveMember = async (req, res) => {
  const { userId, targetHouseholdId, relationship } = req.body;

  try {
    // 1. Kiểm tra đầu vào
    if (!userId || !targetHouseholdId || !relationship) {
      return res.status(400).json({ message: "Please provide neccessary info" });
    }

    // 2. Lấy thông tin
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.household) {
        return res.status(400).json({ message: "Can't find user's household" });
    }

    const targetHousehold = await Household.findById(targetHouseholdId);
    if (!targetHousehold) return res.status(404).json({ message: "Cannot find target household" });

    const oldHousehold = await Household.findById(user.household);
    if (!oldHousehold) {
      return res.status(404).json({ message: "User's current household record is missing" });
    }
    
    // Check nếu chuyển vào chính hộ đang ở
    if (oldHousehold._id.toString() === targetHouseholdId) {
        return res.status(400).json({ message: "This user is already in target household" });
    }

    // --- [LOGIC MỚI] XỬ LÝ CHỦ HỘ ---
    let shouldDeleteOldHousehold = false;

    if (oldHousehold && oldHousehold.leader.toString() === userId) {
      // Nếu là chủ hộ, kiểm tra xem có phải là người cuối cùng không
      if (oldHousehold.members.length === 1) {
          // Case đặc biệt: Chủ hộ độc thân -> Cho phép đi và sẽ xóa nhà cũ
          shouldDeleteOldHousehold = true;
      } else {
          // Case thường: Còn người khác -> Bắt buộc chuyển quyền trước
          return res.status(400).json({ 
            message: "Please assign another resident to be household owner" 
          });
      }
    }

    // --- BẮT ĐẦU CHUYỂN ---

    // 3. Xử lý Hộ cũ
    if (oldHousehold) {
        // Rút tên khỏi danh sách
        oldHousehold.members.pull(userId);
        
        if (shouldDeleteOldHousehold) {
            // Nếu là người cuối cùng -> Xóa luôn hộ cũ
            await oldHousehold.deleteOne();
        } else {
            // Nếu còn người -> Lưu lại danh sách mới
            await oldHousehold.save();
        }
    }

    // 4. Thêm vào Hộ mới
    const isAlreadyInTarget = targetHousehold.members.some(
      (member) => member?.toString() === userId
    );
    if (!isAlreadyInTarget) {
      targetHousehold.members.push(userId);
      await targetHousehold.save();
    }

    // 5. Cập nhật User
    user.household = targetHousehold._id;
    user.relationshipWithHead = relationship;
    user.role = await getHouseMemberRoleId();
    
    // Nếu chuyển sang nhà mới mà nhà mới chưa có chủ hộ (hiếm gặp nhưng cứ handle)
    // Hoặc đơn giản là thành viên thường
    await user.save();

    res.status(200).json({
      message: shouldDeleteOldHousehold 
        ? "Move success and delete old household (empty resident)" 
        : "Move success",
      user: {
          name: user.name,
          newHousehold: targetHousehold.houseHoldID
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Xem lịch sử biến động của 1 hộ (Sinh/Tử/Chuyển đi/Chuyển đến)
// @route GET /api/households/:id/changes
export const getHouseholdChanges = async (req, res) => {
    const { id } = req.params;
    try {
        const isOwnHousehold = req.user?.household?.toString() === id;
        const userPermissions = (req.user?.permissions || []).map(p => p.toUpperCase());
        const canViewAll = userPermissions.includes("VIEW HOUSEHOLD LIST");
        if (!isOwnHousehold && !canViewAll) {
            return res.status(403).json({ message: "You can only view changes for your household" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid household ID" });
        }
        const householdObjectId = new mongoose.Types.ObjectId(id);
        // 1. Lấy lịch sử tạm trú/vắng
        const resHistory = await ResidentHistory.findOne({ houseHoldId: householdObjectId })
            .populate("temporaryAbsent.user", "name");

        // 2. Lấy các Request đã duyệt liên quan đến hộ này (Sinh, Tử, Tách, Nhập)
        const requests = await Request.find({
            "requestData.householdId": householdObjectId, 
            status: "APPROVED"
        }).sort({ updatedAt: -1 });

        // 3. Tổng hợp lại
        const timeline = requests.map(req => ({
            date: req.updatedAt,
            type: req.type, // BIRTH_REPORT, DEATH_REPORT...
            description: req.type === 'BIRTH_REPORT' ? `Khai sinh cho bé ${req.requestData.name}` :
                         req.type === 'DEATH_REPORT' ? `Khai tử cho thành viên ID ${req.requestData.deceasedUserId}` :
                         req.type
        }));

        res.status(200).json({
            temporaryHistory: resHistory, // Chi tiết tạm trú/vắng
            majorChanges: timeline        // Biến động nhân khẩu
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc chỉnh sửa thông tin người tạm trú/vắng
// @route PUT /api/households/:id/resident-history
export const updateResidentHistory = async (req, res) => {
    const { id } = req.params;
    const { temporaryResidents, temporaryAbsents } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid household ID" });
        }
        const householdObjectId = new mongoose.Types.ObjectId(id);

        let resHistory = await ResidentHistory.findOne({ houseHoldId: householdObjectId });
        if (!resHistory) {
          return res.status(404).json({ message: "Resident history not found for this household" });
        }
        resHistory.temporaryResidents = temporaryResidents || resHistory.temporaryResidents;
        resHistory.temporaryAbsent = temporaryAbsents || resHistory.temporaryAbsent;

        await resHistory.save();
        res.status(200).json(resHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};    


// @desc Kết thúc tạm trú/tạm vắng
// @route PUT /api/households/:id/resident-history/complete
export const completeResidentHistory = async (req, res) => {
    const { id } = req.params;
    const { recordType, recordId } = req.body; // recordType: "temporaryResident" | "temporaryAbsent"
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid household ID" });
        }
        const householdObjectId = new mongoose.Types.ObjectId(id);

        let resHistory = await ResidentHistory.findOne({ houseHoldId: householdObjectId });
        if (!resHistory) {
          return res.status(404).json({ message: "Resident history not found for this household" });
        }

        switch (recordType) {
            case "temporaryResident":
                resHistory.temporaryResidents = resHistory.temporaryResidents.map(record => {
                    if (record._id.toString() === recordId) {
                        return { ...record.toObject(), isActive: false };
                    }
                    return record;
                });
                break;
            case "temporaryAbsent":
                resHistory.temporaryAbsent = resHistory.temporaryAbsent.map(record => {
                    if (record._id.toString() === recordId) {
                        return { ...record.toObject(), isActive: false };
                    }
                    return record;
                });
                break;
            default:
                return res.status(400).json({ message: "Invalid record type" });
        }

        await resHistory.save();
        res.status(200).json(resHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
