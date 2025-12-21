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

      const s = Math.min(stageRect.width / cw, stageRect.height / ch, 1);
      setScale(s);
    };

    calc();
    const ro = new ResizeObserver(calc);
    if (usedStageRef.current) ro.observe(usedStageRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("orientationchange", calc);
    window.addEventListener("fullscreenchange", calc);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", calc);
      window.removeEventListener("fullscreenchange", calc);
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
      (el as HTMLElement).style.transformOrigin = (el as HTMLElement).style.transformOrigin || "center top";
      (el as HTMLElement).style.transform = `scale(${1 / scale})`;
    });

    return () => {
      /* restored on disable */
    };
  }, [enabled, scale, usedStageRef, innerSelector]);

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={usedStageRef as any}
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
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
    </div>
  );
}