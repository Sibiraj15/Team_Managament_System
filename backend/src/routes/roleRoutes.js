import express from "express";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
  updateRolePermissions
} from "../controllers/roleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createRole).get(protect, getRoles);
router.route("/:roleId").patch(protect, updateRole).delete(protect, deleteRole);
router.patch("/:roleId/permissions", protect, updateRolePermissions);

export default router;
