import React, { useEffect, useRef, useState, type RefObject } from "react";

export function FitToViewport({
  enabled,
  stageRef,
  children,
  innerSelector = ".inner-frame",
}: {
  enabled?: boolean;
  stageRef?: RefObject<HTMLDivElement>;
  children: React.ReactNode;
  innerSelector?: string;
}) {
  const localStageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [vh, setVh] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return (window.visualViewport && window.visualViewport.height) || window.innerHeight || 0;
  });
  const [isLandscape, setIsLandscape] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth > window.innerHeight : false
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() =>
    typeof document !== "undefined" ? !!document.fullscreenElement : false
  );

  const usedStageRef = stageRef ?? localStageRef;
  const originalTransforms = useRef(new Map<Element, string>());

  useEffect(() => {
    if (!enabled) {
      setScale(1);
      originalTransforms.current.forEach((orig, el) => {
        (el as HTMLElement).style.transform = orig || "";
      });
      originalTransforms.current.clear();
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

  // Use the actual visible viewport size (visualViewport when available,
  // otherwise fall back to the stage rect / window inner sizes). This
  // ensures we compute a scale that actually fits on-screen UI in
  // landscape/fullscreen on tablets.
  const visual = (window as any).visualViewport;
  const availW = (visual && visual.width) || stageRect.width || window.innerWidth;
  const availH = (visual && visual.height) || stageRect.height || window.innerHeight;

  const s = Math.min(availW / cw, availH / ch, 1);
  setScale(s);
      // Update viewport height: prefer visualViewport (excludes on-screen UI)
      const visualH = (window.visualViewport && window.visualViewport.height) || 0;
      setVh(visualH || window.innerHeight || Math.round(stageRect.height));
      // Update orientation/fullscreen state
      setIsLandscape((window.visualViewport ? window.visualViewport.width : window.innerWidth) >
        (window.visualViewport ? window.visualViewport.height : window.innerHeight));
      setIsFullscreen(!!document.fullscreenElement);
    };

    calc();
    const ro = new ResizeObserver(calc);
    if (usedStageRef.current) ro.observe(usedStageRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("orientationchange", calc);
    window.addEventListener("fullscreenchange", calc);
    // also update on resize (covers some browser UI changes)
    window.addEventListener("resize", calc);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", calc);
      window.visualViewport.addEventListener("scroll", calc);
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", calc);
      window.removeEventListener("fullscreenchange", calc);
      window.removeEventListener("resize", calc);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", calc);
        window.visualViewport.removeEventListener("scroll", calc);
      }
    };
  }, [enabled, usedStageRef]);

  useEffect(() => {
    if (!enabled) return;

    const stage = usedStageRef.current;
    if (!stage) return;
    const nodes = Array.from(stage.querySelectorAll(innerSelector));

    originalTransforms.current.forEach((orig, el) => {
      if (!nodes.includes(el)) {
        (el as HTMLElement).style.transform = orig || "";
        originalTransforms.current.delete(el);
      }
    });

    if (scale === 1) {
      nodes.forEach((el) => {
        if (originalTransforms.current.has(el)) {
          (el as HTMLElement).style.transform = originalTransforms.current.get(el) || "";
          originalTransforms.current.delete(el);
        }
      });
      return;
    }

    nodes.forEach((el) => {
      if (!originalTransforms.current.has(el)) {
        originalTransforms.current.set(el, (el as HTMLElement).style.transform || "");
      }
      (el as HTMLElement).style.transformOrigin = (el as HTMLElement).style.transformOrigin || "top left";
      (el as HTMLElement).style.transform = `scale(${1 / scale})`;
    });

    return () => {
      /* restored on disable */
    };
  }, [enabled, scale, usedStageRef, innerSelector]);

  if (!enabled) return <>{children}</>;

  const useFixed = isFullscreen || isLandscape;

  return (
    <div
      ref={usedStageRef as any}
      style={{
        width: "100vw",
        // Use a pixel height derived from visualViewport/innerHeight to avoid mobile
        // browser UI (address/toolbars) causing the bottom to be clipped.
        height: vh ? `${vh}px` : "100dvh",
        overflow: "hidden",
        position: useFixed ? "fixed" : "relative",
        top: useFixed ? 0 : undefined,
        left: useFixed ? 0 : undefined,
        right: useFixed ? 0 : undefined,
        zIndex: useFixed ? 9999 : undefined,
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