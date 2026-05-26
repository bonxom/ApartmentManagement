import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    // requester này có thể là household nếu muốn đóng phí
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { 
      type: String,
      enum: [
        "REGISTER",             // Đăng ký tài khoản
        "UPDATE_INFO",          // Sửa thông tin
        "PAYMENT",              // Nộp tiền online
        "TEMPORARY_RESIDENCE",  // Đăng ký tạm trú
        "TEMPORARY_ABSENT",     // Báo tạm vắng
        "BIRTH_REPORT",         // Khai sinh
        "DEATH_REPORT"          // Khai tử
      ], // Có thể mở rộng thêm sau này
      required: true,
    }, 
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    // Dùng Mixed type để lưu object JSON linh hoạt. 
    // Nếu là UPDATE_INFO: lưu { job: "Mới", dob: "..." }
    // Nếu là PAYMENT: lưu { amount: 50000, evidenceImage: "url..." }
    requestData: {
      type: mongoose.Schema.Types.Mixed, 
      default: {},
    },
    leaderComment: {
      type: String, // Lý do từ chối hoặc ghi chú của tổ trưởng
      default: "",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;