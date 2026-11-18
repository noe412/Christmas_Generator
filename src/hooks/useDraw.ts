import { useCallback, useEffect, useRef, useState } from "react";
import { APP_CONFIG } from "@/config";
import { pickRandom } from "@/lib/random";

export type DrawPhase = "idle" | "spinning" | "done";

interface UseDrawOptions {
  onStart?: () => void;
  onWinner?: (winner: string) => void;
  stepMs?: number;
  totalMs?: number;
}

/**
 * Runs the animated draw: cycles through candidate names and settles on a
 * cryptographically random winner. Guards against concurrent draws and
 * cleans up timers on unmount.
 */
export function useDraw(
  candidates: readonly string[],
  { onStart, onWinner, stepMs = APP_CONFIG.spinStepMs, totalMs = APP_CONFIG.spinTotalMs }: UseDrawOptions = {},
) {
  const [phase, setPhase] = useState<DrawPhase>("idle");
  const [displayName, setDisplayName] = useState("");
  const [winner, setWinner] = useState("");
  const timerRef = useRef<number | null>(null);
  const spinningRef = useRef(false);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    },
    [],
  );

  const start = useCallback((): boolean => {
    if (spinningRef.current || candidates.length === 0) return false;
    const pool = [...candidates];
    spinningRef.current = true;
    setPhase("spinning");
    setWinner("");
    onStart?.();

    const maxIterations = Math.max(1, Math.ceil(totalMs / stepMs));
    let iterations = 0;
    timerRef.current = window.setInterval(() => {
      setDisplayName(pickRandom(pool));
      iterations += 1;
      if (iterations < maxIterations) return;

      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      timerRef.current = null;
      const selected = pickRandom(pool);
      spinningRef.current = false;
      setWinner(selected);
      setPhase("done");
      onWinner?.(selected);
    }, stepMs);
    return true;
  }, [candidates, onStart, onWinner, stepMs, totalMs]);

  return { phase, displayName, winner, start, isSpinning: phase === "spinning" };
}
