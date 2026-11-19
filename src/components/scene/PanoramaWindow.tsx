import { memo } from "react";
import { seeded } from "@/lib/seeded";
import { SantaSleigh } from "./SantaSleigh";

const rand = seeded(11);

const STARS = Array.from({ length: 40 }, () => ({ x: 70 + rand() * 760, y: 40 + rand() * 150, r: 0.5 + rand() * 1.2 }));
const FLAKES = Array.from({ length: 70 }, () => ({
  x: 60 + rand() * 780,
  y: rand() * 80 - 60,
  r: 0.8 + rand() * 2.2,
  dur: 7 + rand() * 7,
  delay: -rand() * 14,
}));

/** A row of snowy pines along a ridge line. */
function forest(y0: number, count: number, scale: number, seed: number) {
  const r = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const x = 60 + (i / (count - 1)) * 780 + (r() - 0.5) * 20;
    const h = (26 + r() * 22) * scale;
    const y = y0 + Math.sin(x / 90) * 8 * scale;
    return { x, y, h };
  });
}
const FAR_PINES = forest(318, 26, 0.6, 3);
const NEAR_PINES = forest(372, 16, 1, 5).filter((_, i) => i % 3 !== 1);

/**
 * Panoramic three-pane window with curtains, looking out on a winter night:
 * aurora, moon, mountains, forest, a cabin with a smoking chimney, falling snow,
 * an occasional shooting star – and Santa's sleigh flying past.
 */
