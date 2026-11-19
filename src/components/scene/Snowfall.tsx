import { memo } from "react";
import { seeded } from "@/lib/seeded";

const rand = seeded(2026);
const FLAKES = Array.from({ length: 70 }, () => ({
  left: rand() * 100,
  size: 1.5 + rand() * 3.5,
  duration: 9 + rand() * 12,
  delay: -rand() * 20,
  opacity: 0.35 + rand() * 0.55,
  blur: rand() > 0.75,
}));

/** Gentle full-page snowfall drifting in front of the room. */
export const Snowfall = memo(function Snowfall() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden motion-reduce:hidden">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="absolute -top-4 animate-snowfall rounded-full bg-snow will-change-transform"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            filter: f.blur ? "blur(1px)" : undefined,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
});
