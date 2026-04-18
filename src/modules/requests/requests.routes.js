import express from "express";
import { z } from "zod";
import { requireAuth } from "../../middlewares/auth.js";
import { Notification } from "../../models/Notification.js";
import { HelpRequest } from "../../models/Request.js";
import { analyzeRequest } from "../../shared/aiEngine.js";

const router = express.Router();

const requestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.string().optional(),
  urgency: z.enum(["Low", "Medium", "High"]).optional(),
  tags: z.array(z.string()).default([]),
  location: z.string().optional(),
});

function formatRequest(item) {
  return {
    id: item._id,
    title: item.title,
    description: item.description,
    category: item.category,
    urgency: item.urgency,
    status: item.status,
    tags: item.tags,
    requesterName: item.requesterId?.fullName || "Unknown",
    requesterId: item.requesterId?._id,
    location: item.location,
    helpersInterested: item.helperIds?.length || 0,
    helperNames: (item.helperIds || []).map((helper) => helper.fullName),
    aiSummary: item.aiSummary,
    aiMeta: item.aiMeta,
  };
}

router.get("/", async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.urgency) query.urgency = req.query.urgency;
  if (req.query.status) query.status = req.query.status;
  const docs = await HelpRequest.find(query)
    .populate("requesterId")
    .populate("helperIds")
    .sort({ createdAt: -1 });
  return res.json({ requests: docs.map(formatRequest) });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid request payload." });
  const ai = analyzeRequest(parsed.data.title, parsed.data.description);
  const doc = await HelpRequest.create({
    requesterId: req.auth.userId,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category || ai.suggestedCategory,
    urgency: parsed.data.urgency || ai.detectedUrgency,
    tags: parsed.data.tags?.length ? parsed.data.tags : ai.suggestedTags,
    status: "Open",
    aiSummary: ai.rewriteSuggestion,
    aiMeta: ai,
    location: parsed.data.location || "Remote",
  });
  const populated = await HelpRequest.findById(doc._id)
    .populate("requesterId")
    .populate("helperIds");
  return res.status(201).json({ request: formatRequest(populated) });
});

router.get("/:id", async (req, res) => {
  const item = await HelpRequest.findById(req.params.id)
    .populate("requesterId")
    .populate("helperIds");
  if (!item) return res.status(404).json({ message: "Request not found." });
  return res.json({ request: formatRequest(item) });
});

router.patch("/:id", requireAuth, async (req, res) => {
  const parsed = requestSchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid request update payload." });
  const item = await HelpRequest.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
  })
    .populate("requesterId")
    .populate("helperIds");
  if (!item) return res.status(404).json({ message: "Request not found." });
  return res.json({ request: formatRequest(item) });
});

router.post("/:id/help", requireAuth, async (req, res) => {
  const item = await HelpRequest.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Request not found." });
  const set = new Set(item.helperIds.map((id) => String(id)));
  set.add(req.auth.userId);
  item.helperIds = [...set];
  await item.save();
  await Notification.create({
    userId: item.requesterId,
    type: "match",
    title: "A helper offered support on your request",
    message: "A community helper is ready to assist.",
  });
  const populated = await HelpRequest.findById(item._id)
    .populate("requesterId")
    .populate("helperIds");
  return res.json({ request: formatRequest(populated) });
});

router.post("/:id/solve", requireAuth, async (req, res) => {
  const item = await HelpRequest.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Request not found." });
  item.status = "Solved";
  await item.save();
  await Notification.create({
    userId: item.requesterId,
    type: "status",
    title: `"${item.title}" was marked as solved`,
    message: "A request status was updated to solved.",
  });
  const populated = await HelpRequest.findById(item._id)
    .populate("requesterId")
    .populate("helperIds");
  return res.json({ request: formatRequest(populated) });
});

export { router as requestsRouter };
