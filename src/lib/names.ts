import { APP_CONFIG } from "@/config";

const { maxNameLength, maxNames } = APP_CONFIG.limits;

/** Trims, collapses whitespace and enforces the maximum length of a single name. */
export function normalizeName(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).replace(/\s+/g, " ").trim().slice(0, maxNameLength);
}

/** Normalizes a list of raw values into a de-duplicated, size-limited list of names. */
export function normalizeNames(values: readonly unknown[]): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    const name = normalizeName(value);
    if (name) seen.add(name);
    if (seen.size >= maxNames) break;
  }
  return Array.from(seen);
}

/** Merges two name lists, preserving order and removing duplicates. */
export function mergeNames(current: readonly string[], incoming: readonly unknown[]): string[] {
  return normalizeNames([...current, ...incoming]);
}

/**
 * Parses an exported names file.
 * Accepts either a plain JSON array (`["Anna", "Ben"]`) or an object `{ "names": [...] }`.
 * @throws Error when the payload is not valid JSON or has an unexpected shape.
 */
export function parseNamesFile(text: string): string[] {
  const data: unknown = JSON.parse(text);
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { names?: unknown }).names)
      ? (data as { names: unknown[] }).names
      : null;
  if (!list) throw new Error("Expected a JSON array of names.");
  return normalizeNames(list);
}

/** Serializes names for export. */
export function serializeNames(names: readonly string[]): string {
  return JSON.stringify(names, null, 2);
}
