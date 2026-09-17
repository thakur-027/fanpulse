// Mock stadium model — stand-in for a FIFA World Cup 2026 venue.
// In production this would be seeded per-venue (e.g. each of the 16 host stadiums).

export const STADIUM = {
  name: "Continental Arena",
  capacity: 68000,
};

export const GATES = [
  { id: "gate-1", name: "Gate 1 - North", capacity: 9000, accessible: true, x: 50, y: 5 },
  { id: "gate-2", name: "Gate 2 - North East", capacity: 8000, accessible: false, x: 80, y: 15 },
  { id: "gate-3", name: "Gate 3 - East", capacity: 9500, accessible: true, x: 95, y: 50 },
  { id: "gate-4", name: "Gate 4 - South East", capacity: 8500, accessible: false, x: 80, y: 85 },
  { id: "gate-5", name: "Gate 5 - South", capacity: 9000, accessible: true, x: 50, y: 95 },
  { id: "gate-6", name: "Gate 6 - South West", capacity: 8500, accessible: true, x: 20, y: 85 },
  { id: "gate-7", name: "Gate 7 - West", capacity: 9500, accessible: false, x: 5, y: 50 },
  { id: "gate-8", name: "Gate 8 - North West", capacity: 6000, accessible: true, x: 20, y: 15 },
];

export const FACILITIES = [
  { id: "fac-1", type: "restroom", name: "Restroom - Concourse A", accessible: true, nearGate: "gate-1" },
  { id: "fac-2", type: "restroom", name: "Restroom - Concourse B", accessible: false, nearGate: "gate-3" },
  { id: "fac-3", type: "restroom", name: "Restroom - Concourse C (Accessible)", accessible: true, nearGate: "gate-5" },
  { id: "fac-4", type: "medical", name: "First Aid Post 1", accessible: true, nearGate: "gate-2" },
  { id: "fac-5", type: "medical", name: "First Aid Post 2", accessible: true, nearGate: "gate-6" },
  { id: "fac-6", type: "food", name: "Food Court - East", accessible: true, nearGate: "gate-3" },
  { id: "fac-7", type: "food", name: "Food Court - West", accessible: true, nearGate: "gate-7" },
  { id: "fac-8", type: "prayer_room", name: "Multi-faith Prayer Room", accessible: true, nearGate: "gate-8" },
  { id: "fac-9", type: "family", name: "Family & Nursing Room", accessible: true, nearGate: "gate-1" },
  { id: "fac-10", type: "lost_found", name: "Lost & Found Desk", accessible: true, nearGate: "gate-5" },
];

export const GATE_IDS = GATES.map((g) => g.id);
