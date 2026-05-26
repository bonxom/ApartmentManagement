import express from "express";
import {
  getMessages,
  sendMessage,
  getChatParticipants,
  updateOnlineStatus,
  deleteMessage,
  initializeChatParticipants,
  syncAllUsersToChat,
//   addUserToChat,
//   removeUserFromChat,
  addCurrentAdminToChat,
  autoSyncAllUsers
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import ChatParticipant from "../models/ChatParticipant.js";
import Message from "../models/Message.js";
import Role from "../models/Role.js";

const router = express.Router();

// Route xóa tất cả tin nhắn (không cần auth - chỉ dùng để test)
router.delete("/clear-all-messages", async (req, res) => {
  try {
    const result = await Message.deleteMany({});
    
    res.status(200).json({ 
      message: `Đã xóa ${result.deletedCount} tin nhắn`,
      success: true,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Route fix tin nhắn có sender sai (không cần auth - chỉ dùng để debug)
router.post("/fix-message-sender", async (req, res) => {
  try {
    const { messageId, correctUserId } = req.body;
    
    if (!messageId || !correctUserId) {
      return res.status(400).json({ 
        message: 'Cần cung cấp messageId và correctUserId',
        success: false 
      });
    }
    
    // Tìm tin nhắn
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        message: 'Không tìm thấy tin nhắn',
        success: false 
      });
    }
    
    // Tìm user đúng
    const correctUser = await User.findById(correctUserId);
    if (!correctUser) {
      return res.status(404).json({ 
        message: 'Không tìm thấy user',
        success: false 
      });
    }
    
    const oldSender = message.sender;
    message.sender = correctUserId;
    await message.save();
    
    res.status(200).json({ 
      message: 'Đã sửa sender của tin nhắn thành công!',
      success: true,
      messageId: messageId,
      oldSender: oldSender,
      newSender: correctUserId,
      correctUserName: correctUser.name
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Route debug tin nhắn và users (không cần auth - chỉ dùng để debug)
router.get("/debug-messages", async (req, res) => {
  try {
    // Lấy tin nhắn gần đây nhất
    const messages = await Message.find({ isDeleted: false })
      .populate({
        path: "sender",
        select: "name email userCardID role",
        populate: {
          path: "role",
          select: "role_name"
        }
      })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Lấy tất cả users
    const users = await User.find().populate('role').select('name email userCardID role');
    
    res.status(200).json({
      message: "Debug thông tin tin nhắn và users",
      messages: messages.map(msg => ({
        _id: msg._id,
        content: msg.content,
        createdAt: msg.createdAt,
        sender: {
          _id: msg.sender?._id,
          name: msg.sender?.name,
          email: msg.sender?.email,
          role: msg.sender?.role?.role_name
        }
      })),
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        userCardID: user.userCardID,
        role: user.role?.role_name
      }))
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route sửa tên user cụ thể (không cần auth - chỉ dùng để fix)
router.post("/fix-user-name", async (req, res) => {
  try {
    const { email, newName } = req.body;
    
    if (!email || !newName) {
      return res.status(400).json({ 
        message: 'Cần cung cấp email và newName',
        success: false 
      });
    }
    
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.status(404).json({ 
        message: `Không tìm thấy user với email: ${email}`,
        success: false 
      });
    }
    
    const oldName = user.name;
    user.name = newName;
    await user.save();
    
    res.status(200).json({ 
      message: 'Đã sửa tên user thành công!',
      success: true,
      email: email,
      oldName: oldName,
      newName: newName
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Route thêm admin cụ thể vào chat bằng email (không cần auth - chỉ dùng 1 lần)
router.post("/force-add-admin", async (req, res) => {
  try {
    const { email = "admin@res.com" } = req.body;
    
    console.log(`🔍 Tìm admin với email: ${email}`);
    
    // Tìm user với email cụ thể
    const admin = await User.findOne({ email: email }).populate('role');
    
    if (!admin) {
      return res.status(404).json({ 
        message: `Không tìm thấy user với email: ${email}`,
        success: false 
      });
    }
    
    console.log(`👤 Tìm thấy user: ${admin.name} - Role: ${admin.role?.role_name}`);
    
    // Kiểm tra admin đã có trong chat chưa
    const existingParticipant = await ChatParticipant.findOne({ user: admin._id });
    
    if (existingParticipant) {
      return res.status(200).json({ 
        message: `User ${admin.name} đã có trong chat`,
        success: true,
        participant: existingParticipant,
        userInfo: {
          name: admin.name,
          email: admin.email,
          role: admin.role?.role_name
        }
      });
    }
    
    // Thêm user vào chat với role ADMIN (bất kể role gốc là gì)
    const newParticipant = await ChatParticipant.create({
      user: admin._id,
      role: 'ADMIN', // Force role ADMIN
      isActive: true,
      joinedAt: new Date(),
      lastSeen: new Date(),
      notificationSettings: {
        enabled: true,
        sound: true,
        desktop: true
      }
    });
    
    const totalParticipants = await ChatParticipant.countDocuments({ isActive: true });
    
    console.log(`✅ Đã thêm ${admin.name} vào chat với role ADMIN`);
    
    res.status(201).json({ 
      message: `Đã thêm ${admin.name} vào chat thành công!`,
      success: true,
      participant: newParticipant,
      totalParticipants,
      userInfo: {
        name: admin.name,
        email: admin.email,
        originalRole: admin.role?.role_name,
        chatRole: 'ADMIN'
      }
    });
    
  } catch (error) {
    console.error('❌ Lỗi force add admin:', error);
    res.status(500).json({ 
      message: 'Lỗi thêm admin: ' + error.message,
      success: false 
    });
  }
});

// Route khởi tạo admin vào chat tự động (không cần auth)
router.post("/init-admin", async (req, res) => {
  try {
    console.log('🚀 Khởi tạo admin vào chat...');
    
    // Tìm tất cả admin
    const adminRole = await Role.findOne({ role_name: "HAMLET LEADER" }).select("_id");
    const admins = adminRole
      ? await User.find({ role: adminRole._id }).populate("role")
      : [];
    
    if (admins.length === 0) {
      return res.status(404).json({ 
        message: 'Không tìm thấy admin nào trong hệ thống',
        success: false 
      });
    }
    
    let addedCount = 0;
    const results = [];
    
    for (const admin of admins) {
      try {
        // Kiểm tra admin đã có trong chat chưa
        const existingParticipant = await ChatParticipant.findOne({ user: admin._id });
        
        if (existingParticipant) {
          results.push(`ℹ️ Admin ${admin.name} đã có trong chat`);
          console.log(`ℹ️ Admin ${admin.name} đã có trong chat`);
        } else {
          // Thêm admin vào chat
          await ChatParticipant.create({
            user: admin._id,
            role: 'ADMIN',
            isActive: true,
            joinedAt: new Date(),
            lastSeen: new Date(),
            notificationSettings: {
              enabled: true,
              sound: true,
              desktop: true
            }
          });
          
          addedCount++;
          results.push(`✅ Đã thêm admin ${admin.name} (${admin.email}) vào chat`);
          console.log(`✅ Đã thêm admin ${admin.name} vào chat`);
        }
      } catch (error) {
        results.push(`❌ Lỗi thêm admin ${admin.name}: ${error.message}`);
        console.error(`❌ Lỗi thêm admin ${admin.name}:`, error);
      }
    }
    
    const totalParticipants = await ChatParticipant.countDocuments({ isActive: true });
    
    res.status(200).json({
      message: `Khởi tạo admin thành công! Đã thêm ${addedCount} admin vào chat.`,
      success: true,
      addedCount,
      totalParticipants,
      adminsFound: admins.length,
      results
    });
    
  } catch (error) {
    console.error('❌ Lỗi khởi tạo admin:', error);
    res.status(500).json({ 
      message: 'Lỗi khởi tạo admin: ' + error.message,
      success: false 
    });
  }
});

// Route sửa tên admin (không cần auth - chỉ dùng để fix)
router.post("/fix-admin-name", async (req, res) => {
  try {
    const { newName = "Admin Tổ Trưởng" } = req.body;
    
    const admin = await User.findOne({ email: 'admin@res.com' });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin không tồn tại' });
    }
    
    const oldName = admin.name;
    admin.name = newName;
    await admin.save();
    
    res.status(200).json({ 
      message: 'Đã sửa tên admin thành công!',
      success: true,
      oldName: oldName,
      newName: newName
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Route thêm admin thủ công (không cần auth - chỉ dùng để fix)
router.post("/manual-add-admin", async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@res.com' }).populate('role');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin không tồn tại' });
    }
    
    const existingParticipant = await ChatParticipant.findOne({ user: admin._id });
    
    if (existingParticipant) {
      return res.status(200).json({ 
        message: 'Admin đã có trong chat',
        success: true,
        participant: existingParticipant 
      });
    }
    
    const newParticipant = await ChatParticipant.create({
      user: admin._id,
      role: 'ADMIN',
      isActive: true,
      joinedAt: new Date(),
      lastSeen: new Date()
    });
    
    res.status(201).json({ 
      message: 'Đã thêm admin vào chat thành công!',
      success: true,
      participant: newParticipant 
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Route auto-sync không cần auth (chỉ dùng để setup)
router.post("/auto-sync", autoSyncAllUsers);

// Tất cả routes khác đều cần authentication
router.use(protect);

// Routes cho tin nhắn
router.get("/messages", getMessages);
router.post("/messages", sendMessage);
router.delete("/messages/:id", deleteMessage);

// Routes cho participants
router.get("/participants", getChatParticipants);
router.put("/status", updateOnlineStatus);

// Route khởi tạo (chỉ admin)
router.post("/initialize", initializeChatParticipants);

// Route đồng bộ tất cả users hiện có (chỉ admin)
router.post("/sync-all", syncAllUsersToChat);

// Route thêm admin hiện tại vào chat (chỉ admin)
router.post("/add-me", addCurrentAdminToChat);

export default router;
