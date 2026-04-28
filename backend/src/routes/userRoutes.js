import express from "express";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createUser).get(protect, getUsers);
router.route("/:userId").patch(protect, updateUser).delete(protect, deleteUser);

export default router;
