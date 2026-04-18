import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "HelpRequest" },
    body: { type: String, required: true },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
