import mongoose from "mongoose";
import { Role } from "../models/Role.js";
import { Team } from "../models/Team.js";
import { TeamMembership } from "../models/TeamMembership.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ensureObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`${fieldName} is invalid`);
    error.statusCode = 400;
    throw error;
  }
};

const ensureReferences = async ({ userId, teamId, roleIds }) => {
  const [user, team, roles] = await Promise.all([
    User.findById(userId),
    Team.findById(teamId),
    Role.find({ _id: { $in: roleIds } })
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (roles.length !== roleIds.length) {
    const error = new Error("One or more roles were not found");
    error.statusCode = 404;
    throw error;
  }
};

export const createMembership = asyncHandler(async (req, res) => {
  const { userId, teamId, roleIds } = req.body;

  if (!userId || !teamId || !Array.isArray(roleIds) || roleIds.length === 0) {
    res.status(400);
    throw new Error("userId, teamId, and at least one roleId are required");
  }

  ensureObjectId(userId, "userId");
  ensureObjectId(teamId, "teamId");
  const uniqueRoleIds = [...new Set(roleIds)];
  uniqueRoleIds.forEach((roleId) => ensureObjectId(roleId, "roleId"));
  await ensureReferences({ userId, teamId, roleIds: uniqueRoleIds });

  const membership = await TeamMembership.create({
    userId,
    teamId,
    roleIds: uniqueRoleIds
  });
  const populatedMembership = await TeamMembership.findById(membership._id)
    .populate("userId", "name email")
    .populate("teamId", "name description")
    .populate("roleIds", "name permissions");

  res.status(201).json(populatedMembership);
});

export const getMemberships = asyncHandler(async (req, res) => {
  const { userId, teamId } = req.query;
  const filter = {};

  if (userId) {
    filter.userId = userId;
  }

  if (teamId) {
    filter.teamId = teamId;
  }

  const memberships = await TeamMembership.find(filter)
    .populate("userId", "name email")
    .populate("teamId", "name description")
    .populate("roleIds", "name permissions")
    .sort({ createdAt: -1 });

  res.json(memberships);
});

export const updateMembership = asyncHandler(async (req, res) => {
  const { membershipId } = req.params;
  const { roleIds } = req.body;

  if (!Array.isArray(roleIds) || roleIds.length === 0) {
    res.status(400);
    throw new Error("At least one roleId is required");
  }

  const uniqueRoleIds = [...new Set(roleIds)];
  uniqueRoleIds.forEach((roleId) => ensureObjectId(roleId, "roleId"));

  const roles = await Role.find({ _id: { $in: uniqueRoleIds } });
  if (roles.length !== uniqueRoleIds.length) {
    res.status(404);
    throw new Error("One or more roles were not found");
  }

  const membership = await TeamMembership.findByIdAndUpdate(
    membershipId,
    { roleIds: uniqueRoleIds },
    { new: true, runValidators: true }
  )
    .populate("userId", "name email")
    .populate("teamId", "name description")
    .populate("roleIds", "name permissions");

  if (!membership) {
    res.status(404);
    throw new Error("Membership not found");
  }

  res.json(membership);
});

export const deleteMembership = asyncHandler(async (req, res) => {
  const { membershipId } = req.params;

  const membership = await TeamMembership.findByIdAndDelete(membershipId);

  if (!membership) {
    res.status(404);
    throw new Error("Membership not found");
  }

  res.json({ message: "Membership removed successfully" });
});
