import { AppError } from "../middleware/AppError.js";
import { ERROR_CODE } from "../middleware/errorCode.js";
import Permission from "../models/Permission.js";
import Role from "../models/Role.js";
import mongoose from "mongoose";

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private (Admin)
export const createRole = async (req, res) => {
  const { role_name, permissions } = req.body;
  // check input
  if (!role_name) {
    throw new AppError(ERROR_CODE.ROLE_NAME_REQUIRED);
  }

  if (await Role.findByName(role_name)) {
    throw new AppError(ERROR_CODE.ROLE_NAME_EXISTED);
  }

  if (permissions !== undefined && !Array.isArray(permissions)) {
    throw new AppError(ERROR_CODE.PERMISSION_LIST_INVALID);
  }

  const perList = await Permission.findByListOfName(permissions);
  const role = await Role.create({
    role_name: role_name,
    permissions: perList,
  });

  const populatedRole = await Role.findById(role._id)
    .populate("permissions", "permission_name description");

  res.status(200).json({
    message: "Created role",
    role: populatedRole
  });
}

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (Admin)
export const getAllRoles = async (req, res) => {
  const roles = await Role.find()
    .populate("permissions", "permission_name description")
    .sort({ createdAt: -1 });
  res.status(200).json({
    message: "Request success",
    roles
  });
}

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private (Admin)
export const getRole = async (req, res) => {
  const { id } = req.params;
  // ID must be a mongoose ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(ERROR_CODE.ROLE_ID_INVALID);
  }
  // check if role is existed
  const role = await Role.findById(id)
    .populate("permissions", "permission_name description");
  if (!role) throw new AppError(ERROR_CODE.ROLE_NOT_EXISTED);

  res.status(200).json({
    message: "Request success",
    role
  });
}

// @desc    Update an existing role
// @route   PUT /api/roles/:id
// @access  Private (Admin)
export const updateRole = async (req, res) => {
  const { id } = req.params;
  // ID must be a mongoose ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(ERROR_CODE.ROLE_ID_INVALID)
  }
  // check input
  const { role_name, permissions } = req.body;

  const role = await Role.findById(id);
  if (!role) throw new AppError(ERROR_CODE.ROLE_NOT_EXISTED);

  if (role_name !== undefined) {
    const duplicate = await Role.findByName(role_name);
    if (duplicate && duplicate._id.toString() !== id) {
      throw new AppError(ERROR_CODE.ROLE_NAME_EXISTED);
    }
    // role_name is provided and not duplicated
    role.role_name = role_name;
  }

  if (permissions !== undefined) {
    if (!Array.isArray(permissions)) {
      throw new AppError(ERROR_CODE.PERMISSION_LIST_INVALID);
    }
    role.permissions = await Permission.findByListOfName(permissions);
  }

  await role.save();

  const populatedRole = await Role.findById(role._id)
    .populate("permissions", "permission_name description");

  res.status(200).json({
    message: "Updated role",
    role: populatedRole
  });
}

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private (Admin)
export const deleteRole = async (req, res) => {
  const { id } = req.params;
  // ID must be a mongoose ID
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid role ID" });

  const role = await Role.findByIdAndDelete(id);
  if (!role) return res.status(404).json({ message: "Role not found" });
  // console.log(role.role_name);
  res.status(200).json({
    message: "Deleted role"
  })
}

// @desc    Get permissions of a role
// @route   GET /roles/:id/permissions
// @access  Private (Hamlet Leader)
export const getRolePermissions = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(ERROR_CODE.ROLE_ID_INVALID);
  }

  const role = await Role.findById(id)
    .populate("permissions", "permission_name description");
    
  if (!role) {
    throw new AppError(ERROR_CODE.ROLE_NOT_EXISTED);
  }

  res.status(200).json({
    message: "Request success",
    role_name: role.role_name,
    permissions: role.permissions
  });
}

// @desc    Update permissions of a role
// @route   PUT /roles/:id/permissions
// @access  Private (Hamlet Leader)
export const updateRolePermissions = async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(ERROR_CODE.ROLE_ID_INVALID);
  }

  if (!Array.isArray(permissions)) {
    return res.status(400).json({ message: "Permissions must be an array" });
  }

  const role = await Role.findById(id);
  if (!role) {
    throw new AppError(ERROR_CODE.ROLE_NOT_EXISTED);
  }

  // Cập nhật danh sách permissions
  role.permissions = await Permission.findByListOfName(permissions);
  await role.save();

  const updatedRole = await Role.findById(id)
    .populate("permissions", "permission_name description");

  res.status(200).json({
    message: "Updated role permissions",
    role: updatedRole
  });
}
