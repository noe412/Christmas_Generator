import { useCallback, useEffect, useState, type RefObject } from "react";

/** Toggles a fullscreen presentation mode and stays in sync when the user exits via ESC. */
export function usePresentationMode(targetRef: RefObject<HTMLElement>) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setActive(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const enter = useCallback(() => {
    setActive(true);
    const el = targetRef.current ?? document.documentElement;
    // Fullscreen may be unsupported (e.g. iOS Safari); presentation mode still works in-page.
    el.requestFullscreen?.().catch(() => undefined);
  }, [targetRef]);

  const exit = useCallback(() => {
    setActive(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => undefined);
  }, []);

  const toggle = useCallback(() => (active ? exit() : enter()), [active, enter, exit]);

  return { active, enter, exit, toggle };
}
