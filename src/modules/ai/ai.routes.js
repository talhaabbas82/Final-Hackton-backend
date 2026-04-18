import express from "express";
import { HelpRequest } from "../../models/Request.js";
import { analyzeRequest } from "../../shared/aiEngine.js";

const router = express.Router();

router.post("/analyze-request", async (req, res) => {
  const { title = "", description = "" } = req.body || {};
  return res.json({ ai: analyzeRequest(title, description) });
});

router.get("/insights", async (_req, res) => {
  const requests = await HelpRequest.find().sort({ createdAt: -1 }).limit(50);
  const highPriority = requests.filter(
    (item) => item.urgency === "High",
  ).length;
  const topCategory = requests.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const bestCategory =
    Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Community";

  return res.json({
    insights: {
      trendPulse: bestCategory,
      urgencyWatch: highPriority,
      mentorPool: 2,
      recommendations: requests.slice(0, 5).map((item) => ({
        id: item._id,
        title: item.title,
        summary: item.aiSummary,
        category: item.category,
        urgency: item.urgency,
      })),
    },
  });
});

export { router as aiRouter };
