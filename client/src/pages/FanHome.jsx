import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { socket } from "../lib/socket";
import StadiumMap from "../components/StadiumMap";
import ChatPanel from "../components/ChatPanel";

export default function FanHome() {
  const [gates, setGates] = useState([]);
  const [crowdByGate, setCrowdByGate] = useState({});
  const [selectedGateId, setSelectedGateId] = useState(null);

  useEffect(() => {
    api.get("/chat/stadium").then((res) => setGates(res.data.gates));

    function handleUpdate(snapshot) {
      setCrowdByGate((prev) => {
        const next = { ...prev };
        snapshot.forEach((s) => (next[s.gateId] = s.level));
        return next;
      });
    }
    socket.on("crowd:update", handleUpdate);
    return () => socket.off("crowd:update", handleUpdate);
  }, []);

  const selectedGate = gates.find((g) => g.id === selectedGateId);

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-turf)] gate-pulse" />
            <span className="font-display text-xl tracking-wide">
              Fan<span className="text-[var(--color-turf)]">Pulse</span>
            </span>
          </div>
          <Link
            to="/ops"
            className="text-xs font-medium text-neutral-500 hover:text-[var(--color-ink)] transition-colors"
          >
            Staff / Ops login →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-gold)] mb-2">
            Continental Arena · Live
          </p>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight max-w-xl">
            Your AI companion for match day.
          </h1>
          <p className="text-neutral-500 mt-2 max-w-lg text-sm">
            Real-time gate congestion, accessible routing, and answers in your language —
            all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
            <h2 className="font-display text-lg tracking-wide uppercase mb-1">Live Gate Map</h2>
            <p className="text-xs text-neutral-500 mb-4">Tap a gate for live status</p>
            <StadiumMap
              gates={gates}
              crowdByGate={crowdByGate}
              onSelectGate={setSelectedGateId}
              selectedGateId={selectedGateId}
            />
            {selectedGate && (
              <div className="mt-4 p-3 rounded-xl bg-neutral-50 text-sm">
                <p className="font-medium">{selectedGate.name}</p>
                <p className="text-neutral-500 text-xs mt-0.5">
                  Congestion: <span className="font-mono">{crowdByGate[selectedGate.id] ?? "—"}%</span>
                  {selectedGate.accessible && " · Wheelchair accessible"}
                </p>
              </div>
            )}
            <div className="flex gap-4 mt-4 text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-turf)]" /> Light/Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-warn)]" /> Busy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-critical)]" /> Heavy
              </span>
            </div>
          </div>

          <div className="h-[560px]">
            <ChatPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
