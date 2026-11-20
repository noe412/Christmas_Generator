import { memo } from "react";
import { seeded } from "@/lib/seeded";
import type { SnowSheetLayer } from "@/lib/snowSheet";
import { SnowSheets } from "../SnowSheets";

/** Indoors the snow stays subtle: two light sheets plus a few large, individually drifting flakes. */
const ROOM_SNOW: SnowSheetLayer[] = [
  { tile: 200, flakes: 10, minR: 0.6, maxR: 1.3, duration: 11, opacity: 0.45, seed: 31 },
  { tile: 320, flakes: 9, minR: 1.3, maxR: 2.2, duration: 8.5, opacity: 0.6, seed: 32 },
];

const rand = seeded(2026);
const FLAKES = Array.from({ length: 34 }, () => ({
  left: rand() * 100,
  size: 3 + rand() * 4,
  duration: 8 + rand() * 9,
  delay: -rand() * 17,
  opacity: 0.5 + rand() * 0.45,
  blur: rand() > 0.6,
}));

/** Full-page snowfall drifting in front of the room. */
export const Snowfall = memo(function Snowfall() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden motion-reduce:hidden">
      <SnowSheets layers={ROOM_SNOW} />
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
