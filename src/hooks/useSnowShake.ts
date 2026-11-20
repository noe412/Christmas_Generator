import { useCallback, useEffect, useRef, useState } from "react";

export type SnowPhase = "resting" | "falling" | "regrowing";

/** How long the snow takes to fall off, and to settle again afterwards (ms). */
export const SNOW_FALL_MS = 1300;
export const SNOW_REGROW_MS = 6000;

/** Lifecycle of a snow cap that can be shaken off: resting → falling → regrowing → resting. */
export function useSnowShake() {
  const [phase, setPhase] = useState<SnowPhase>("resting");
  const [shakes, setShakes] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const shake = useCallback(() => {
    if (phase !== "resting") return;
    setPhase("falling");
    setShakes((n) => n + 1);
    timers.current.push(
      window.setTimeout(() => setPhase("regrowing"), SNOW_FALL_MS),
      window.setTimeout(() => setPhase("resting"), SNOW_FALL_MS + SNOW_REGROW_MS),
    );
  }, [phase]);

  return { phase, shakes, shake };
}
