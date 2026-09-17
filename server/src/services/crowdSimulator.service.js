import { GATE_IDS } from "../utils/stadiumConfig.js";

// In-memory live state: { gateId: congestionLevel (0-100) }
const state = {};
GATE_IDS.forEach((id, i) => {
  // Stagger starting levels so the map doesn't look uniform on boot
  state[id] = 15 + ((i * 7) % 20);
});

let tick = 0;

// Scripted surge windows (tick ranges) to simulate real match-day patterns:
// gates flooding pre-kickoff, and again at halftime for concessions/restrooms.
const SURGE_WINDOWS = [
  { start: 0, end: 15, gates: ["gate-1", "gate-3", "gate-5"], boost: 3.5 },   // pre-kickoff rush
  { start: 40, end: 55, gates: ["gate-2", "gate-4", "gate-7"], boost: 4 },    // halftime rush
];

function randomWalk(current, boost = 0) {
  const drift = (Math.random() - 0.45) * 8 + boost; // slight upward bias when boosted
  const next = current + drift;
  return Math.max(5, Math.min(100, Math.round(next)));
}

export function stepSimulation() {
  tick += 1;
  const activeSurge = SURGE_WINDOWS.find((w) => tick >= w.start && tick <= w.end);

  for (const gateId of GATE_IDS) {
    const boost = activeSurge?.gates.includes(gateId) ? activeSurge.boost : 0;
    state[gateId] = randomWalk(state[gateId], boost);
  }

  // Loop the scenario so a long-running demo keeps showing surges
  if (tick > 70) tick = 0;

  return getSnapshot();
}

export function getSnapshot() {
  return GATE_IDS.map((gateId) => ({ gateId, level: state[gateId] }));
}
