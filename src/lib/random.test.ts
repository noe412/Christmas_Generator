import { describe, expect, it } from "vitest";
import { pickRandom, randomIndex } from "./random";

describe("randomIndex", () => {
  it("stays within bounds", () => {
    for (let i = 0; i < 1000; i++) {
      const v = randomIndex(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
  });
  it("rejects invalid ranges", () => {
    expect(() => randomIndex(0)).toThrow(RangeError);
    expect(() => randomIndex(1.5)).toThrow(RangeError);
  });
  it("is roughly uniform", () => {
    const counts = [0, 0, 0, 0];
    const runs = 20_000;
    for (let i = 0; i < runs; i++) counts[randomIndex(4)]++;
    counts.forEach((c) => expect(Math.abs(c - runs / 4)).toBeLessThan(runs * 0.03));
  });
});

describe("pickRandom", () => {
  it("returns an element of the list", () => {
    expect(["a", "b"]).toContain(pickRandom(["a", "b"]));
  });
  it("throws for an empty list", () => {
    expect(() => pickRandom([])).toThrow(RangeError);
  });
});
