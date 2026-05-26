import mongoose from "mongoose";
import User from "../models/User.js";
import Role from "../models/Role.js"; // Giả sử bạn có model Role
import Household from "../models/Household.js";
import { AppError } from "../middleware/AppError.js";
import { ERROR_CODE } from "../middleware/errorCode.js";
import Request from "../models/Request.js";
// import { autoAddToChat, autoRemoveFromChat } from "../middleware/chatMiddleware.js";

// @desc    Tạo một User mới (Admin/Tổ trưởng tạo trực tiếp)
// @route   POST /api/users
export const createUser = async (req, res) => {
  try {
    const { email, password, name, sex, dob, phoneNumber, userCardID,
      job, ethnic, birthLocation, status, roleName, roleId, role } = // Cho phép nhận status hoặc tự set
      req.body;
    const normalizedEmail = email?.toLowerCase();

    if (!userCardID || !email || !password || !name) {
      return res.status(400).json({ message: "Missing information, please fill all" });
    }
    
    // Check trùng lặp
    const userExists = await User.findByEmail(normalizedEmail);
    if (userExists) return res.status(400).json({ message: "Email has existed" });

    const cardExists = await User.findByUserCardID(userCardID);
    if (cardExists) return res.status(400).json({ message: "userCardID has existed" });

    let assignedRole = null;
    if (roleId || role) {
      assignedRole = await Role.findById(roleId || role);
      if (!assignedRole) {
        return res.status(400).json({ message: "Role not found" });
      }
    } else if (roleName) {
      assignedRole = await Role.findByName(roleName);
      if (!assignedRole) {
        return res.status(400).json({ message: "Role not found" });
      }
    } else {
      assignedRole = await Role.findByName("MEMBER");
      if (!assignedRole) {
        return res.status(500).json({ message: "Role: \"MEMBER\" not found" });
      }
    }

    const user = await User.create({
      email: normalizedEmail, password, name, sex, dob,
      phoneNumber, userCardID,
      job, ethnic, birthLocation,
      role: assignedRole._id,
      household: null,
      relationshipWithHead: null,
      status: status || "VERIFIED" 
    });

    if (user) {
      // Tự động thêm vào chat nếu có role phù hợp
      // try {
      //   await autoAddToChat(user._id, assignedRole.role_name);
      // } catch (chatError) {
      //   console.error("Error adding user to chat:", chatError);
      //   // Không throw error vì tạo user đã thành công
      // }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: assignedRole.role_name,
        status: user.status // Trả về status để admin biết
      });
    } else {
      res.status(400).json({ message: "Data not valid" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    // 1. Tạo User với status mặc định là PENDING
    const { email, password, name, sex, dob, 
      phoneNumber, userCardID,
      job, ethnic, birthLocation } =
      req.body;
    const normalizedEmail = email?.toLowerCase();

    if (!userCardID || !email || !password || !name) {
      return res.status(400).json({ message: "Missing information, please fill all" });
    }
    // Check trùng lặp
    const userExists = await User.findByEmail(normalizedEmail);
    if (userExists) return res.status(400).json({ message: "Email has existed" });

    const cardExists = await User.findByUserCardID(userCardID);
    if (cardExists) return res.status(400).json({ message: "userCardID has existed" });

    const defaultRole = await Role.findByName("MEMBER"); 
    if (!defaultRole) {
      return res.status(500).json({ message: "Role: \"MEMBER\" not found" });
    }

    const newUser = await User.create({
        ...req.body,
        email: normalizedEmail,
        status: "PENDING", // Đảm bảo status là Pending
        role: defaultRole._id
    });

    // 2. TẠO NGAY YÊU CẦU DUYỆT ĐĂNG KÝ
    await Request.create({
        requester: newUser._id,
        type: "REGISTER",
        requestData: { note: "This user want to register" }
    });

    res.status(201).json({ 
        message: "Registeration in process. Please wait for approvement",
        user: newUser 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy tất cả User
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate("role", "role_name")
      .populate("household", "houseHoldID address")
      .select("-password");
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy một User bằng ID
// @route   GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const isSelf = req.user?._id?.toString() === req.params.id;
    const userPermissions = (req.user?.permissions || []).map(p => p.toUpperCase());
    const canViewOthers = userPermissions.includes("VIEW USER LIST");
    if (!isSelf && !canViewOthers) {
      return res.status(403).json({ message: "You can only view your own profile" });
    }

    const user = await User.findById(req.params.id)
      .populate("role")
      .populate("household", "houseHoldID address members"); 

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật User
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Cập nhật thông tin (Chỉ cập nhật nếu có gửi lên)
    if (req.body.email && typeof req.body.email === "string") {
      const normalizedEmail = req.body.email.toLowerCase().trim();
      if (normalizedEmail && normalizedEmail !== user.email) {
        const emailExists = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });
        if (emailExists) {
          return res.status(400).json({ message: "Email has existed" });
        }
        user.email = normalizedEmail;
      }
    }
    user.name = req.body.name || user.name;
    user.sex = req.body.sex || user.sex;
    user.dob = req.body.dob || user.dob;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    
    // Cập nhật các trường thông tin nhân khẩu
    user.job = req.body.job || user.job;
    user.ethnic = req.body.ethnic || user.ethnic;
    user.birthLocation = req.body.birthLocation || user.birthLocation;
    user.relationshipWithHead = req.body.relationshipWithHead || user.relationshipWithHead;

    // Xử lý Role (Cẩn trọng: Thường chỉ Admin mới được sửa quyền)
    if (req.body.roleId || req.body.role) {
      const newRole = await Role.findById(req.body.roleId || req.body.role);
      if (!newRole) {
        return res.status(400).json({ message: "Role not found" });
      }
      user.role = newRole._id;
    } else if (req.body.roleName) {
      const newRole = await Role.findOne({ role_name: req.body.roleName });
      if (!newRole) {
        return res.status(400).json({ message: "Role not found" });
      }
      user.role = newRole._id;
    }
    const updatedUser = await user.save();
    const responseUser = updatedUser.toObject();
    delete responseUser.password;

    res.status(200).json(responseUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa User
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid userID" });
  }

  // Ngăn tự xóa chính mình (nếu cần)
  if (req.user && req.user._id.toString() === id) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Nếu User này là CHỦ HỘ của một hộ nào đó -> Không cho xóa ngay
    const ledHousehold = await Household.findOne({ leader: id });
    if (ledHousehold) {
      return res.status(400).json({ 
        message: `This user is the owner of household ID: ${ledHousehold.houseHoldID}. Remove the owner role to delete him.` 
      });
    }
    // 2. Nếu User đang là THÀNH VIÊN của một hộ -> Phải rút tên khỏi hộ đó
    if (user.household) {
      await Household.findByIdAndUpdate(user.household, {
        $pull: { members: id } // Lệnh $pull của MongoDB giúp xóa phần tử khỏi mảng
      });
    }


    await user.deleteOne();
    return res.status(200).json({ message: "Delete sucessful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thay đổi mật khẩu User
// @route   PATCH /users/:id/password
// @access  Private (User/Admin)
export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const isSelfChange = req.user?._id?.toString() === id;
    const userPermissions = (req.user?.permissions || []).map(p => p.toUpperCase());

    if (!newPassword) {
      throw new AppError(ERROR_CODE.USER_PASSWORD_REQUIRED);
    }

    if (isSelfChange && !oldPassword) {
      throw new AppError(ERROR_CODE.USER_OLD_NEW_PASSWORD_REQUIRED);
    }

    if (!isSelfChange && !userPermissions.includes("RESET USER PASSWORD")) {
      return res.status(403).json({ message: "You are not allowed to reset this password" });
    }

    const user = await User.findById(id).select("+password +userCardID");
    if (!user) {
      throw new AppError(ERROR_CODE.USER_NOT_EXISTED);
    }

    if (isSelfChange) {
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        throw new AppError(ERROR_CODE.USER_WRONG_PASSWORD);
      }
      if (oldPassword === newPassword) {
        throw new AppError(ERROR_CODE.USER_NEWPASSWORD_SAME_AS_OLD);
      }
    }

    user.password = newPassword;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
      message: isSelfChange ? "Password changed successfully" : "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy hộ của user hiện tại
// @route   GET /users/me/household
// @access  Private
export const getMyHousehold = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId).populate("household");
    if (!user) {
      throw new AppError(ERROR_CODE.USER_NOT_EXISTED);
    }

    if (!user.household) {
      throw new AppError(ERROR_CODE.USER_NO_HOUSEHOLD);
    }

    const household = await Household.findById(user.household)
      .populate("leader", "name email userCardID")
      .populate("members", "name email userCardID");

    res.status(200).json(household);
  } catch (error) {
    next(error);
  }
};
