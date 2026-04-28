import { Role } from "../models/Role.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createRole = asyncHandler(async (req, res) => {
  const { name, description, permissions = [] } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Role name is required");
  }

  const invalidPermissions = permissions.filter((permission) => !PERMISSIONS.includes(permission));

  if (invalidPermissions.length > 0) {
    res.status(400);
    throw new Error(`Invalid permissions: ${invalidPermissions.join(", ")}`);
  }

  const role = await Role.create({
    name,
    description: description || "",
    permissions
  });

  res.status(201).json(role);
});

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().sort({ createdAt: -1 });
  res.json({
    permissionsCatalog: PERMISSIONS,
    roles
  });
});

export const updateRolePermissions = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const { permissions = [] } = req.body;

  const invalidPermissions = permissions.filter((permission) => !PERMISSIONS.includes(permission));

  if (invalidPermissions.length > 0) {
    res.status(400);
    throw new Error(`Invalid permissions: ${invalidPermissions.join(", ")}`);
  }

  const role = await Role.findByIdAndUpdate(
    roleId,
    { permissions },
    { new: true, runValidators: true }
  );

  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  res.json(role);
});

export const updateRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const { name, description, permissions = [] } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Role name is required");
  }

  const invalidPermissions = permissions.filter((permission) => !PERMISSIONS.includes(permission));

  if (invalidPermissions.length > 0) {
    res.status(400);
    throw new Error(`Invalid permissions: ${invalidPermissions.join(", ")}`);
  }

  const role = await Role.findByIdAndUpdate(
    roleId,
    {
      name,
      description: description || "",
      permissions
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  res.json(role);
});

export const deleteRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;

  const role = await Role.findByIdAndDelete(roleId);

  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  res.json({ message: "Role deleted successfully" });
});
