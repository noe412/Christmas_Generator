import { useEffect, useRef } from "react";

const INTERACTIVE = new Set(["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]);

/**
 * Invokes the callback on Enter / Space unless the user is interacting with a
 * form control or another focused button (which handles the key itself).
 */
export function useStartShortcut(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key !== "Enter" && e.code !== "Space") return;
      const active = document.activeElement as HTMLElement | null;
      if (active && (INTERACTIVE.has(active.tagName) || active.isContentEditable)) return;
      e.preventDefault();
      callbackRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
