import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Need Help", "Can Help", "Both"],
      default: "Both",
    },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    location: { type: String, default: "Karachi" },
    trustScore: { type: Number, default: 70 },
    badges: { type: [String], default: [] },
    contributionCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
