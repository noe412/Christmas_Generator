import React, { useEffect, useRef, useState, type RefObject } from "react";

export function FitToViewport({
  enabled,
  stageRef,
  children,
}: {
  enabled?: boolean;
  stageRef?: RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  const localStageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const getViewportHeight = () => {
    if (typeof window === "undefined") return 0;
    return window.visualViewport?.height ?? window.innerHeight ?? 0;
  };
  const [scale, setScale] = useState(1);
  const [vh, setVh] = useState<number>(() => getViewportHeight());

  const usedStageRef = stageRef ?? localStageRef;

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
      const contentRect = content.getBoundingClientRect();

      const cw = content.scrollWidth || contentRect.width;
      const ch = content.scrollHeight || contentRect.height;

      // Compute a uniform scale so the entire content fits inside the stage
      // without inverting or compensating any inner elements. This avoids
      // clipping where parts of the content would overflow after inverse
      // transforms.
      const s = Math.min(stageRect.width / cw, stageRect.height / ch, 1);
      setScale(s);
      // Keep a pinned viewport height (in pixels) to avoid mobile browser UI/toolbars
      // shrinking/expanding the visible area and cutting off content in fullscreen.
      setVh(getViewportHeight() || Math.round(stageRect.height));
    };

    calc();
    const ro = new ResizeObserver(calc);
    if (usedStageRef.current) ro.observe(usedStageRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", calc);
      window.visualViewport.addEventListener("scroll", calc);
    }
    window.addEventListener("orientationchange", calc);
    window.addEventListener("fullscreenchange", calc);
    window.addEventListener("resize", calc);

    return () => {
      ro.disconnect();
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", calc);
        window.visualViewport.removeEventListener("scroll", calc);
      }
      window.removeEventListener("orientationchange", calc);
      window.removeEventListener("fullscreenchange", calc);
      window.removeEventListener("resize", calc);
    };
  }, [enabled, usedStageRef]);

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={usedStageRef as any}
      style={{
        width: "100vw",
        // Use a pixel height derived from window.innerHeight to avoid mobile
        // browser UI (address/toolbars) causing the bottom to be clipped.
        height: vh ? `${vh}px` : "100dvh",
        overflow: "hidden",
        position: "relative",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "max-content",
          height: "max-content",
        }}
        ref={contentRef as any}
      >
        {children}
      </div>
    </div>
  );
}
