import { Router } from "express";
import { getWayfindingAnswer } from "../services/gemini.service.js";
import { getSnapshot } from "../services/crowdSimulator.service.js";
import { GATES, FACILITIES } from "../utils/stadiumConfig.js";

const router = Router();

// Public: fans don't need to log in to ask directions
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "question is required" });
    }
    const answer = await getWayfindingAnswer({
      question,
      crowdSnapshot: getSnapshot(),
    });
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: "Assistant failed to respond", error: err.message });
  }
});

// Static reference data for the map UI
router.get("/stadium", (req, res) => {
  res.json({ gates: GATES, facilities: FACILITIES });
});

export default router;
