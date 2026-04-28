import { getResolvedPermissions } from "../services/permissionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPermissionsForUserInTeam = asyncHandler(async (req, res) => {
  const { userId, teamId } = req.query;

  if (!userId || !teamId) {
    res.status(400);
    throw new Error("userId and teamId are required");
  }

  const resolved = await getResolvedPermissions({ userId, teamId });

  res.json({
    userId,
    teamId,
    role: resolved.roles[0] || null,
    roles: resolved.roles,
    ...resolved
  });
});
