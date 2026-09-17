import { useState } from "react";
import api from "../lib/api";

const TYPES = ["congestion", "medical", "security", "lost_person", "facility", "other"];

export default function IncidentFeed({ incidents, onCreated }) {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("congestion");
  const [severity, setSeverity] = useState("medium");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post("/ops/incidents", { description, type, severity });
      onCreated?.(res.data);
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
      <h2 className="font-display text-lg tracking-wide uppercase mb-4">Incident Log</h2>

      <form onSubmit={submit} className="space-y-2 mb-4">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's happening?"
          className="w-full text-sm px-3 py-2 rounded-lg border border-black/10 outline-none focus:border-[var(--color-turf)]"
        />
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-black/10"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-black/10"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-ink)] text-white text-xs font-medium disabled:opacity-50"
          >
            Log
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {incidents.length === 0 && (
          <p className="text-sm text-neutral-400">No incidents logged yet.</p>
        )}
        {incidents.map((inc) => (
          <div key={inc._id} className="text-sm border-b border-black/5 pb-2 last:border-0">
            <div className="flex items-center justify-between">
              <span className="font-medium">{inc.description}</span>
              <span
                className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                  inc.status === "resolved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {inc.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {inc.type} · {inc.severity} · {new Date(inc.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
