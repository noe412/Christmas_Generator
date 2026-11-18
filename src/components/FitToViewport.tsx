import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

interface FitToViewportProps {
  /** When false, children are rendered unchanged. */
  enabled?: boolean;
  /** Optional external ref to the stage element (used as fullscreen target). */
  stageRef?: RefObject<HTMLDivElement>;
  children: ReactNode;
}

const getViewportHeight = () =>
  typeof window === "undefined" ? 0 : (window.visualViewport?.height ?? window.innerHeight ?? 0);

/**
 * Uniformly scales its content down so it always fits the visible viewport.
 * Pins the stage height in pixels to avoid mobile browser toolbars clipping content.
 */
export function FitToViewport({ enabled = false, stageRef, children }: FitToViewportProps) {
  const localStageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const usedStageRef = stageRef ?? localStageRef;
  const [scale, setScale] = useState(1);
  const [vh, setVh] = useState(getViewportHeight);

  useEffect(() => {
    if (!enabled) {
      setScale(1);
      return;
    }

    const calc = () => {
      const stage = usedStageRef.current;
      const content = contentRef.current;
      if (!stage || !content) return;
      const stageRect = stage.getBoundingClientRect();
      const cw = content.scrollWidth || content.getBoundingClientRect().width;
      const ch = content.scrollHeight || content.getBoundingClientRect().height;
      if (!cw || !ch) return;
      setScale(Math.min(stageRect.width / cw, stageRect.height / ch, 1));
      setVh(getViewportHeight() || Math.round(stageRect.height));
    };

    calc();
    const ro = new ResizeObserver(calc);
    if (usedStageRef.current) ro.observe(usedStageRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", calc);
    vv?.addEventListener("scroll", calc);
    const winEvents = ["orientationchange", "fullscreenchange", "resize"] as const;
    winEvents.forEach((evt) => window.addEventListener(evt, calc));

    return () => {
      ro.disconnect();
      vv?.removeEventListener("resize", calc);
      vv?.removeEventListener("scroll", calc);
      winEvents.forEach((evt) => window.removeEventListener(evt, calc));
    };
  }, [enabled, usedStageRef]);

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={usedStageRef}
      style={{
        width: "100vw",
        height: vh ? `${vh}px` : "100dvh",
        overflow: "hidden",
        position: "relative",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "max-content",
          height: "max-content",
        }}
      >
        {children}
      </div>
    </div>
  );
}
