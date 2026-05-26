import mongoose from "mongoose";
import Permission from "../models/Permission.js";
import { AppError } from "../middleware/AppError.js";
import { ERROR_CODE } from "../middleware/errorCode.js";

// @desc    Create a new permission
// @route   POST /api/permissions
// @access  Private (Admin)
export const createPermission = async (req, res) => {
  const { permission_name, description } = req.body;
  //check input
  if (!permission_name) {
    // return res.status(400).json({ message: "Permission name is required"});
    throw new AppError(ERROR_CODE.PERMISSION_NAME_REQUIRED);
  }

  if (await Permission.findByName(permission_name)) {
    // return res.status(400).json({ message: "Permission name already exists" });
    throw new AppError(ERROR_CODE.PERMISSION_NAME_EXISTED);
  }
  //
  const permission = await Permission.create({
    permission_name: permission_name,
    description: description,
  });
  res.status(200).json({
    message: "Created permission",
    permission,
  });
};

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private (Admin)
export const getAllPermission = async (req, res) => {
  //sort by created time
  const permissions = await Permission.find().sort({ createdAt: -1 });
  res.status(200).json({
    message: "Request success",
    permissions,
  });
};

// @desc    Get permission by ID
// @route   GET /api/permissions/:id
// @access  Private (Admin)
export const getPermission = async (req, res) => {
  const { id } = req.params;
  // ID must be a mongoose ID
  if (!mongoose.Types.ObjectId.isValid(id))
    // return res.status(400).json({ message: "Invalid permission ID" });
    throw new AppError(ERROR_CODE.PERMISSION_ID_INVALID);

  const permission = await Permission.findById(id);
  if (!permission)
    // return res.status(404).json({ message: "Permission not found" });
    throw new AppError(ERROR_CODE.PERMISSION_NOT_EXISTED);

  res.status(200).json({
    message: "Request success",
    permission,
  });
};

// @desc    Update a permission
// @route   PUT /api/permissions/:id
// @access  Private (Admin)
export const updatePermission = async (req, res) => {
  const { id } = req.params;
  // ID must be a mongoose ID
  if (!mongoose.Types.ObjectId.isValid(id))
    // return res.status(400).json({ message: "Invalid permission ID" });
    throw new AppError(ERROR_CODE.PERMISSION_ID_INVALID);
  const { permission_name, description } = req.body;
  //check input
  const permission = await Permission.findById(id);
  if (!permission)
    // return res.status(404).json({ message: "Permission not found" });
    throw new AppError(ERROR_CODE.PERMISSION_NOT_EXISTED);

  if (permission_name !== undefined) {
    const duplicate = await Permission.findByName(permission_name);
    if (duplicate && duplicate._id.toString() !== id) {
      // return res
      //   .status(400)
      //   .json({ message: "Permission name already exists" });
      throw new AppError(ERROR_CODE.PERMISSION_NAME_EXISTED);
    }
    //name is provided and not duplicate
    permission.permission_name = permission_name;
  }
  // des is provided
  if (description !== undefined) permission.description = description;
  //
  await permission.save();
  res.status(200).json({
    message: "Updated permission",
    permission,
  });
};

// @desc    Delete a permission
// @route   DELETE /api/permissions/:id
// @access  Private (Admin)
export const deletePermission = async (req, res) => {
  const { id } = req.params;
  // ID must be a mongoose ID
  if (!mongoose.Types.ObjectId.isValid(id))
    // return res.status(400).json({ message: "Invalid permission ID" });
    throw new AppError(ERROR_CODE.PERMISSION_ID_INVALID);

  const permission = await Permission.findByIdAndDelete(id);
  if (!permission)
    // return res.status(404).json({ message: "Permission not found" });
    throw new AppError(ERROR_CODE.PERMISSION_NOT_EXISTED);

  res.status(200).json({
    message: "Deleted permission",
  });
};
