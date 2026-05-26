import Role from "../models/Role.js";

const roleCache = new Map();

export const getRoleIdByName = async (roleName) => {
  const key = roleName.toUpperCase();
  if (roleCache.has(key)) return roleCache.get(key);

  const role = await Role.findByName(key);
  if (!role) {
    throw new Error(`Role "${key}" not found`);
  }
  roleCache.set(key, role._id);
  return role._id;
};

export const getMemberRoleId = () => getRoleIdByName("MEMBER");
export const getHouseMemberRoleId = () => getRoleIdByName("HOUSE MEMBER");
