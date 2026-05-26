import mongoose from "mongoose";

const residentHistorySchema = new mongoose.Schema(
  {
    houseHoldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    // ... giữ nguyên temporaryResidents
    temporaryResidents: [
      {
        name: String,
        userCardID: String,
        dob: Date,
        sex: String,
        birthLocation: String,
        ethnic: String,
        phoneNumber: String,
        job: String,
        permanentAddress: String,
        reason: String,
        startDate: Date,
        endDate: Date,
        isActive: { type: Boolean, default: true },
      }
    ],
    // ... giữ nguyên temporaryAbsent
    temporaryAbsent: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        startDate: Date,
        endDate: Date,
        reason: String,
        temporaryAddress: String,
        isActive: { type: Boolean, default: true },
      }
    ],
    
    // --- [MỚI] THÊM MẢNG NÀY ĐỂ LƯU TRẺ SƠ SINH ---
    births: [
        {
            name: String,
            sex: String,
            dob: Date,
            birthLocation: String,
            birthCertificateNumber: String, // Số giấy khai sinh
            relationshipWithHead: String,
            ethnic: String,
            createdAt: { type: Date, default: Date.now } // Ngày thêm vào
        }
    ],

    // --- [MỚI] Lưu thông tin khai tử đã duyệt ---
    deaths: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            name: String,
            userCardID: String,
            dateOfDeath: Date,
            reason: String,
            deathCertificateUrl: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
  },
  { timestamps: true }
);

const ResidentHistory = mongoose.model("ResidentHistory", residentHistorySchema);
export default ResidentHistory;
