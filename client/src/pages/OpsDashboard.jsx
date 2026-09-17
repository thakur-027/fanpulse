import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { socket } from "../lib/socket";
import StadiumMap from "../components/StadiumMap";
import Ticker from "../components/Ticker";
import AlertsPanel from "../components/AlertsPanel";
import IncidentFeed from "../components/IncidentFeed";

export default function OpsDashboard() {
  const { user, logout } = useAuth();
  const [gates, setGates] = useState([]);
  const [crowdByGate, setCrowdByGate] = useState({});
  const [alertData, setAlertData] = useState({ alerts: [], overallStatus: "normal" });
  const [incidents, setIncidents] = useState([]);
  const [briefing, setBriefing] = useState("");
  const [briefingLoading, setBriefingLoading] = useState(false);

  useEffect(() => {
    api.get("/chat/stadium").then((res) => setGates(res.data.gates));
    api.get("/ops/incidents").then((res) => setIncidents(res.data));

    function handleCrowd(snapshot) {
      setCrowdByGate((prev) => {
        const next = { ...prev };
        snapshot.forEach((s) => (next[s.gateId] = s.level));
        return next;
      });
    }
    function handleAlerts(data) {
      setAlertData(data);
    }
    function handleIncidentNew(inc) {
      setIncidents((prev) => [inc, ...prev]);
    }

    socket.on("crowd:update", handleCrowd);
    socket.on("ops:alerts", handleAlerts);
    socket.on("incident:new", handleIncidentNew);
    return () => {
      socket.off("crowd:update", handleCrowd);
      socket.off("ops:alerts", handleAlerts);
      socket.off("incident:new", handleIncidentNew);
    };
  }, []);

  async function getBriefing() {
    setBriefingLoading(true);
    try {
      const res = await api.get("/ops/briefing");
      setBriefing(res.data.summary);
    } finally {
      setBriefingLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-mist)]">
      <Ticker gates={gates} crowdByGate={crowdByGate} />

      <header className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-display text-xl tracking-wide">
              Ops<span className="text-[var(--color-turf)]">Control</span>
            </span>
            <p className="text-xs text-neutral-500 mt-0.5">
              Signed in as {user?.name} · {user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-xs font-medium text-neutral-500 hover:text-[var(--color-ink)]"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <h2 className="font-display text-lg tracking-wide uppercase mb-1">Live Crowd Map</h2>
          <p className="text-xs text-neutral-500 mb-4">Updates every ~4s</p>
          <StadiumMap gates={gates} crowdByGate={crowdByGate} />
        </div>

        <AlertsPanel alerts={alertData.alerts} overallStatus={alertData.overallStatus} />

        <IncidentFeed
          incidents={incidents}
          onCreated={(inc) => setIncidents((prev) => [inc, ...prev])}
        />

        <div className="lg:col-span-3 bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg tracking-wide uppercase">Shift Briefing</h2>
            <button
              onClick={getBriefing}
              disabled={briefingLoading}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-ink)] text-white disabled:opacity-50"
            >
              {briefingLoading ? "Generating…" : "Generate AI briefing"}
            </button>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {briefing || "Click \"Generate AI briefing\" for a natural-language summary of current conditions, ready to read aloud at shift handover."}
          </p>
        </div>
      </main>
    </div>
  );
}
