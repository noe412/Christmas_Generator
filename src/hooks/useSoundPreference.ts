import { useCallback, useEffect, useState } from "react";
import { APP_CONFIG } from "@/config";
import { readJson, writeJson } from "@/lib/storage";

/** Persisted on/off switch for the jingles. */
export function useSoundPreference() {
  const [enabled, setEnabled] = useState(() => readJson(APP_CONFIG.soundStorageKey, true) !== false);
  useEffect(() => writeJson(APP_CONFIG.soundStorageKey, enabled), [enabled]);
  const toggle = useCallback(() => setEnabled((v) => !v), []);
  return { enabled, toggle };
}
