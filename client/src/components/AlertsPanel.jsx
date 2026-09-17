const severityStyles = {
  watch: "border-l-emerald-400 bg-emerald-50",
  warning: "border-l-amber-400 bg-amber-50",
  critical: "border-l-red-400 bg-red-50",
};

export default function AlertsPanel({ alerts, overallStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg tracking-wide uppercase">AI Ops Alerts</h2>
        {overallStatus && (
          <span
            className={`text-[10px] font-mono uppercase px-2 py-1 rounded-full ${
              overallStatus === "critical"
                ? "bg-red-100 text-red-700"
                : overallStatus === "elevated"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {overallStatus}
          </span>
        )}
      </div>

      {(!alerts || alerts.length === 0) && (
        <p className="text-sm text-neutral-400">No active alerts — all gates flowing normally.</p>
      )}

      <div className="space-y-2.5 max-h-[340px] overflow-y-auto">
        {alerts?.map((alert, i) => (
          <div
            key={i}
            className={`border-l-4 rounded-r-lg px-3.5 py-2.5 ${severityStyles[alert.severity] || "border-l-neutral-300 bg-neutral-50"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium">{alert.gateId}</span>
              <span className="text-[10px] uppercase tracking-wide text-neutral-500">{alert.severity}</span>
            </div>
            <p className="text-sm mt-1">{alert.message}</p>
            <p className="text-xs text-neutral-500 mt-1">→ {alert.suggestedAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
