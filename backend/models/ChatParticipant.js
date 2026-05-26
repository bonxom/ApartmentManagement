import mongoose from "mongoose";

const chatParticipantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "ACCOUNTANT", "HOUSEHOLD_LEADER"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    // Cài đặt thông báo
    notificationSettings: {
      enabled: {
        type: Boolean,
        default: true,
      },
      sound: {
        type: Boolean,
        default: true,
      },
      desktop: {
        type: Boolean,
        default: true,
      },
    },
  },
  { 
    timestamps: true 
  }
);

// Index
chatParticipantSchema.index({ user: 1 });
chatParticipantSchema.index({ role: 1 });
chatParticipantSchema.index({ isActive: 1 });

const ChatParticipant = mongoose.model("ChatParticipant", chatParticipantSchema);
export default ChatParticipant;