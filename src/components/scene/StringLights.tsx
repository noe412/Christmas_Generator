import { memo } from "react";

const COLORS = ["#ffd36b", "#ff6b6b", "#7fd1ff", "#b7f774", "#ffa7e1"];
const BULBS = Array.from({ length: 24 }, (_, i) => {
  const x = 20 + i * 40;
  // Bulbs hang along three gentle swags across the ceiling.
  const t = ((x - 20) % 320) / 320;
  return { x, y: 14 + Math.sin(t * Math.PI) * 26 };
});

/** Festive string lights draped along the top of the room. */
export const StringLights = memo(function StringLights({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 980 60" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <path d="M0 14q160 54 320 0q160 54 320 0q170 54 340 0" fill="none" stroke="#1b1410" strokeWidth="2" />
      {BULBS.map((b, i) => (
        <g key={i}>
          <rect x={b.x - 2} y={b.y - 2} width="4" height="5" fill="#2b2420" />
          <ellipse
            cx={b.x}
            cy={b.y + 8}
            rx="4.5"
            ry="7"
            fill={COLORS[i % COLORS.length]}
            className="animate-twinkle"
            style={{ animationDelay: `${(i * 0.41) % 2.2}s`, animationDuration: "2.6s" }}
          />
        </g>
      ))}
    </svg>
  );
});