export const PanoramaWindow = memo(function PanoramaWindow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 470" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060d24" />
          <stop offset=".55" stopColor="#16285a" />
          <stop offset="1" stopColor="#40568f" />
        </linearGradient>
        <radialGradient id="pw-moon-glow">
          <stop offset="0" stopColor="#fff6d8" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff6d8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pw-aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4fffc0" stopOpacity="0" />
          <stop offset=".3" stopColor="#4fffc0" stopOpacity=".55" />
          <stop offset=".7" stopColor="#7d8bff" stopOpacity=".45" />
          <stop offset="1" stopColor="#7d8bff" stopOpacity="0" />
        </linearGradient>
        <filter id="pw-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="pw-curtain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a1b26" />
          <stop offset=".35" stopColor="#a8303c" />
          <stop offset=".6" stopColor="#7f1f2a" />
          <stop offset="1" stopColor="#a02b37" />
        </linearGradient>
        <radialGradient id="pw-frost" cx="0" cy="0" r="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="pw-glass">
          <rect x="60" y="34" width="780" height="380" rx="10" />
        </clipPath>
      </defs>

      <g clipPath="url(#pw-glass)">
        <rect x="60" y="34" width="780" height="380" fill="url(#pw-sky)" />

        {/* Aurora */}
        <g filter="url(#pw-blur)" className="animate-aurora">
          <path d="M40 150 Q220 60 420 120 T860 90 L860 130 Q640 170 420 160 T40 190 Z" fill="url(#pw-aurora)" />
        </g>

        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fff"
            className="animate-twinkle"
            style={{ animationDelay: `${(i * 0.37) % 3}s`, animationDuration: "3.6s" }}
          />
        ))}

        {/* Shooting star */}
        <line
          x1="0"
          y1="0"
          x2="46"
          y2="16"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="animate-shooting-star"
        />

        {/* Moon */}
        <circle cx="720" cy="96" r="60" fill="url(#pw-moon-glow)" />
        <circle cx="720" cy="96" r="24" fill="#fff3cf" />
        <circle cx="711" cy="90" r="4" fill="#ebdcae" />
        <circle cx="728" cy="104" r="3" fill="#ebdcae" />

        {/* Santa flies across the sky */}
        <g className="animate-santa-flight">
          <g className="animate-sleigh-bob">
            <SantaSleigh />
          </g>
        </g>

        {/* Mountains */}
        <path
          d="M60 300 L170 196 L240 250 L340 170 L450 262 L540 200 L640 270 L730 190 L840 280 V414 H60 Z"
          fill="#5d6fa3"
        />
        <path
          d="M170 196 L196 221 L184 218 L170 230 L156 214 Z M340 170 L372 200 L356 196 L340 212 L322 192 Z M540 200 L566 224 L552 222 L540 232 L528 218 Z M730 190 L760 218 L744 214 L730 226 L714 208 Z"
          fill="#e8eefc"
        />

        {/* Far forest */}
        {FAR_PINES.map((p, i) => (
          <path key={i} d={`M${p.x} ${p.y - p.h}l${-p.h * 0.32} ${p.h}h${p.h * 0.64}z`} fill="#2c4566" />
        ))}

        {/* Snowy hills */}
        <path d="M60 330 Q240 286 430 318 T840 300 V414 H60 Z" fill="#c5d3ef" />

        {/* Cabin with warm windows and chimney smoke */}
        <g>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx="616"
              cy="272"
              r={6 + i * 2}
              fill="#dfe6f5"
              opacity=".5"
              className="animate-smoke"
              style={{ animationDelay: `${i * 1.3}s` }}
            />
          ))}
          <rect x="610" y="276" width="10" height="22" fill="#4a3428" />
          <path d="M574 300 L604 272 L640 300 Z" fill="#f4f7ff" />
          <rect x="580" y="298" width="54" height="32" fill="#6b4630" />
          <rect x="588" y="306" width="12" height="11" fill="#ffd36b" className="animate-flicker origin-center" />
          <rect
            x="612"
            y="306"
            width="12"
            height="11"
            fill="#ffd36b"
            className="animate-flicker origin-center"
            style={{ animationDelay: "-1s" }}
          />
          <path d="M572 300 L604 270 L642 300" fill="none" stroke="#f4f7ff" strokeWidth="5" strokeLinejoin="round" />
        </g>

        <path d="M60 370 Q260 340 470 366 T840 350 V414 H60 Z" fill="#eef3ff" />

        {/* Near pines with snow */}
        {NEAR_PINES.map((p, i) => (
          <g key={i}>
            <path d={`M${p.x} ${p.y - p.h}l${-p.h * 0.36} ${p.h}h${p.h * 0.72}z`} fill="#1d3b4a" />
            <path d={`M${p.x} ${p.y - p.h}l${-p.h * 0.12} ${p.h * 0.32}h${p.h * 0.24}z`} fill="#eef3ff" />
          </g>
        ))}

        {/* Falling snow */}
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

        {/* Frosted corners */}
        <circle cx="60" cy="414" r="90" fill="url(#pw-frost)" />
        <circle cx="840" cy="414" r="90" fill="url(#pw-frost)" />
      </g>

      {/* Frame with mullions */}
      <rect x="60" y="34" width="780" height="380" rx="10" fill="none" stroke="#5b3a26" strokeWidth="16" />
      <path d="M320 34V414M580 34V414M60 150H840" stroke="#5b3a26" strokeWidth="9" />
      <rect x="60" y="34" width="780" height="380" rx="10" fill="none" stroke="#8a5a3b" strokeWidth="3" />

      {/* Sill with snow */}
      <rect x="36" y="410" width="828" height="20" rx="5" fill="#6b4630" />
      <path d="M46 412q30-10 60-3t70-1 80 2 70-3 80 3 70-2 80 2 70-3 80 3 70-2 60 1v6H46z" fill="#f4f7ff" />

      {/* Curtain rod and curtains */}
      <rect x="10" y="10" width="880" height="9" rx="4.5" fill="#3b2418" />
      <circle cx="12" cy="14.5" r="9" fill="#c9a45c" />
      <circle cx="888" cy="14.5" r="9" fill="#c9a45c" />
      <path d="M22 18 H128 Q112 140 96 230 Q118 330 132 440 H22 Z" fill="url(#pw-curtain)" />
      <path d="M878 18 H772 Q788 140 804 230 Q782 330 768 440 H878 Z" fill="url(#pw-curtain)" />
      <path
        d="M60 18 Q66 130 74 232 M100 18 Q92 120 90 228"
        stroke="#5c121b"
        strokeOpacity=".5"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M840 18 Q834 130 826 232 M800 18 Q808 120 810 228"
        stroke="#5c121b"
        strokeOpacity=".5"
        strokeWidth="3"
        fill="none"
      />
      <rect x="70" y="222" width="44" height="10" rx="5" fill="#e9c46a" />
      <rect x="786" y="222" width="44" height="10" rx="5" fill="#e9c46a" />
    </svg>
  );
});
