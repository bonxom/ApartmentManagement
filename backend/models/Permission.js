import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    permission_name: {
      type: String,
      required: true,
      unique: true,
      unique: true,      // sẽ tạo unique index
      uppercase: true,   // lưu dưới dạng chữ hoa
      trim: true,
    },
    description: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    }
  },
  {
    timestamps: true,
  }
)

permissionSchema.statics.findByName = function(name) {
  return this.findOne({ permission_name: name }, null, { runSettersOnQuery: true });
};

permissionSchema.statics.findByListOfName = async function (names = []) {
  if (!Array.isArray(names) || names.length === 0) return [];

  const normalized = [...new Set(
    names
      .filter((name) => typeof name === "string")
      .map((name) => name.trim().toUpperCase())
      .filter(Boolean)
  )];

  if (normalized.length === 0) return [];

  return this.find({ permission_name: { $in: normalized } });
};

export default mongoose.model("Permission", permissionSchema);
