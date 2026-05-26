import ChatParticipant from "../models/ChatParticipant.js";
import Household from "../models/Household.js";

// Middleware tự động thêm user vào chat khi tạo mới hoặc cập nhật role
export const autoAddToChat = async (userId, userRole) => {
  try {
    // Kiểm tra user đã có trong chat chưa
    const existingParticipant = await ChatParticipant.findOne({ user: userId });
    if (existingParticipant) {
      return { success: true, message: "User đã có trong chat" };
    }

    let chatRole = null;
    
    // Xác định role trong chat
    if (userRole === "HAMLET LEADER") {
      chatRole = "ADMIN";
    } else if (userRole === "ACCOUNTANT") {
      chatRole = "ACCOUNTANT";
    } else {
      // Kiểm tra xem user có phải chủ hộ không
      const household = await Household.findOne({ leader: userId });
      if (household) {
        chatRole = "HOUSEHOLD_LEADER";
      }
    }

    // Chỉ thêm vào chat nếu có role phù hợp
    if (chatRole) {
      await ChatParticipant.create({
        user: userId,
        role: chatRole,
        isActive: true,
        joinedAt: new Date()
      });
      
      console.log(`✅ Auto added user ${userId} to chat with role ${chatRole}`);
      return { success: true, message: `Đã thêm user vào chat với role ${chatRole}` };
    }

    return { success: false, message: "User không có quyền tham gia chat" };
  } catch (error) {
    console.error("❌ Error auto adding user to chat:", error);
    return { success: false, message: error.message };
  }
};

// Middleware tự động xóa user khỏi chat khi thay đổi role không phù hợp
export const autoRemoveFromChat = async (userId) => {
  try {
    const result = await ChatParticipant.findOneAndDelete({ user: userId });
    if (result) {
      console.log(`✅ Auto removed user ${userId} from chat`);
      return { success: true, message: "Đã xóa user khỏi chat" };
    }
    return { success: true, message: "User không có trong chat" };
  } catch (error) {
    console.error("❌ Error auto removing user from chat:", error);
    return { success: false, message: error.message };
  }
};