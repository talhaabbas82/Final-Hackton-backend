import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    urgency: { type: String, enum: ["Low", "Medium", "High"], required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["Open", "Solved"], default: "Open" },
    helperIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    aiSummary: { type: String, default: "" },
    aiMeta: {
      suggestedCategory: String,
      detectedUrgency: String,
      suggestedTags: [String],
      rewriteSuggestion: String,
    },
    location: { type: String, default: "Remote" },
  },
  { timestamps: true },
);

export const HelpRequest = mongoose.model("HelpRequest", requestSchema);
