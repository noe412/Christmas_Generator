import { memo } from "react";

const LIGHT_COLORS = ["#ffd36b", "#ff6b6b", "#7fd1ff", "#b7f774", "#ffa7e1"];

/** Tiers as [apexY, baseY, baseHalfWidth] – must match the tier paths below. */
const TIERS = [
  [40, 138, 50],
  [88, 216, 76],
  [150, 300, 104],
] as const;

/** Widest half-width of the tree silhouette at height y. */
function treeHalfWidth(y: number) {
  return Math.max(0, ...TIERS.filter(([a, b]) => y >= a && y <= b).map(([a, b, w]) => ((y - a) / (b - a)) * w));
}

/** Points along a sagging, slightly tilted garland; bulbs are kept inside the silhouette. */
function garland(y: number, sag: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const py = y + Math.sin(t * Math.PI) * sag + (t - 0.5) * 16;
    const hw = treeHalfWidth(py) * 0.86;
    return { x: 140 - hw + t * hw * 2, y: py };
  });
}

const STRANDS = [garland(108, 8, 5), garland(170, 12, 7), garland(234, 14, 9), garland(280, 12, 11)];

const LIGHTS = STRANDS.flat().map((p, i) => ({ ...p, i, color: LIGHT_COLORS[i % LIGHT_COLORS.length] }));
const TWINKLE_GROUPS = [0, 1, 2].map((g) => LIGHTS.filter((l) => l.i % 3 === g));

const ORNAMENTS = [
  { x: 128, y: 112, r: 7, c: "#e0424f" },
  { x: 160, y: 128, r: 6, c: "#f2c14e" },
  { x: 104, y: 186, r: 8, c: "#f2c14e" },
  { x: 150, y: 176, r: 7, c: "#5bb4e5" },
  { x: 182, y: 196, r: 8, c: "#e0424f" },
  { x: 84, y: 252, r: 9, c: "#5bb4e5" },
  { x: 128, y: 246, r: 8, c: "#e0424f" },
  { x: 176, y: 258, r: 9, c: "#f2c14e" },
  { x: 208, y: 244, r: 7, c: "#e0424f" },
  { x: 112, y: 296, r: 8, c: "#f2c14e" },
  { x: 168, y: 302, r: 8, c: "#5bb4e5" },
];

/** Decorated Christmas tree with a glowing star, twinkling lights, ornaments and presents. */
export const ChristmasTree = memo(function ChristmasTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 400" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tree-tier" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f7a55" />
          <stop offset="1" stopColor="#164330" />
        </linearGradient>
        <linearGradient id="tree-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset=".5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <radialGradient id="tree-star-glow">
          <stop offset="0" stopColor="#ffe28a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffe28a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tree-ornament" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Presents */}
      <g>
        <rect x="46" y="332" width="64" height="50" rx="5" fill="#c9343f" />
        <rect x="72" y="332" width="12" height="50" fill="#f2c14e" />
        <rect x="46" y="350" width="64" height="10" fill="#f2c14e" />
        <rect x="170" y="344" width="58" height="38" rx="5" fill="#3d7fb8" />
        <rect x="193" y="344" width="11" height="38" fill="#f7f1e6" />
        <rect x="116" y="356" width="48" height="26" rx="4" fill="#2f7a55" />
        <rect x="134" y="356" width="10" height="26" fill="#e0424f" />
        <path d="M78 332c-10-12-22-6-14 2zM78 332c10-12 22-6 14 2z" fill="#f2c14e" />
      </g>

      {/* Trunk */}
      <rect x="126" y="300" width="28" height="40" rx="3" fill="#5a3420" />

      {/* Tiers (bottom to top) */}
      {["M140 150L36 300q104 26 208 0z", "M140 88L64 216q76 20 152 0z", "M140 40L90 138q50 14 100 0z"].map((d) => (
        <g key={d}>
          <path d={d} fill="url(#tree-tier)" />
          <path d={d} fill="url(#tree-shade)" />
        </g>
      ))}

      {/* Light strands (wires) */}
      {STRANDS.map((strand, s) => (
        <polyline
          key={s}
          points={strand.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#1b2a22"
          strokeWidth="1.2"
          opacity=".7"
        />
      ))}

      {/* Bulbs in three groups that twinkle in turn – 3 animations instead of one per bulb */}
      {TWINKLE_GROUPS.map((group, g) => (
        <g key={g} className="animate-twinkle" style={{ animationDelay: `${g * -0.73}s` }}>
          {group.map((l) => (
            <g key={l.i}>
              <circle cx={l.x} cy={l.y} r="7" fill={l.color} opacity=".28" />
              <circle cx={l.x} cy={l.y} r="3.4" fill={l.color} />
            </g>
          ))}
        </g>
      ))}

      {/* Ornaments */}
      {ORNAMENTS.map((o, i) => (
        <g key={i}>
          <circle cx={o.x} cy={o.y} r={o.r} fill={o.c} />
          <circle cx={o.x} cy={o.y} r={o.r} fill="url(#tree-ornament)" />
          <rect x={o.x - 2} y={o.y - o.r - 3} width="4" height="4" rx="1" fill="#d9c08a" />
        </g>
      ))}

      {/* Star */}
      <circle cx="140" cy="34" r="30" fill="url(#tree-star-glow)" className="origin-center animate-glow-pulse" />
      <path
        d="M140 14l6.2 12.6 13.8 2-10 9.8 2.4 13.8L140 45.6l-12.4 6.6 2.4-13.8-10-9.8 13.8-2z"
        fill="#ffd86b"
        stroke="#fff2c2"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
});
