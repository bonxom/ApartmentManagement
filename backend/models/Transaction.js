import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fee: { // Nộp cho khoản nào?
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fee",
      required: true,
    },
    household: { // Hộ nào nộp?
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    payer: { // Ai đứng tên nộp? (Mặc định Chủ hộ theo yêu cầu của bạn)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    amount: { // Số tiền nộp lần này
      type: Number,
      required: [true, "Số tiền là bắt buộc"],
      min: 0,
    },
    note: { // Ghi chú (nếu nộp thiếu/nộp hộ)
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED"],
      default: "VERIFIED",
    },
  },
  { timestamps: true } // Có createdAt = Ngày nộp tiền
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
