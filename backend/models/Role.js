import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,      // sẽ tạo unique index
      uppercase: true,   // lưu dưới dạng chữ hoa
      trim: true,
    },
    permissions: [{ // kết nối n-n đến Permission
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      trim: true,
      required: true,
    }]
  },
  {
    timestamps: true,
  }
);

roleSchema.statics.findByName = function(name) {
  return this.findOne({role_name: name}, null, { runSettersOnQuery: true })
};


export default mongoose.model("Role", roleSchema);
