import express from "express";
import { z } from "zod";
import { requireAuth } from "../../middlewares/auth.js";
import { Message } from "../../models/Message.js";
import { User } from "../../models/User.js";

const router = express.Router();

const messageSchema = z.object({
  toUserId: z.string().min(10),
  requestId: z.string().optional(),
  body: z.string().min(1),
});

router.get("/", requireAuth, async (req, res) => {
  const docs = await Message.find({
    $or: [{ fromUserId: req.auth.userId }, { toUserId: req.auth.userId }],
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("fromUserId")
    .populate("toUserId");

  return res.json({
    messages: docs.map((item) => ({
      id: item._id,
      from: item.fromUserId?.fullName || "Unknown",
      to: item.toUserId?.fullName || "Unknown",
      body: item.body,
      time: item.createdAt,
    })),
  });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid message payload." });
  const target = await User.findById(parsed.data.toUserId);
  if (!target)
    return res.status(404).json({ message: "Target user not found." });
  const doc = await Message.create({
    fromUserId: req.auth.userId,
    toUserId: parsed.data.toUserId,
    requestId: parsed.data.requestId,
    body: parsed.data.body,
  });
  return res.status(201).json({ message: doc });
});

export { router as messagesRouter };
