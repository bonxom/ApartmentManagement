import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên khoản thu là bắt buộc"], 
      trim: true, // Ví dụ: "Phí Vệ sinh 2024"
    },
    type: {
      type: String,
      enum: ["MANDATORY", "VOLUNTARY"], // MANDATORY: Phí bắt buộc, VOLUNTARY: Đóng góp
      required: true,
    },
    description: {
      type: String, // Ví dụ: "Thu theo quy định số 123..."
    },
    // Đơn giá áp dụng cho Phí bắt buộc
    unitPrice: {
      type: Number, 
      default: 0, // Ví dụ: 6000 (đồng/người/tháng)
    },
    status: {
        type: String,
        enum: ["ACTIVE", "COMPLETED"], // ACTIVE: Đang thu, COMPLETED: Đã chốt sổ
        default: "ACTIVE"
    }
  },
  { timestamps: true }
);

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;