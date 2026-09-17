function levelColor(level) {
  if (level > 80) return "text-red-400";
  if (level > 65) return "text-amber-400";
  return "text-emerald-400";
}

export default function Ticker({ gates, crowdByGate }) {
  const items = gates.map((g) => (
    <span key={g.id} className="inline-flex items-center gap-2 px-6 font-mono text-sm">
      <span className="text-neutral-400">{g.name.replace("Gate ", "G")}</span>
      <span className={levelColor(crowdByGate[g.id] ?? 0)}>{crowdByGate[g.id] ?? "—"}%</span>
    </span>
  ));

  return (
    <div className="bg-[var(--color-ink)] overflow-hidden border-b border-white/10">
      <div className="ticker-track flex whitespace-nowrap py-2 w-max">
        {items}
        {items}
      </div>
    </div>
  );
}
