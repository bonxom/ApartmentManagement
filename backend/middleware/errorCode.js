export const ERROR_CODE = {
  UNCATEGORIZED_EXCEPTION: {
    code: 9999,
    message: "Uncategorized error",
    statusCode: 500,
  },

  // ROLE
  ROLE_ID_INVALID: {
    code: 1000,
    message: "Role ID must be a mongoose.Types.ObjectId",
    statusCode: 400,
  },
  ROLE_NAME_REQUIRED: {
    code: 1001,
    message: "Role name is required",
    statusCode: 400,
  },
  ROLE_NAME_EXISTED: {
    code: 1002,
    message: "Role name already exists",
    statusCode: 400,
  },
  ROLE_NOT_EXISTED: {
    code: 1003,
    message: "Role not existed",
    statusCode: 404,
  },
  ROLE_PERMISSION_NOT_EXIST: {
    code: 1004,
    message: "Some permissions do not exist",
    statusCode: 400,
  },

  // PERMISSION
  PERMISSION_LIST_INVALID: {
    code: 2000,
    message: "Input permission must be an array",
    statusCode: 400,
  },
  PERMISSION_NOT_EXISTED: {
    code: 2001,
    message: "Permission does not exist",
    statusCode: 404,
  },
  PERMISSION_NAME_REQUIRED: {
    code: 2002,
    message: "Permission name is required",
    statusCode: 400,
  },
  PERMISSION_NAME_EXISTED: {
    code: 2003,
    message: "Permission name already exists",
    statusCode: 400,
  },
  PERMISSION_ID_INVALID: {
    code: 2004,
    message: "Permission ID must be a mongoose.Types.ObjectId",
    statusCode: 400,
  },
  PERMISSION_LIST_EMPTY: {
    code: 2005,
    message: "Permission list cannot be empty",
    statusCode: 400,
  },

  // AUTHORIZATION / AUTHENTICATION (ACCESS)
  FORBIDDEN: {
    code: 3000,
    message: "You do not have permission to access this resource",
    statusCode: 403,
  },
  UNAUTHORIZED: {
    code: 3001,
    message: "Authentication required",
    statusCode: 401,
  },
  USER_ROLE_NOT_FOUND: {
    code: 3002,
    message: "User role not found",
    statusCode: 403,
  },
  AUTHORIZATION_ROLE_NOT_ALLOWED: {
    code: 3003,
    message: "Your role is not allowed to access this resource",
    statusCode: 403,
  },
  AUTHORIZATION_PERMISSION_DENIED: {
    code: 3004,
    message: "You do not have the required permission",
    statusCode: 403,
  },

  // USER
  USER_NOT_EXISTED: {
    code: 4000,
    message: "User not existed",
    statusCode: 404,
  },
  USER_ID_INVALID: {
    code: 4001,
    message: "User ID must be a mongoose.Types.ObjectId",
    statusCode: 400,
  },
  USER_EMAIL_EXISTED: {
    code: 4002,
    message: "Email already exists",
    statusCode: 400,
  },
  USER_NAME_REQUIRED: {
    code: 4003,
    message: "User name is required",
    statusCode: 400,
  },
  USER_WRONG_PASSWORD: {
    code: 4004,
    message: "Incorrect password",
    statusCode: 400,
  },
  USER_PASSWORD_REQUIRED: {
    code: 4005,
    message: "Password is required",
    statusCode: 400,
  },
  USER_CANNOT_DELETE_SELF: {
    code: 4006,
    message: "You cannot delete your own account",
    statusCode: 400,
  },
  USER_NEWPASSWORD_SAME_AS_OLD: {
    code: 4007,
    message: "New password must be different from old password",
    statusCode: 400,
  },
  USER_OLD_NEW_PASSWORD_REQUIRED: {
    code: 4008,
    message: "Old password and new password are required",
    statusCode: 400,
  },
  USER_USERCARDID_REQUIRED: {
    code: 4009,
    message: "userCardID is required",
    statusCode: 400,
  },
  USER_USERCARDID_EXISTED: {
    code: 4010,
    message: "userCardID already exists",
    statusCode: 400,
  },
  USER_NO_HOUSEHOLD: {
    code: 4011,
    message: "User does not belong to any household",
    statusCode: 404,
  },

  // TOKEN / AUTH
  TOKEN_MISSING: {
    code: 5000,
    message: "Authorization token is missing",
    statusCode: 401,
  },
  TOKEN_INVALID: {
    code: 5001,
    message: "Token is invalid",
    statusCode: 401,
  },
  TOKEN_EXPIRED: {
    code: 5002,
    message: "Token has expired",
    statusCode: 401,
  },
  INVALID_CREDENTIALS: {
    code: 5003,
    message: "Email or password is incorrect",
    statusCode: 401,
  },
  PASSWORD_REQUIRED: {
    code: 5004,
    message: "Password is required",
    statusCode: 400,
  },

  // GENERIC REQUEST VALIDATION
  MISSING_FIELDS: {
    code: 6000,
    message: "Missing required fields",
    statusCode: 400,
  },
  INVALID_PAYLOAD: {
    code: 6001,
    message: "Invalid request payload",
    statusCode: 400,
  },
  EMAIL_PASSWORD_REQUIRED: {
    code: 6002,
    message: "Email and password are required",
    statusCode: 400,
  },

  // HOUSEHOLD MODULE
  HOUSEHOLD_INFO_INCOMPLETE: {
    code: 7001,
    message: "Household ID, address, and leader ID are required",
    statusCode: 400,
  },
  HOUSEHOLD_ID_EXISTED: {
    code: 7002,
    message: "Household ID already exists",
    statusCode: 400,
  },
  HOUSEHOLD_NOT_FOUND: {
    code: 7003,
    message: "Household not found",
    statusCode: 404,
  },
  USER_ALREADY_HOUSEHOLD_MEMBER: {
    code: 7004,
    message: "User is already a member of this household",
    statusCode: 400,
  },
  CANNOT_REMOVE_HOUSEHOLD_LEADER: {
    code: 7005,
    message: "Cannot remove household leader. Assign a new leader first",
    statusCode: 400,
  },

  // LEGACY / DUPLICATES (kept for backward compatibility)
  USER_CARD_ID_EXISTED: {
    code: 8001,
    message: "User card ID already exists",
    statusCode: 400,
  },
  CANNOT_DELETE_OWN_ACCOUNT: {
    code: 8002,
    message: "You cannot delete your own account",
    statusCode: 400,
  },
};
