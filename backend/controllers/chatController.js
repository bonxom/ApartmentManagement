import Message from "../models/Message.js";
import ChatParticipant from "../models/ChatParticipant.js";
import User from "../models/User.js";
import Household from "../models/Household.js";
import Role from "../models/Role.js";

const getUsersByRoleName = async (roleName) => {
  const normalizedRole = roleName?.toUpperCase();
  const role = await Role.findOne({ role_name: normalizedRole }).select("_id");
  if (!role) {
    return [];
  }
  return User.find({ role: role._id }).populate("role");
};

// @desc    Lấy danh sách tin nhắn
// @route   GET /api/chat/messages
export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Kiểm tra user có quyền tham gia chat không
    const participant = await ChatParticipant.findOne({ 
      user: req.user._id, 
      isActive: true 
    });

    if (!participant) {
      return res.status(403).json({ 
        message: "Bạn không có quyền truy cập chat này" 
      });
    }

    const messages = await Message.find({ isDeleted: false })
      .populate({
        path: "sender",
        select: "name email userCardID role",
        populate: {
          path: "role",
          select: "role_name"
        }
      })
      .populate({
        path: "replyTo",
        select: "content sender createdAt",
        populate: {
          path: "sender",
          select: "name"
        }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    console.log("🔍 GET MESSAGES DEBUG:");
    console.log("- Requesting user:", req.user.name, req.user.email);
    console.log("- Found messages:", messages.length);
    if (messages.length > 0) {
      const latestMessage = messages[0];
      console.log("- Latest message sender:", latestMessage.sender?.name, latestMessage.sender?.email);
      console.log("- Latest message content:", latestMessage.content);
    }

    // Đánh dấu tin nhắn đã đọc
    const unreadMessages = messages.filter(msg => 
      !msg.isRead.some(read => read.user.toString() === req.user._id.toString())
    );

    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map(msg => 
          Message.findByIdAndUpdate(msg._id, {
            $addToSet: {
              isRead: {
                user: req.user._id,
                readAt: new Date()
              }
            }
          })
        )
      );
    }

    res.status(200).json({
      messages: messages.reverse(), // Đảo ngược để tin nhắn cũ ở trên
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(await Message.countDocuments({ isDeleted: false }) / limit),
        hasMore: messages.length === parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Gửi tin nhắn mới
// @route   POST /api/chat/messages
export const sendMessage = async (req, res) => {
  try {
    const { content, messageType = "text", replyTo, fileUrl, fileName } = req.body;

    // Kiểm tra user có quyền tham gia chat không
    const participant = await ChatParticipant.findOne({ 
      user: req.user._id, 
      isActive: true 
    });

    if (!participant) {
      return res.status(403).json({ 
        message: "Bạn không có quyền gửi tin nhắn" 
      });
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        message: "Nội dung tin nhắn không được để trống" 
      });
    }

    console.log("🔍 SEND MESSAGE DEBUG:");
    console.log("- User from token:", req.user._id, req.user.name, req.user.email);
    console.log("- Content:", content.trim());

    // Tạo tin nhắn mới với sender chính xác từ req.user
    const message = await Message.create({
      sender: req.user._id, // Đảm bảo dùng đúng user ID từ token
      content: content.trim(),
      messageType,
      fileUrl,
      fileName,
      replyTo: replyTo || null,
      isRead: [{
        user: req.user._id,
        readAt: new Date()
      }]
    });

    console.log("✅ Message created with sender:", message.sender);

    // Populate thông tin sender - QUAN TRỌNG: Phải populate đúng
    await message.populate({
      path: "sender",
      select: "name email userCardID role",
      populate: {
        path: "role",
        select: "role_name"
      }
    });

    console.log("📤 Populated sender info:", message.sender?.name, message.sender?.email);

    if (replyTo) {
      await message.populate({
        path: "replyTo",
        select: "content sender createdAt",
        populate: {
          path: "sender",
          select: "name"
        }
      });
    }

    // Đảm bảo response có đúng thông tin sender
    const responseMessage = {
      _id: message._id,
      content: message.content,
      messageType: message.messageType,
      sender: {
        _id: message.sender._id,
        name: message.sender.name,
        email: message.sender.email,
        role: message.sender.role
      },
      replyTo: message.replyTo,
      isRead: message.isRead,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };

    console.log("🚀 Sending response with sender:", responseMessage.sender.name);

    res.status(201).json(responseMessage);
  } catch (error) {
    console.error("❌ Send message error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách người tham gia chat
// @route   GET /api/chat/participants
export const getChatParticipants = async (req, res) => {
  try {
    const participants = await ChatParticipant.find({ isActive: true })
      .populate({
        path: "user",
        select: "name email userCardID role household",
        populate: [
          {
            path: "role",
            select: "role_name"
          },
          {
            path: "household",
            select: "houseHoldID address"
          }
        ]
      })
      .sort({ lastSeen: -1 });

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật trạng thái online
// @route   PUT /api/chat/status
export const updateOnlineStatus = async (req, res) => {
  try {
    await ChatParticipant.findOneAndUpdate(
      { user: req.user._id },
      { lastSeen: new Date() },
      { upsert: true }
    );

    res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa tin nhắn
// @route   DELETE /api/chat/messages/:id
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Tin nhắn không tồn tại" });
    }

    // Chỉ cho phép xóa tin nhắn của chính mình hoặc admin
    if (message.sender.toString() !== req.user._id.toString() && 
        req.user.role.role_name !== "HAMLET LEADER") {
      return res.status(403).json({ 
        message: "Bạn không có quyền xóa tin nhắn này" 
      });
    }

    await Message.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      content: "Tin nhắn đã được xóa"
    });

    res.status(200).json({ message: "Xóa tin nhắn thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto sync tất cả users vào chat (không cần auth - chỉ dùng để setup)
// @route   POST /api/chat/auto-sync
export const autoSyncAllUsers = async (req, res) => {
  try {
    console.log('🚀 AUTO SYNC: Bắt đầu thêm tất cả users vào chat...');
    
    let addedCount = 0;
    const results = [];

    // Xóa tất cả participants cũ để tránh duplicate
    await ChatParticipant.deleteMany({});
    console.log('🗑️ Đã xóa tất cả participants cũ');

    // Lấy tất cả admin
    const admins = await getUsersByRoleName("HAMLET LEADER");

    console.log(`🔍 Tìm thấy ${admins.length} admin(s)`);
    
    for (const admin of admins) {
      try {
        await ChatParticipant.create({
          user: admin._id,
          role: "ADMIN",
          isActive: true,
          joinedAt: new Date()
        });
        addedCount++;
        results.push(`✅ Admin: ${admin.name} (${admin.email})`);
        console.log(`✅ Đã thêm admin: ${admin.name}`);
      } catch (error) {
        results.push(`❌ Admin: ${admin.name} - Error: ${error.message}`);
        console.error(`❌ Lỗi thêm admin ${admin.name}:`, error.message);
      }
    }

    // Lấy tất cả accountant
    const accountants = await getUsersByRoleName("ACCOUNTANT");

    console.log(`🔍 Tìm thấy ${accountants.length} kế toán`);
    
    for (const accountant of accountants) {
      try {
        await ChatParticipant.create({
          user: accountant._id,
          role: "ACCOUNTANT",
          isActive: true,
          joinedAt: new Date()
        });
        addedCount++;
        results.push(`✅ Kế toán: ${accountant.name} (${accountant.email})`);
        console.log(`✅ Đã thêm kế toán: ${accountant.name}`);
      } catch (error) {
        results.push(`❌ Kế toán: ${accountant.name} - Error: ${error.message}`);
        console.error(`❌ Lỗi thêm kế toán ${accountant.name}:`, error.message);
      }
    }

    // Lấy tất cả chủ hộ
    const households = await Household.find().populate({
      path: "leader",
      populate: {
        path: "role",
        select: "role_name"
      }
    });
    
    console.log(`🔍 Tìm thấy ${households.length} hộ gia đình`);
    
    for (const household of households) {
      if (household.leader) {
        try {
          // Kiểm tra xem leader đã có trong chat chưa (có thể là admin hoặc accountant)
          const existingParticipant = await ChatParticipant.findOne({ user: household.leader._id });
          
          if (!existingParticipant) {
            await ChatParticipant.create({
              user: household.leader._id,
              role: "HOUSEHOLD_LEADER",
              isActive: true,
              joinedAt: new Date()
            });
            addedCount++;
            results.push(`✅ Chủ hộ: ${household.leader.name} (${household.houseHoldID})`);
            console.log(`✅ Đã thêm chủ hộ: ${household.leader.name}`);
          } else {
            results.push(`ℹ️ Chủ hộ: ${household.leader.name} đã có trong chat với role khác`);
            console.log(`ℹ️ Chủ hộ ${household.leader.name} đã có trong chat`);
          }
        } catch (error) {
          results.push(`❌ Chủ hộ: ${household.leader.name} - Error: ${error.message}`);
          console.error(`❌ Lỗi thêm chủ hộ ${household.leader.name}:`, error.message);
        }
      }
    }

    const totalParticipants = await ChatParticipant.countDocuments({ isActive: true });
    
    console.log(`🎉 AUTO SYNC hoàn thành: Đã thêm ${addedCount} người, tổng ${totalParticipants} người`);

    res.status(200).json({ 
      message: "🎉 Auto sync chat thành công!",
      success: true,
      addedCount: addedCount,
      totalParticipants: totalParticipants,
      details: {
        adminsFound: admins.length,
        accountantsFound: accountants.length,
        householdsFound: households.length,
        results: results
      }
    });
  } catch (error) {
    console.error("❌ AUTO SYNC error:", error);
    res.status(500).json({ 
      message: "Lỗi auto sync: " + error.message,
      success: false 
    });
  }
};

// @desc    Thêm admin hiện tại vào chat (self-add)
// @route   POST /api/chat/add-me
export const addCurrentAdminToChat = async (req, res) => {
  try {
    // Chỉ admin mới được tự thêm mình vào chat
    if (req.user.role.role_name !== "HAMLET LEADER") {
      return res.status(403).json({ 
        message: "Chỉ admin mới có quyền thêm mình vào chat" 
      });
    }

    console.log(`🔄 Adding current admin to chat: ${req.user.name} (${req.user.email})`);
    
    // Kiểm tra admin đã có trong chat chưa
    const existingParticipant = await ChatParticipant.findOne({ user: req.user._id });
    if (existingParticipant) {
      return res.status(200).json({ 
        message: "Admin đã có trong chat",
        success: true,
        totalParticipants: await ChatParticipant.countDocuments({ isActive: true })
      });
    }

    // Thêm admin vào chat
    await ChatParticipant.create({
      user: req.user._id,
      role: "ADMIN",
      isActive: true,
      joinedAt: new Date()
    });
    
    const totalParticipants = await ChatParticipant.countDocuments({ isActive: true });
    
    res.status(200).json({ 
      message: "Đã thêm admin vào chat thành công",
      success: true,
      totalParticipants: totalParticipants
    });
  } catch (error) {
    console.error("❌ Error adding admin to chat:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đồng bộ tất cả users hiện có vào chat
// @route   POST /api/chat/sync-all
export const syncAllUsersToChat = async (req, res) => {
  try {
    // Chỉ admin mới được sync
    if (req.user.role.role_name !== "HAMLET LEADER") {
      return res.status(403).json({ 
        message: "Chỉ admin mới có quyền đồng bộ chat" 
      });
    }

    let addedCount = 0;

    // Lấy tất cả admin (bao gồm cả admin hiện tại)
    const admins = await getUsersByRoleName("HAMLET LEADER");

    console.log(`🔍 Found ${admins.length} admins`);
    
    for (const admin of admins) {
      console.log(`🔄 Processing admin: ${admin.name} (${admin.email})`);
      
      const existingParticipant = await ChatParticipant.findOne({ user: admin._id });
      if (!existingParticipant) {
        await ChatParticipant.create({
          user: admin._id,
          role: "ADMIN",
          isActive: true,
          joinedAt: new Date()
        });
        addedCount++;
        console.log(`✅ Added admin: ${admin.name}`);
      }
    }

    // Lấy tất cả accountant
    const accountants = await getUsersByRoleName("ACCOUNTANT");

    console.log(`🔍 Found ${accountants.length} accountants`);
    
    for (const accountant of accountants) {
      console.log(`🔄 Processing accountant: ${accountant.name} (${accountant.email})`);
      
      const existingParticipant = await ChatParticipant.findOne({ user: accountant._id });
      if (!existingParticipant) {
        await ChatParticipant.create({
          user: accountant._id,
          role: "ACCOUNTANT",
          isActive: true,
          joinedAt: new Date()
        });
        addedCount++;
        console.log(`✅ Added accountant: ${accountant.name}`);
      }
    }

    // Lấy tất cả chủ hộ
    const households = await Household.find().populate({
      path: "leader",
      populate: {
        path: "role",
        select: "role_name"
      }
    });
    
    console.log(`🔍 Found ${households.length} households`);
    
    for (const household of households) {
      if (household.leader) {
        console.log(`🔄 Processing household leader: ${household.leader.name} (${household.houseHoldID})`);
        
        const existingParticipant = await ChatParticipant.findOne({ user: household.leader._id });
        if (!existingParticipant) {
          await ChatParticipant.create({
            user: household.leader._id,
            role: "HOUSEHOLD_LEADER",
            isActive: true,
            joinedAt: new Date()
          });
          addedCount++;
          console.log(`✅ Added household leader: ${household.leader.name}`);
        }
      }
    }

    const totalParticipants = await ChatParticipant.countDocuments({ isActive: true });
    
    console.log(`✅ Sync completed: Added ${addedCount}, Total ${totalParticipants}`);

    res.status(200).json({ 
      message: "Đồng bộ chat thành công",
      addedCount: addedCount,
      totalParticipants: totalParticipants,
      details: {
        adminsFound: admins.length,
        accountantsFound: accountants.length,
        householdsFound: households.length
      }
    });
  } catch (error) {
    console.error("❌ Sync error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Khởi tạo chat participants (chạy 1 lần)
// @route   POST /api/chat/initialize
export const initializeChatParticipants = async (req, res) => {
  try {
    // Chỉ admin mới được khởi tạo
    if (req.user.role.role_name !== "HAMLET LEADER") {
      return res.status(403).json({ 
        message: "Chỉ admin mới có quyền khởi tạo chat" 
      });
    }

    // Xóa tất cả participants cũ
    await ChatParticipant.deleteMany({});

    // Lấy tất cả admin
    const admins = await getUsersByRoleName("HAMLET LEADER");

    // Lấy tất cả accountant
    const accountants = await getUsersByRoleName("ACCOUNTANT");

    // Lấy tất cả chủ hộ
    const householdLeaders = await Household.find()
      .populate({
        path: "leader",
        populate: {
          path: "role",
          select: "role_name"
        }
      });

    const participants = [];

    // Thêm admin
    admins.forEach(admin => {
      participants.push({
        user: admin._id,
        role: "ADMIN"
      });
    });

    // Thêm accountant
    accountants.forEach(accountant => {
      participants.push({
        user: accountant._id,
        role: "ACCOUNTANT"
      });
    });

    // Thêm chủ hộ
    householdLeaders.forEach(household => {
      if (household.leader) {
        participants.push({
          user: household.leader._id,
          role: "HOUSEHOLD_LEADER"
        });
      }
    });

    // Tạo participants
    await ChatParticipant.insertMany(participants);

    res.status(200).json({ 
      message: "Khởi tạo chat thành công",
      participantCount: participants.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
