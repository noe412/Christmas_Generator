/** Safe wrappers around localStorage (private mode, quota and disabled storage never throw). */
export function readJson<T>(key: string, fallback: T): T | unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as unknown);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable – the app keeps working in memory */
  }
}
