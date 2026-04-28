import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const user = await User.create({ name, email });
  res.status(201).json(user);
});

export const getUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 5 } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 5, 1);

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    : {};

  const [users, totalItems] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    User.countDocuments(filter)
  ]);

  res.json({
    items: users,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber)
    }
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      name,
      email
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ message: "User deleted successfully" });
});
