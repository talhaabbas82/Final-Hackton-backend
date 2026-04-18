import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env.js";
import { User } from "../../models/User.js";

const router = express.Router();

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["Need Help", "Can Help", "Both"]).default("Both"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const serializeUser = (user) => ({
  id: user._id,
  name: user.fullName,
  email: user.email,
  role: user.role,
  location: user.location,
  skills: user.skills,
  interests: user.interests,
  trustScore: user.trustScore,
  badges: user.badges,
  contributions: user.contributionCount,
});

const issueToken = (user) =>
  jwt.sign({ userId: user._id, email: user.email }, env.jwtSecret, {
    expiresIn: "7d",
  });

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid signup payload." });
  }
  const existing = await User.findOne({
    email: parsed.data.email.toLowerCase(),
  });
  if (existing) {
    return res.status(409).json({ message: "Email already exists." });
  }
  const hash = await bcrypt.hash(parsed.data.password, 10);
  const user = await User.create({
    fullName: parsed.data.fullName,
    email: parsed.data.email.toLowerCase(),
    passwordHash: hash,
    role: parsed.data.role,
  });
  return res
    .status(201)
    .json({ token: issueToken(user), user: serializeUser(user) });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid login payload." });
  }
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  return res.json({ token: issueToken(user), user: serializeUser(user) });
});

router.post("/demo-session", async (_req, res) => {
  const user = await User.findOne({ email: "community@helphub.ai" });
  if (!user) return res.status(404).json({ message: "Demo user not found." });
  return res.json({ token: issueToken(user), user: serializeUser(user) });
});

export { router as authRouter, serializeUser };
