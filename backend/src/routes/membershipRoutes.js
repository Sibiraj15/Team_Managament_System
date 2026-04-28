import express from "express";
import {
  createMembership,
  deleteMembership,
  getMemberships,
  updateMembership
} from "../controllers/membershipController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requirePermissions } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createMembership).get(protect, getMemberships);
router
  .route("/:membershipId")
  .patch(protect, updateMembership)
  .delete(protect, deleteMembership);
router.post("/guarded", protect, requirePermissions("ASSIGN_ROLES"), createMembership);

export default router;
