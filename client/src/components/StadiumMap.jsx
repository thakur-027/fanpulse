function levelColor(level) {
  if (level > 80) return "var(--color-critical)";
  if (level > 65) return "var(--color-warn)";
  return "var(--color-turf)";
}

function levelLabel(level) {
  if (level > 80) return "Heavy";
  if (level > 65) return "Busy";
  if (level > 35) return "Moderate";
  return "Light";
}

export default function StadiumMap({ gates, crowdByGate, onSelectGate, selectedGateId }) {
  return (
    <div className="relative w-full aspect-square max-w-xl mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer bowl */}
        <ellipse cx="50" cy="50" rx="48" ry="48" fill="#e5e9ee" stroke="#c9d2db" strokeWidth="0.5" />
        {/* Pitch */}
        <ellipse cx="50" cy="50" rx="30" ry="20" fill="var(--color-turf-dark)" opacity="0.9" />
        <ellipse cx="50" cy="50" rx="30" ry="20" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
        <line x1="50" y1="30" x2="50" y2="70" stroke="white" strokeWidth="0.3" opacity="0.6" />
        <circle cx="50" cy="50" r="5" fill="none" stroke="white" strokeWidth="0.3" opacity="0.6" />
      </svg>

      {gates.map((gate) => {
        const level = crowdByGate[gate.id] ?? 20;
        const isSelected = selectedGateId === gate.id;
        return (
          <button
            key={gate.id}
            onClick={() => onSelectGate?.(gate.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
            style={{ left: `${gate.x}%`, top: `${gate.y}%` }}
            aria-label={`${gate.name}, ${levelLabel(level)} congestion`}
          >
            <span
              className={`block rounded-full border-2 border-white ${level > 65 ? "gate-pulse" : ""}`}
              style={{
                width: isSelected ? 18 : 14,
                height: isSelected ? 18 : 14,
                backgroundColor: levelColor(level),
                transition: "all 0.3s ease",
              }}
            />
            <span className="mt-1 text-[9px] font-mono px-1 rounded bg-white/90 shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {gate.name.replace("Gate ", "G")} · {level}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
