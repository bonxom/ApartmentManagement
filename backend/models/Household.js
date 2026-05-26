import mongoose from "mongoose";

const householdSchema = new mongoose.Schema(
  {
    houseHoldID: {
      type: String,
      required: [true, "Household ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Household leader is required"],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    historyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResidentHistory",
    },
  },
  { timestamps: true }
);

// Hook: Trước khi lưu household, đảm bảo leader là thành viên
householdSchema.pre("save", function (next) {
  if ((this.isModified("leader") || this.isModified("members")) && this.leader) {
    const leaderId = this.leader.toString();
    const hasLeader = (this.members || []).some(
      (member) => member?.toString() === leaderId
    );
    if (!hasLeader) {
      this.members.push(this.leader);
    }
  }
  next();
});

// Hook: Khi khởi tạo household thì khởi tạo ResidentHistory tương ứng
householdSchema.post("save", async function (doc) {
  try {
    const ResidentHistory = mongoose.model("ResidentHistory");
    
    // Nếu household chưa có historyID thì tạo ResidentHistory mới
    if (!doc.historyID) {
      const newHistory = await ResidentHistory.create({ houseHoldId: doc._id });
      
      // Cập nhật historyID vào household (dùng updateOne để tránh trigger lại post-save)
      await mongoose.model("Household").updateOne(
        { _id: doc._id },
        { $set: { historyID: newHistory._id } }
      );
    } else {
      // Nếu đã có historyID, kiểm tra ResidentHistory có tồn tại không
      const existingHistory = await ResidentHistory.findById(doc.historyID);
      if (!existingHistory) {
        // Nếu không tồn tại, tạo mới
        const newHistory = await ResidentHistory.create({ houseHoldId: doc._id });
        await mongoose.model("Household").updateOne(
          { _id: doc._id },
          { $set: { historyID: newHistory._id } }
        );
      } else if (!existingHistory.houseHoldId) {
        existingHistory.houseHoldId = doc._id;
        await existingHistory.save();
      }
    }
  } catch (error) {
    console.error("Error creating ResidentHistory for Household:", error);
  }
});

// Hook: Sau khi lưu household, cập nhật user.household cho tất cả members
householdSchema.post("save", async function (doc) {
  try {
    const User = mongoose.model("User");
    
    // Cập nhật household cho tất cả members
    if (doc.members && doc.members.length > 0) {
      await User.updateMany(
        { _id: { $in: doc.members } },
        { $set: { household: doc._id } }
      );
    }
  } catch (error) {
    console.error("Error updating user households:", error);
  }
});

// Hook: Trước khi xóa household, xóa reference trong users
householdSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const User = mongoose.model("User");
    
    if (this.members && this.members.length > 0) {
      await User.updateMany(
        { _id: { $in: this.members } },
        { $set: { household: null } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Household = mongoose.model("Household", householdSchema);
export default Household;
