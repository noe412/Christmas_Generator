import { memo, useMemo } from "react";
import { APP_CONFIG } from "@/config";

interface Flake {
  left: number;
  delay: number;
  duration: number;
  size: number;
}

function createFlakes(count: number): Flake[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: i * 0.5,
    duration: 6 + Math.random() * 2,
    size: 10 + Math.random() * 10,
  }));
}

/** Decorative, GPU-friendly snowfall. Hidden from assistive tech and disabled for reduced motion. */
export const Snowfall = memo(function Snowfall({ count = APP_CONFIG.snowflakeCount }: { count?: number }) {
  const flakes = useMemo(() => createFlakes(count), [count]);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute -top-[10%] animate-snowfall text-white/80 will-change-transform"
          style={{
            left: `${f.left}%`,
            animationDelay: `-${f.delay}s`,
            animationDuration: `${f.duration}s`,
            fontSize: `${f.size}px`,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
});
