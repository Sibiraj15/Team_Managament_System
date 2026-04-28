import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import demoTaskRoutes from "./routes/demoTaskRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/demo/tasks", demoTaskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
