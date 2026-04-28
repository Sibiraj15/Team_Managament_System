import { AuthUser } from "../models/AuthUser.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const formatAuthUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await AuthUser.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("email already exists");
  }

  const user = await AuthUser.create({ name, email, password });

  res.status(201).json({
    user: formatAuthUser(user),
    token: generateToken(user._id)
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await AuthUser.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user: formatAuthUser(user),
    token: generateToken(user._id)
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});
