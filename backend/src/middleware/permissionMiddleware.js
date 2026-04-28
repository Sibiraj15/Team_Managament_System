import { getResolvedPermissions } from "../services/permissionService.js";

const getTeamIdFromRequest = (req) =>
  req.params.teamId || req.query.teamId || req.body.teamId || req.headers["x-team-id"];

const getUserIdFromRequest = (req) =>
  req.query.userId || req.body.userId || req.headers["x-user-id"] || req.user?._id;

export const requirePermissions = (...requiredPermissions) => async (req, res, next) => {
  try {
    const teamId = getTeamIdFromRequest(req);
    const userId = getUserIdFromRequest(req);

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!teamId) {
      return res.status(400).json({ message: "teamId is required for permission checks" });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is required for permission checks" });
    }

    const resolved = await getResolvedPermissions({
      userId,
      teamId
    });

    const hasAllPermissions = requiredPermissions.every((permission) =>
      resolved.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        message: `Missing required permission: ${requiredPermissions.join(", ")}`
      });
    }

    req.resolvedRole = resolved.roles[0] || null;
    req.resolvedRoles = resolved.roles;
    req.resolvedPermissions = resolved.permissions;
    next();
  } catch (error) {
    next(error);
  }
};
