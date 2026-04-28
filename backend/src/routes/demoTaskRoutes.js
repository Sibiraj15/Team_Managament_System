import express from "express";
import {
  createDemoTask,
  deleteDemoTask,
  getDemoTasks,
  updateDemoTask
} from "../controllers/demoTaskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requirePermissions } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/", protect, requirePermissions("VIEW_ONLY"), getDemoTasks);
router.post("/", protect, requirePermissions("CREATE_TASK"), createDemoTask);
router.patch("/:taskId", protect, requirePermissions("EDIT_TASK"), updateDemoTask);
router.delete("/:taskId", protect, requirePermissions("DELETE_TASK"), deleteDemoTask);

export default router;
