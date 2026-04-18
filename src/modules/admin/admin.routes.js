import express from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { HelpRequest } from "../../models/Request.js";
import { User } from "../../models/User.js";

const router = express.Router();

router.get("/analytics", requireAuth, async (_req, res) => {
  const [users, requests, solved] = await Promise.all([
    User.countDocuments(),
    HelpRequest.countDocuments(),
    HelpRequest.countDocuments({ status: "Solved" }),
  ]);

  return res.json({
    analytics: {
      users,
      requests,
      solved,
      solveRate: requests ? Math.round((solved / requests) * 100) : 0,
    },
  });
});

router.patch("/requests/:id/moderate", requireAuth, async (req, res) => {
  const doc = await HelpRequest.findByIdAndUpdate(
    req.params.id,
    req.body || {},
    { new: true },
  );
  if (!doc) return res.status(404).json({ message: "Request not found." });
  return res.json({ request: doc });
});

export { router as adminRouter };
