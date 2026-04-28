import mongoose from "mongoose";
import { PERMISSIONS } from "../constants/permissions.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    permissions: [
      {
        type: String,
        enum: PERMISSIONS
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Role = mongoose.model("Role", roleSchema);
