import express from "express";
import { getPermissionsForUserInTeam } from "../controllers/permissionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getPermissionsForUserInTeam);

export default router;
