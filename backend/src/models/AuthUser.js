import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const authUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    }
  },
  {
    timestamps: true
  }
);

authUserSchema.pre("save", async function savePassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

authUserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const AuthUser = mongoose.model("AuthUser", authUserSchema);
