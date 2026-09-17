import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    gateId: { type: String },
    type: {
      type: String,
      enum: ["medical", "congestion", "security", "lost_person", "facility", "other"],
      default: "other",
    },
    description: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);
