/** A small snowman on a snow drift (≈ 70 × 90 user units, base at y = 0) that waves and blinks. */
export function Snowman() {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="26" ry="5" fill="#9fb2d9" opacity=".6" />
      {/* Body */}
      <circle cx="0" cy="-16" r="18" fill="#f7f9ff" />
      <circle cx="0" cy="-44" r="13" fill="#f7f9ff" />
      <circle cx="0" cy="-66" r="10" fill="#f7f9ff" />
      <path d="M-18 -12a18 18 0 0 0 36 0" fill="#d6e0f5" opacity=".7" />
      {/* Buttons */}
      {[-48, -40, -22, -12].map((y) => (
        <circle key={y} cx="0" cy={y} r="1.8" fill="#2b2b33" />
      ))}
      {/* Face */}
      <g className="animate-blink origin-center">
        <circle cx="-3.6" cy="-69" r="1.5" fill="#2b2b33" />
        <circle cx="3.6" cy="-69" r="1.5" fill="#2b2b33" />
      </g>
      <path d="M0 -65l10 2.2-10 1.8z" fill="#f08a2c" />
      <path d="M-4 -60q4 3 8 0" fill="none" stroke="#2b2b33" strokeWidth="1.2" strokeLinecap="round" />
      {/* Scarf */}
      <path d="M-10 -56q10 5 20 0v4q-10 5-20 0z" fill="#c62f3b" />
      <path d="M5 -53l3 14h-5l-1-13z" fill="#c62f3b" className="animate-scarf origin-top" />
      {/* Hat */}
      <rect x="-11" y="-77" width="22" height="3" rx="1.5" fill="#22222a" />
      <rect x="-7" y="-90" width="14" height="14" rx="2" fill="#22222a" />
      <rect x="-7" y="-80" width="14" height="3" fill="#2f7a55" />
      {/* Arms – the right one waves */}
      <path d="M-12 -44l-16-8m6 3l-3-6" stroke="#6b4630" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g className="animate-wave" style={{ transformOrigin: "12px -46px" }}>
        <path d="M12 -46l16-12m-6 4l1-7m-1 7l6 1" stroke="#6b4630" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}
