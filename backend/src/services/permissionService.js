import { TeamMembership } from "../models/TeamMembership.js";

export const getResolvedPermissions = async ({ userId, teamId }) => {
  const membership = await TeamMembership.findOne({ userId, teamId }).populate("roleIds");

  if (!membership || !membership.roleIds || membership.roleIds.length === 0) {
    return {
      roles: [],
      permissions: []
    };
  }

  const permissions = [...new Set(membership.roleIds.flatMap((role) => role.permissions || []))];

  return {
    roles: membership.roleIds.map((role) => ({
      id: role._id,
      name: role.name
    })),
    permissions
  };
};
