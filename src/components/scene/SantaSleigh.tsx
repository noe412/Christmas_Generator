/** Santa in his sleigh pulled by three reindeer, drawn facing right (≈ 230 × 70 user units). */
export function SantaSleigh() {
  const reindeer = [150, 182, 214];
  return (
    <g>
      {/* Sparkle trail */}
      {[-18, -34, -50, -66].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={44 + (i % 2) * 6}
          r={2.6 - i * 0.5}
          fill="#ffe7a3"
          className="animate-twinkle"
          style={{ animationDelay: `${i * 0.25}s`, animationDuration: "1s" }}
        />
      ))}

      {/* Harness */}
      <path d="M92 36 Q150 26 222 22" fill="none" stroke="#e9c46a" strokeWidth="1.4" />

      {/* Reindeer with galloping legs */}
      {reindeer.map((x, i) => (
        <g key={x} className="animate-gallop origin-center" style={{ animationDelay: `${i * -0.18}s` }}>
          <ellipse cx={x} cy={26 - i * 2} rx="13" ry="5.5" fill="#7a4e33" />
          <path d={`M${x + 10} ${23 - i * 2}l5-7`} stroke="#7a4e33" strokeWidth="4" strokeLinecap="round" />
          <circle cx={x + 16} cy={15 - i * 2} r="4" fill="#7a4e33" />
          <path
            d={`M${x + 14} ${12 - i * 2}l-3-6m3 6l2-7m-2 2l-3-2m3 2l3-3`}
            stroke="#d9b98c"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${x - 8} ${30 - i * 2}l-6 8M${x - 3} ${30 - i * 2}l-2 9M${x + 6} ${30 - i * 2}l6 7M${x + 10} ${30 - i * 2}l3 8`}
            stroke="#5e3a25"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {i === reindeer.length - 1 && (
            <circle
              cx={x + 20}
              cy={16 - i * 2}
              r="2.4"
              fill="#ff4545"
              className="animate-twinkle"
              style={{ animationDuration: "0.9s", filter: "drop-shadow(0 0 3px #ff4545)" }}
            />
          )}
        </g>
      ))}

      {/* Sleigh */}
      <path
        d="M8 56 Q4 64 16 64 H92 Q104 64 106 52"
        fill="none"
        stroke="#e9c46a"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M14 30 Q12 54 30 56 H84 Q98 56 100 38 L96 34 Q90 46 78 46 H40 Q30 46 30 30 Z" fill="#c62f3b" />
      <path d="M30 30 Q30 46 40 46 H78" fill="none" stroke="#e9c46a" strokeWidth="1.6" />

      {/* Present sack */}
      <path d="M22 30 Q16 14 30 10 Q40 12 40 26 Z" fill="#8a5a3b" />
      <rect x="27" y="6" width="8" height="5" rx="1" fill="#2f7a55" />

      {/* Santa */}
      <path d="M46 44 Q44 22 60 20 Q74 22 72 44 Z" fill="#d9343f" />
      <circle cx="62" cy="16" r="7" fill="#f2c6a0" />
      <path d="M54 18 Q62 34 70 18 Q66 22 62 22 Q58 22 54 18 Z" fill="#fff" />
      <path d="M54 13 Q60 0 72 6 L76 12 Q66 8 70 13 Z" fill="#d9343f" />
      <circle cx="77" cy="12" r="2.6" fill="#fff" />
      <rect x="53" y="11" width="18" height="3.6" rx="1.8" fill="#fff" />
      <path d="M70 30 Q80 30 92 26" stroke="#d9343f" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  );
}
