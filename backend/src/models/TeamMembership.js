import mongoose from "mongoose";

const teamMembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    roleIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

teamMembershipSchema.path("roleIds").validate(function validateRoleIds(roleIds) {
  return Array.isArray(roleIds) && roleIds.length > 0;
}, "At least one role is required");

teamMembershipSchema.index({ userId: 1, teamId: 1 }, { unique: true });

export const TeamMembership = mongoose.model("TeamMembership", teamMembershipSchema);
