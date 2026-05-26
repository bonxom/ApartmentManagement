import { AppError } from "./AppError.js";
import { ERROR_CODE } from "./errorCode.js";

/**
 * Global Error Handler Middleware
 * - Bắt tất cả lỗi AppError
 * - Bắt tất cả lỗi Validation / Cast / JWT
 * - Bắt tất cả lỗi chưa categorize
 * - Trả về JSON chuẩn: { code, message }
 */
export const errorHandler = (err, req, res, next) => {
  // 1️⃣ Nếu là AppError
  if (err instanceof AppError) {
    console.error(`[AppError] Code: ${err.code}, Message: ${err.message}`);
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  // 2️⃣ Nếu là ValidationError (Mongoose / Joi / express-validator)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    console.error("[ValidationError]", messages);
    return res.status(400).json({
      code: ERROR_CODE.INVALID_PAYLOAD.code,
      message: messages.join("; "),
    });
  }

  // 3️⃣ Nếu là CastError (ObjectId invalid)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    console.error("[CastError]", err.message);
    let code = ERROR_CODE.UNCATEGORIZED_EXCEPTION.code;
    let message = `Invalid ID for field ${err.path}`;

    // Map theo path
    if (err.path === "_id") {
      if (err.model === "User") code = ERROR_CODE.USER_ID_INVALID.code;
      if (err.model === "Role") code = ERROR_CODE.ROLE_ID_INVALID.code;
      if (err.model === "Permission")
        code = ERROR_CODE.PERMISSION_ID_INVALID.code;
    }

    return res.status(400).json({
      code,
      message,
    });
  }

  // 4️⃣ JWT / Auth errors
  if (err.name === "JsonWebTokenError") {
    console.error("[JWT Invalid]", err.message);
    return res.status(401).json({
      code: ERROR_CODE.TOKEN_INVALID.code,
      message: ERROR_CODE.TOKEN_INVALID.message,
    });
  }

  if (err.name === "TokenExpiredError") {
    console.error("[JWT Expired]", err.message);
    return res.status(401).json({
      code: ERROR_CODE.TOKEN_EXPIRED.code,
      message: ERROR_CODE.TOKEN_EXPIRED.message,
    });
  }

  // 5️⃣ Missing req.user (unauthorized)
  if (err.message === "Missing req.user") {
    console.error("[Unauthorized]", err.message);
    return res.status(401).json({
      code: ERROR_CODE.UNAUTHORIZED.code,
      message: ERROR_CODE.UNAUTHORIZED.message,
    });
  }

  // 6️⃣ Forbidden (no permission)
  if (err.message === "Forbidden") {
    console.error("[Forbidden]", err.message);
    return res.status(403).json({
      code: ERROR_CODE.FORBIDDEN.code,
      message: ERROR_CODE.FORBIDDEN.message,
    });
  }

  // 7️⃣ User / Role / Permission errors (thường ném bằng AppError)
  // Nếu có những lỗi đặc biệt chưa dùng AppError, check message
  const knownMessagesMap = {
    "Email hoặc mật khẩu không đúng": ERROR_CODE.TOKEN_INVALID,
    "Email đã tồn tại": ERROR_CODE.USER_EMAIL_EXISTED,
    "Thiếu userCardID": ERROR_CODE.MISSING_FIELDS,
    "User card ID đã tồn tại": {
      code: 4003,
      message: "User card ID already exists",
      statusCode: 400,
    },
    "Không tìm thấy vai trò mặc định.": ERROR_CODE.ROLE_NOT_EXISTED,
  };

  if (err.message && knownMessagesMap[err.message]) {
    const mapped = knownMessagesMap[err.message];
    console.error("[Mapped Error]", err.message);
    return res.status(mapped.statusCode || 400).json({
      code: mapped.code,
      message: mapped.message,
    });
  }

  // 8️⃣ Uncategorized (catch all)
  console.error("[Uncategorized Error]", err);
  return res.status(500).json({
    code: ERROR_CODE.UNCATEGORIZED_EXCEPTION.code,
    message: ERROR_CODE.UNCATEGORIZED_EXCEPTION.message,
  });
};
