import { memo } from "react";

const EMBERS = [
  { x: 146, delay: 0, drift: "-8px" },
  { x: 160, delay: 0.9, drift: "6px" },
  { x: 172, delay: 1.7, drift: "10px" },
  { x: 152, delay: 2.4, drift: "-4px" },
  { x: 168, delay: 1.2, drift: "-10px" },
];

/** Stone fireplace with animated flames, rising embers, candles and stockings. */
export const Fireplace = memo(function Fireplace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 -14 320 314" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fp-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b5550" />
          <stop offset="1" stopColor="#3d2e2c" />
        </linearGradient>
        <pattern id="fp-bricks" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 0H40M0 10H40M20 0V10M0 10V20M40 10V20" stroke="#000" strokeOpacity=".22" strokeWidth="1.5" />
        </pattern>
        <linearGradient id="fp-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a3b" />
          <stop offset="1" stopColor="#4e2f1d" />
        </linearGradient>
        <radialGradient id="fp-glow" cx=".5" cy=".85" r=".7">
          <stop offset="0" stopColor="#ffb347" stopOpacity=".95" />
          <stop offset=".5" stopColor="#ff6a1a" stopOpacity=".45" />
          <stop offset="1" stopColor="#3a0d05" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fp-flame-outer" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff4d1a" />
          <stop offset="1" stopColor="#ff9a2e" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="fp-flame-mid" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff8a1f" />
          <stop offset="1" stopColor="#ffd25a" stopOpacity=".5" />
        </linearGradient>
        <linearGradient id="fp-flame-core" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="1" stopColor="#ffd86b" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id="fp-stocking-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d23a44" />
          <stop offset="1" stopColor="#8f1d27" />
        </linearGradient>
        <linearGradient id="fp-stocking-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f8f6a" />
          <stop offset="1" stopColor="#1f5a40" />
        </linearGradient>
      </defs>

      {/* Chimney breast */}
      <rect x="22" y="40" width="276" height="252" fill="url(#fp-stone)" />
      <rect x="22" y="40" width="276" height="252" fill="url(#fp-bricks)" />

      {/* Firebox */}
      <path d="M72 292V152q0-40 40-40h96q40 0 40 40v140z" fill="#140a08" />
      <path
        d="M72 292V152q0-40 40-40h96q40 0 40 40v140z"
        fill="url(#fp-glow)"
        className="origin-base animate-flicker"
      />

      {/* Logs */}
      <rect x="104" y="262" width="112" height="16" rx="8" fill="#5a3420" transform="rotate(-8 160 270)" />
      <rect x="104" y="262" width="112" height="16" rx="8" fill="#6b3f27" transform="rotate(9 160 270)" />
      <circle cx="108" cy="276" r="7" fill="#c98a5a" opacity=".6" />

      {/* Flames */}
      <g>
        <path
          className="origin-base animate-flame"
          d="M160 270c-42 0-50-40-32-66 6 18 14 18 12 0-2-22 10-40 20-58 10 22 22 38 18 58-2 18 8 18 14 0 18 26 10 66-32 66z"
          fill="url(#fp-flame-outer)"
        />
        <path
          className="origin-base animate-flame"
          style={{ animationDelay: "-0.5s", animationDuration: "1.3s" }}
          d="M160 270c-30 0-36-28-22-48 4 12 10 12 9 0-1-16 6-28 13-42 8 16 16 28 13 42-1 12 5 12 9 0 14 20 8 48-22 48z"
          fill="url(#fp-flame-mid)"
        />
        <path
          className="origin-base animate-flame"
          style={{ animationDelay: "-0.9s", animationDuration: "1.1s" }}
          d="M160 270c-16 0-20-16-12-28 2 6 6 6 5 0 0-8 3-14 7-22 5 9 9 15 7 22-1 6 3 6 5 0 8 12 4 28-12 28z"
          fill="url(#fp-flame-core)"
        />
      </g>

      {/* Embers */}
      {EMBERS.map((e, i) => (
        <circle
          key={i}
          cx={e.x}
          cy="240"
          r="1.8"
          fill="#ffcf6b"
          className="animate-ember"
          style={{ animationDelay: `${e.delay}s`, ["--drift" as string]: e.drift }}
        />
      ))}

      {/* Hearth */}
      <rect x="38" y="286" width="244" height="14" rx="3" fill="#7d6863" />

      {/* Mantel */}
      <rect x="4" y="26" width="312" height="22" rx="5" fill="url(#fp-wood)" />
      <rect x="4" y="44" width="312" height="5" fill="#000" opacity=".25" />

      {/* Greenery with berries along the mantel */}
      <path d="M12 48q37 14 74 0t74 0 74 0 74 0" fill="none" stroke="#2f6b4c" strokeWidth="9" strokeLinecap="round" />
      <path d="M12 48q37 14 74 0t74 0 74 0 74 0" fill="none" stroke="#4c9a6e" strokeWidth="3" strokeDasharray="2 7" />
      {[40, 98, 150, 205, 262, 290].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 53 : 55} r="3.2" fill="#e0424f" />
      ))}

      {/* Candles */}
      {[44, 276].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="2" width="12" height="24" rx="2" fill="#f4ead7" />
          <circle cx={x} cy="-1" r="7" fill="#ffd36b" opacity=".35" className="origin-center animate-glow-pulse" />
          <path d={`M${x} -6q4 5 0 8q-4-3 0-8z`} fill="#ffcf5c" className="origin-base animate-flame" />
        </g>
      ))}

      {/* Stockings */}
      <g>
        <path d="M92 50h20v34q0 8 8 10l10 3q8 3 4 12-4 8-13 5l-20-6q-9-3-9-13z" fill="url(#fp-stocking-red)" />
        <rect x="89" y="48" width="26" height="9" rx="3" fill="#f7f1e6" />
        <path d="M208 50h20v34q0 8 8 10l10 3q8 3 4 12-4 8-13 5l-20-6q-9-3-9-13z" fill="url(#fp-stocking-green)" />
        <rect x="205" y="48" width="26" height="9" rx="3" fill="#f7f1e6" />
      </g>
    </svg>
  );
});
