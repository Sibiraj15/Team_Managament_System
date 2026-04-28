import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured. Add it to backend/.env");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};
