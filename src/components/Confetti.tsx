import { memo, useMemo } from "react";
import { seeded } from "@/lib/seeded";

const COLORS = ["#ffd36b", "#ff6b6b", "#7fd1ff", "#b7f774", "#fff4cf", "#ffa7e1"];

/** One-shot celebratory burst. Re-mount (change `burstKey`) to play it again. */
export const Confetti = memo(function Confetti({ burstKey, count = 46 }: { burstKey: string; count?: number }) {
  const pieces = useMemo(() => {
    const rand = seeded(burstKey.length * 9973 + count);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.4;
      const dist = 140 + rand() * 220;
      return {
        dx: `${Math.cos(angle) * dist}px`,
        dy: `${Math.sin(angle) * dist * 0.7 + 120}px`,
        rot: `${(rand() - 0.5) * 900}deg`,
        color: COLORS[i % COLORS.length],
        size: 6 + rand() * 7,
        round: rand() > 0.6,
        delay: rand() * 0.15,
      };
    });
  }, [burstKey, count]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible motion-reduce:hidden">
      {pieces.map((p, i) => (
        <span
          key={`${burstKey}-${i}`}
          className="absolute top-1/2 left-1/2 animate-confetti"
          style={{
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            borderRadius: p.round ? "9999px" : "2px",
            background: p.color,
            animationDelay: `${p.delay}s`,
            ["--dx" as string]: p.dx,
            ["--dy" as string]: p.dy,
            ["--rot" as string]: p.rot,
          }}
        />
      ))}
    </div>
  );
});
