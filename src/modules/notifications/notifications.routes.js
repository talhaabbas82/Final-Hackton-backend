import express from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { Notification } from "../../models/Notification.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const docs = await Notification.find({ userId: req.auth.userId }).sort({
    createdAt: -1,
  });
  return res.json({
    notifications: docs.map((item) => ({
      id: item._id,
      title: item.title,
      meta: `${item.type} • ${item.createdAt.toISOString()}`,
      read: item.isRead,
      message: item.message,
    })),
  });
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  const doc = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.auth.userId },
    { isRead: true },
    { new: true },
  );
  if (!doc) return res.status(404).json({ message: "Notification not found." });
  return res.json({ notification: doc });
});

export { router as notificationsRouter };
