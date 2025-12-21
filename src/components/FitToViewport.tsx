import React, { useEffect, useRef, useState, type RefObject, type ReactNode } from "react";

export function FitToViewport({
  enabled,
  stageRef,
  children,
  overlay,
  innerSelector = ".inner-frame",
}: {
  enabled?: boolean;
  stageRef?: RefObject<HTMLDivElement>;
  children: ReactNode;
  overlay?: ReactNode;
  innerSelector?: string;
}) {
  const localStageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [stageHeight, setStageHeight] = useState<number | null>(null);

  const usedStageRef = stageRef ?? localStageRef;
  const originalTransforms = useRef(new Map<Element, string>());

  // helper to get accurate viewport height (uses visualViewport when available)
  const getViewportHeight = () =>
    Math.max(0, Math.floor((window.visualViewport?.height ?? window.innerHeight) || 0));

  useEffect(() => {
    if (!enabled) {
      setScale(1);
      setStageHeight(null);
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

      // update stageHeight from visualViewport to avoid mobile address bar cut-off
      const vh = getViewportHeight();
      setStageHeight(vh);

      // measure using current sizes
      const stageRect = stage.getBoundingClientRect();
      // prefer stageRect height if present, otherwise visualViewport
      const stageH = stageRect.height > 0 ? stageRect.height : vh;
      const stageW = stageRect.width > 0 ? stageRect.width : (window.visualViewport?.width ?? window.innerWidth);

      const contentRect = content.getBoundingClientRect();
      const cw = content.scrollWidth || contentRect.width;
      const ch = content.scrollHeight || contentRect.height;

      const s = Math.min(stageW / cw, stageH / ch, 1);
      setScale(s);
    };

    // initial calc
    calc();

    // observe changes
    const ro = new ResizeObserver(calc);
    if (usedStageRef.current) ro.observe(usedStageRef.current);
    if (contentRef.current) ro.observe(contentRef.current);

    // listen to visualViewport resize if available (handles address bar changes)
    const vvv = (window as any).visualViewport;
    vvv?.addEventListener?.("resize", calc);

    window.addEventListener("orientationchange", calc);
    window.addEventListener("fullscreenchange", calc);
    window.addEventListener("resize", calc);

    return () => {
      ro.disconnect();
      vvv?.removeEventListener?.("resize", calc);
      window.removeEventListener("orientationchange", calc);
      window.removeEventListener("fullscreenchange", calc);
      window.removeEventListener("resize", calc);
    };
  }, [enabled, usedStageRef]);

  // inverse-scale inner-frame so it visually keeps original size
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
      (el as HTMLElement).style.transformOrigin = (el as HTMLElement).style.transformOrigin || "center top";
      (el as HTMLElement).style.transform = `scale(${1 / scale})`;
    });
  }, [enabled, scale, usedStageRef, innerSelector]);

  if (!enabled) return <>{children}</>;

  // stage inline style uses computed stageHeight when available to avoid cut-off
  const stageStyle: React.CSSProperties = {
    width: "100vw",
    height: stageHeight ? `${stageHeight}px` : "100vh",
    overflow: "hidden",
    position: "relative",
    // include safe area bottom padding for tablets with notch
    paddingBottom: "env(safe-area-inset-bottom)",
  };

  return (
    <div ref={usedStageRef as any} style={stageStyle}>
      {/* center the scaled content so it won't stick to top-left and be clipped on some devices */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center top",
            display: "inline-block",
            width: "max-content",
            height: "max-content",
          }}
          ref={contentRef as any}
        >
          {children}
        </div>
      </div>

      {overlay ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          {overlay}
        </div>
      ) : null}
    </div>
  );
}