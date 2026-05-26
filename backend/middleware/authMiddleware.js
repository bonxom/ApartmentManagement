import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware 1: "protect" - Xác thực người dùng
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id)
        .select("-password")
        .populate({
          path: "role",
          populate: {
            path: "permissions",
            model: "Permission",
          },
        });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Cannot find user with that token" });
      }

      const rolePermissions =
        user.role?.permissions?.map((p) => p.permission_name) || [];

      user.permissions = rolePermissions;

      req.user = user;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        message: "Token invalid or expired",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Cannot find the token",
    });
  }
};


// Middleware 2: "authorize" - Phân quyền dựa trên vai trò
// (...roles) là một mảng các vai trò được phép
// Ví dụ: authorize('HAMLET LEADER', 'Kiểm toán')
export const authorize = (...roles) => {
  return (req, res, next) => {
    const { user } = req;
    const role = user?.role;
    const role_name = role?.role_name;
    if (!req.user || !req.user.role) {
         return res.status(403).json({ 
            message: "Cannot find the role" ,
            role: req.user  || "ok"
          });
    }

    if (!roles.includes(role_name)) {
      return res.status(403).json({ 
        message: `Role "${role_name}" cannot do this` 
      });
    }
    
    next();
  };
};

export const authorizePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Invalid user auth" });
    }

    const userPermissions = req.user.permissions || [];

    // Chuẩn hóa: tất cả uppercase để khớp với permission_name trong DB
    const normalizedUserPerms = userPermissions.map((p) => p.toUpperCase());
    const normalizedRequired = requiredPermissions.map((p) =>
      p.toUpperCase()
    );

    const hasPermission = normalizedRequired.some((perm) =>
      normalizedUserPerms.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "You don't have the rights to do",
        required: normalizedRequired,
        yourPermissions: normalizedUserPerms,
      });
    }

    next();
  };
};