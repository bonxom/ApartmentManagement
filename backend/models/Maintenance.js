import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề bảo trì là bắt buộc"],
      trim: true,
    },
    facilityName: {
      type: String,
      required: [true, "Tên thiết bị hoặc khu vực cần bảo trì là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Nội dung chi tiết là bắt buộc"],
    },
    startDate: {
      type: Date,
      required: [true, "Ngày bắt đầu dự kiến là bắt buộc"],
    },
    endDate: {
      type: Date,
      required: [true, "Ngày hoàn thành dự kiến là bắt buộc"],
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    assignedTo: {
      type: String,
      required: [true, "Đơn vị/Người phụ trách thực hiện là bắt buộc"],
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;
