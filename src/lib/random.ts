/**
 * Returns an unbiased random integer in `[0, max)`.
 * Uses the Web Crypto API (rejection sampling) when available so draws are fair,
 * and falls back to Math.random in environments without crypto.
 */
export function randomIndex(max: number): number {
  if (!Number.isInteger(max) || max <= 0) throw new RangeError("max must be a positive integer");
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) return Math.floor(Math.random() * max);

  const range = 0x1_0000_0000; // 2^32
  const limit = range - (range % max);
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    cryptoApi.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

/** Picks a random element from a non-empty list. */
export function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) throw new RangeError("Cannot pick from an empty list");
  return items[randomIndex(items.length)];
}
