import { memo } from "react";

/**
 * Snow slowly piles up along the bottom edge of the screen; every so often a little
 * snowplow drives across and clears it. Purely decorative.
 */
export const SnowPlow = memo(function SnowPlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-16 overflow-hidden motion-reduce:hidden"
    >
      {/* Growing drift, cleared behind the plow */}
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="animate-snowdrift absolute inset-x-0 bottom-0 h-7 w-full sm:h-9"
      >
        <path
          d="M0 40V22C60 12 110 20 170 16s110-10 170-4 120 8 180 2 110-10 170-6 120 10 180 4 100-8 170-4 110 6 160 2V40z"
          fill="#f4f7ff"
        />
        <path d="M0 40V30c140-6 280 2 420-2s280-6 420 0 250 4 360-1V40z" fill="#c9d6f0" opacity=".8" />
      </svg>

      {/*
        The plow rides on a full-width track whose translateX(%) equals the cleared share of the
        drift (same keyframe percentages), so the blade always sits exactly on the clearing edge –
        at any screen width, including fullscreen.
      */}
      <div className="animate-plow-track absolute inset-0">
        <div className="absolute right-full bottom-0 h-14 w-36 translate-x-[9%] sm:h-16 sm:w-40">
          <svg viewBox="0 0 160 64" className="h-full w-full">
            <defs>
              <linearGradient id="plow-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff3b0" stopOpacity=".7" />
                <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Headlight beam */}
            <path d="M126 36 L160 26 L160 52 Z" fill="url(#plow-beam)" />
            {/* Snow spray off the blade */}
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx="140"
                cy="52"
                r={2 + (i % 3)}
                fill="#fff"
                className="animate-spray"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
            {/* Body */}
            <rect x="18" y="30" width="96" height="20" rx="4" fill="#f2a516" />
            <rect x="18" y="44" width="96" height="4" fill="#000" opacity=".15" />
            <path d="M60 30 V14 Q60 10 64 10 H92 Q100 10 104 18 L110 30 Z" fill="#f2a516" />
            <path d="M66 14 H90 Q96 14 99 20 L103 28 H66 Z" fill="#9fd3ff" />
            <rect x="70" y="16" width="14" height="10" rx="1" fill="#ffd36b" opacity=".55" />
            <rect x="24" y="22" width="30" height="8" rx="2" fill="#d98a0b" />
            {/* Beacon */}
            <rect x="74" y="6" width="10" height="4" rx="1" fill="#555" />
            <circle cx="79" cy="5" r="4" fill="#ffb020" className="animate-beacon" />
            {/* Blade */}
            <path d="M114 30 L134 26 Q142 40 136 56 L114 52 Z" fill="#9aa3ad" />
            <path d="M120 30 L134 27" stroke="#c9d0d8" strokeWidth="2" />
            <path d="M136 56 L146 60" stroke="#ffd36b" strokeWidth="3" strokeLinecap="round" />
            {/* Headlight */}
            <circle cx="112" cy="36" r="3" fill="#fff6c9" />
            {/* Wheels */}
            {[38, 92].map((x) => (
              <g key={x} className="animate-wheel" style={{ transformOrigin: `${x}px 52px` }}>
                <circle cx={x} cy="52" r="10" fill="#26262e" />
                <circle cx={x} cy="52" r="4" fill="#8a8f99" />
                <path d={`M${x - 8} 52h16`} stroke="#3a3a44" strokeWidth="2" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
});
