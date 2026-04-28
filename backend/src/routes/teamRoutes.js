import express from "express";
import { createTeam, deleteTeam, getTeams, updateTeam } from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTeam).get(protect, getTeams);
router.route("/:teamId").patch(protect, updateTeam).delete(protect, deleteTeam);

export default router;
