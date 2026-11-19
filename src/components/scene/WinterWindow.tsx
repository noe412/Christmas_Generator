import { memo } from "react";
import { seeded } from "@/lib/seeded";

const rand = seeded(7);
const FLAKES = Array.from({ length: 34 }, () => ({
  x: rand() * 220 + 10,
  y: rand() * 60 - 40,
  r: 1 + rand() * 2.2,
  dur: 6 + rand() * 6,
  delay: -rand() * 12,
}));
const STARS = Array.from({ length: 14 }, () => ({ x: 20 + rand() * 200, y: 20 + rand() * 110, r: 0.6 + rand() * 1.1 }));

/** Arched window looking out on a snowy night with moon, stars and falling snow. */
export const WinterWindow = memo(function WinterWindow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 300" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="win-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1430" />
          <stop offset=".7" stopColor="#24366b" />
          <stop offset="1" stopColor="#4d5f9a" />
        </linearGradient>
        <radialGradient id="win-moon-glow">
          <stop offset="0" stopColor="#fff7d6" stopOpacity=".6" />
          <stop offset="1" stopColor="#fff7d6" stopOpacity="0" />
        </radialGradient>
        <clipPath id="win-pane">
          <path d="M20 290V110a100 100 0 0 1 200 0v180z" />
        </clipPath>
      </defs>

      <g clipPath="url(#win-pane)">
        <rect width="240" height="300" fill="url(#win-sky)" />
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fff"
            className="animate-twinkle"
            style={{ animationDelay: `${i * 0.3}s`, animationDuration: "3.5s" }}
          />
        ))}
        <circle cx="170" cy="70" r="40" fill="url(#win-moon-glow)" />
        <circle cx="170" cy="70" r="17" fill="#fff4cf" />
        <circle cx="163" cy="66" r="3" fill="#e9dcae" />
        <circle cx="176" cy="76" r="2" fill="#e9dcae" />
        {/* Snowy hills with pines */}
        <path d="M0 250q60-40 120-10t120-20v80H0z" fill="#c9d6f0" />
        <path d="M0 270q70-30 140-5t100-5v40H0z" fill="#eef3ff" />
        {[
          [52, 236, 1],
          [78, 244, 0.8],
          [190, 232, 1.1],
        ].map(([x, y, s]) => (
          <path
            key={x}
            d={`M${x} ${y - 46 * s}l${-16 * s} ${46 * s}h${32 * s}z`}
            fill="#1d3b4a"
            stroke="#eef3ff"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
        ))}
        {FLAKES.map((f, i) => (
          <circle
            key={i}
            cx={f.x}
            cy={f.y}
            r={f.r}
            fill="#fff"
            opacity=".9"
            style={{ animation: `window-snow ${f.dur}s linear ${f.delay}s infinite` }}
          />
        ))}
      </g>

      {/* Frame */}
      <path d="M20 290V110a100 100 0 0 1 200 0v180z" fill="none" stroke="#5b3a26" strokeWidth="12" />
      <path d="M120 12v278M20 175h200" stroke="#5b3a26" strokeWidth="7" />
      <path d="M20 290V110a100 100 0 0 1 200 0v180z" fill="none" stroke="#8a5a3b" strokeWidth="3" />
      {/* Snow on the sill */}
      <rect x="6" y="284" width="228" height="14" rx="4" fill="#6b4630" />
      <path d="M14 286q20-8 40-2t40-1 40 2 40-3 40 2v4H14z" fill="#f4f7ff" />
    </svg>
  );
});
