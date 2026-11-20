import { useMemo } from "react";
import type { SnowPhase } from "@/hooks/useSnowShake";
import { seeded } from "@/lib/seeded";
import { cn } from "@/lib/utils";

interface SnowCapProps {
  className?: string;
  /** Current lifecycle phase; omit for a purely decorative cap. */
  phase?: SnowPhase;
  /** Increments with every shake – seeds a fresh set of falling clumps. */
  shakes?: number;
  /** When given, the cap becomes a button that shakes the snow off. */
  onShake?: () => void;
}

function Clumps({ seed }: { seed: number }) {
  const clumps = useMemo(() => {
    const rand = seeded(seed * 7919 + 13);
    return Array.from({ length: 36 }, () => ({
      left: 3 + rand() * 94,
      size: 3 + rand() * 7,
      dx: `${(rand() - 0.5) * 60}px`,
      dy: `${110 + rand() * 220}px`,
      rot: `${(rand() - 0.5) * 360}deg`,
      delay: rand() * 0.25,
    }));
  }, [seed]);
  return (
    <>
      {clumps.map((c, i) => (
        <span
          key={i}
          className="animate-snow-drop absolute top-0 rounded-full bg-snow shadow-[0_0_4px_oklch(1_0_0/0.6)]"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size * 0.8,
            animationDelay: `${c.delay}s`,
            ["--dx" as string]: c.dx,
            ["--dy" as string]: c.dy,
            ["--rot" as string]: c.rot,
          }}
        />
      ))}
    </>
  );
}

/** A wavy layer of snow resting on the top edge of a card – optionally shakeable. */
export function SnowCap({ className, phase = "resting", shakes = 0, onShake }: SnowCapProps) {
  return (
    <div className={cn("absolute inset-x-3 -top-[7px] z-10 h-[14px]", className)}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 400 16"
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none h-full w-full origin-bottom transition-opacity duration-150",
          phase === "resting" && "animate-settle",
          phase === "falling" && "opacity-0",
          phase === "regrowing" && "animate-regrow",
        )}
      >
        <path
          d="M0 10C20 4 36 9 56 6s38-4 60 1 40-3 62-2 34 6 58 3 44-6 66-2 40 5 58 1 30-3 40-1v10H0z"
          fill="#f4f7ff"
        />
        <path d="M0 13c40-3 80 1 130-1s90-2 140 0 90 2 130-1v5H0z" fill="#c9d6f0" opacity=".7" />
      </svg>

      {phase === "falling" && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1 z-30 h-0 overflow-visible">
          <Clumps seed={shakes} />
        </div>
      )}

      {onShake && (
        <button
          type="button"
          onClick={onShake}
          disabled={phase !== "resting"}
          aria-label="Shake off the snow"
          title="Shake off the snow"
          className="absolute -inset-x-1 -top-2 -bottom-2 rounded-full disabled:cursor-default focus-visible:outline-offset-1"
        />
      )}
    </div>
  );
}
