import express from "express";
import { z } from "zod";
import { requireAuth } from "../../middlewares/auth.js";
import { User } from "../../models/User.js";
import { serializeUser } from "../auth/auth.routes.js";

const router = express.Router();

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  role: z.enum(["Need Help", "Can Help", "Both"]).optional(),
  location: z.string().min(2).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.auth.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ user: serializeUser(user) });
});

router.patch("/me", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid profile payload." });
  const user = await User.findByIdAndUpdate(req.auth.userId, parsed.data, {
    new: true,
  });
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ user: serializeUser(user) });
});

export { router as usersRouter };
