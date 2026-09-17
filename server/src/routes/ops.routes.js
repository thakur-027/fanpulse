import { Router } from "express";
import Incident from "../models/Incident.model.js";
import { protect, requireRole } from "../utils/auth.middleware.js";
import { generateOpsSummary } from "../services/gemini.service.js";
import { getSnapshot } from "../services/crowdSimulator.service.js";

const router = Router();
router.use(protect, requireRole("volunteer", "organizer"));

router.get("/incidents", async (req, res) => {
  const incidents = await Incident.find().sort({ createdAt: -1 }).limit(50);
  res.json(incidents);
});

router.post("/incidents", async (req, res) => {
  const incident = await Incident.create({ ...req.body, reportedBy: req.user.id });
  req.app.get("io").emit("incident:new", incident);
  res.status(201).json(incident);
});

router.patch("/incidents/:id", async (req, res) => {
  const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
  req.app.get("io").emit("incident:update", incident);
  res.json(incident);
});

router.get("/briefing", async (req, res) => {
  try {
    const recentIncidents = await Incident.find({ status: { $ne: "resolved" } })
      .sort({ createdAt: -1 })
      .limit(10);
    const summary = await generateOpsSummary({
      crowdSnapshot: getSnapshot(),
      recentIncidents,
    });
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Briefing generation failed", error: err.message });
  }
});

export default router;
