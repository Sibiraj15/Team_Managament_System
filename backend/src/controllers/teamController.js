import { Team } from "../models/Team.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Team name is required");
  }

  const team = await Team.create({
    name,
    description: description || ""
  });

  res.status(201).json(team);
});

export const getTeams = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 5, 1);

  const [teams, totalItems] = await Promise.all([
    Team.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Team.countDocuments()
  ]);

  res.json({
    items: teams,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber)
    }
  });
});

export const updateTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Team name is required");
  }

  const team = await Team.findByIdAndUpdate(
    teamId,
    {
      name,
      description: description || ""
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  res.json(team);
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findByIdAndDelete(teamId);

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  res.json({ message: "Team deleted successfully" });
});
