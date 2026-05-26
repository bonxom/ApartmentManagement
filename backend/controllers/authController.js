import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Xác thực user & lấy token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    console.time('LOGIN_FULL_REQUEST');
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const normalizedEmail = email.toLowerCase();

    // 2. Tìm user trong DB
    // Chúng ta phải .select('+password') vì trong Model ta đã ẩn nó đi\
    console.time('DB_FIND_USER');
    const user = await User.findOne({ email: normalizedEmail })
      .select("+password")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          select: "permission_name", 
        },
      });
    console.timeEnd('DB_FIND_USER');
    if (!user) {
      return res.status(401).json({ message: "Email/password not correct" });
    }

    // 3. So sánh mật khẩu (dùng method ta đã tạo trong Model)
    console.time('BCRYPT_COMPARE');
    const isMatch = await user.comparePassword(password);
    console.timeEnd('BCRYPT_COMPARE');

    if (!isMatch) {
      return res.status(401).json({ message: "Email/password not correct" });
    }
    
    if (user.status === "PENDING") {
        return res.status(403).json({ 
            message: "Your account has not been verified",
            code: "ACCOUNT_PENDING" // Mã lỗi để Frontend hiển thị giao diện 'Chờ duyệt'
        });
    }

    if (user.status === "LOCKED") {
        return res.status(403).json({ 
            message: "Your account has been suspended",
            code: "ACCOUNT_LOCKED"
        });
    }

    // 4. Nếu mọi thứ OK, tạo và gửi token
    const token = generateToken(user._id);

    // Bỏ mật khẩu khỏi đối tượng user trước khi gửi về
    user.password = undefined;
    console.timeEnd('LOGIN_FULL_REQUEST');
    res.status(200).json({
      message: "Login successful",
      token,
      user, // Gửi thông tin user (đã bao gồm role)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin user hiện tại (dựa trên token)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  // Middleware 'protect' (sẽ tạo ở bước 4) đã chạy
  // và gắn 'req.user' cho chúng ta
  // req.user đã được populate('role') trong middleware
  res.status(200).json(req.user);
};
