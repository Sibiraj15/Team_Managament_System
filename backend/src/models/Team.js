import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);

export const Team = mongoose.model("Team", teamSchema);
