import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    fileUrl: {
      type: String, // URL của file đính kèm (nếu có)
    },
    fileName: {
      type: String, // Tên file gốc
    },
    isRead: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      readAt: {
        type: Date,
        default: Date.now,
      }
    }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Tin nhắn được reply
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index để tối ưu query
messageSchema.index({ createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ isDeleted: 1 });

// Virtual để đếm số người đã đọc
messageSchema.virtual('readCount').get(function() {
  return this.isRead ? this.isRead.length : 0;
});

const Message = mongoose.model("Message", messageSchema);
export default Message;