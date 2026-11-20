import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { APP_CONFIG } from "@/config";
import { readJson, writeJson } from "@/lib/storage";

export type MotionPreference = "system" | "on" | "off";

const QUERY = "(prefers-reduced-motion: reduce)";

function readPreference(): MotionPreference {
  const stored = readJson(APP_CONFIG.motionStorageKey, "system");
  return stored === "on" || stored === "off" ? stored : "system";
}

function systemPrefersReduced() {
  return typeof window !== "undefined" && !!window.matchMedia?.(QUERY).matches;
}

/** Whether animations should be reduced for a given preference. */
export function isMotionReduced(preference: MotionPreference, systemReduced: boolean) {
  return preference === "off" || (preference === "system" && systemReduced);
}

/** Applies the motion mode to <html data-motion> (read by CSS). Safe to call before React mounts. */
export function applyMotion(reduced: boolean) {
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
}

/** Sets the initial motion mode synchronously so the first frame already matches the preference. */
export function initMotion() {
  applyMotion(isMotionReduced(readPreference(), systemPrefersReduced()));
}

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia?.(QUERY);
  mql?.addEventListener?.("change", onChange);
  return () => mql?.removeEventListener?.("change", onChange);
};

/**
 * Animation on/off switch. Follows the OS "reduce motion" setting until the
 * user chooses explicitly; the choice is persisted.
 */
export function useMotionPreference() {
  const [preference, setPreference] = useState<MotionPreference>(readPreference);
  const systemReduced = useSyncExternalStore(subscribe, systemPrefersReduced, () => false);
  const reduced = isMotionReduced(preference, systemReduced);

  useEffect(() => applyMotion(reduced), [reduced]);
  useEffect(() => writeJson(APP_CONFIG.motionStorageKey, preference), [preference]);

  const toggle = useCallback(() => setPreference(reduced ? "on" : "off"), [reduced]);

  return { reduced, preference, systemReduced, toggle };
}
