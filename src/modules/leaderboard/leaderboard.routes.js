import express from "express";
import { User } from "../../models/User.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await User.find()
    .sort({ trustScore: -1, contributionCount: -1 })
    .limit(20);
  return res.json({
    leaderboard: users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.fullName,
      trustScore: user.trustScore,
      contributions: user.contributionCount,
      skills: user.skills.join(", "),
      badges: user.badges,
    })),
  });
});

export { router as leaderboardRouter };
