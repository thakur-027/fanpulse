import { stepSimulation } from "../services/crowdSimulator.service.js";
import { analyzeCrowdSnapshot } from "../services/gemini.service.js";

const TICK_MS = 4000; // simulate a new crowd reading every 4s
const ANALYSIS_EVERY_N_TICKS = 3; // call Gemini less often than raw ticks to save quota

export function registerCrowdSocket(io) {
  let tickCount = 0;

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on("disconnect", () => console.log(`Client disconnected: ${socket.id}`));
  });

  setInterval(async () => {
    tickCount += 1;
    const snapshot = stepSimulation();
    io.emit("crowd:update", snapshot);

    if (tickCount % ANALYSIS_EVERY_N_TICKS === 0) {
      try {
        const analysis = await analyzeCrowdSnapshot(snapshot);
        io.emit("ops:alerts", analysis);
      } catch (err) {
        console.error("Gemini crowd analysis failed:", err.message);
      }
    }
  }, TICK_MS);
}
