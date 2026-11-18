import { describe, expect, it } from "vitest";
import { APP_CONFIG } from "@/config";
import { mergeNames, normalizeName, normalizeNames, parseNamesFile, serializeNames } from "./names";

describe("normalizeName", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeName("  Anna   Maria ")).toBe("Anna Maria");
  });
  it("rejects non-string values", () => {
    expect(normalizeName(null)).toBe("");
    expect(normalizeName({})).toBe("");
  });
  it("accepts numbers", () => {
    expect(normalizeName(42)).toBe("42");
  });
  it("enforces the maximum length", () => {
    expect(normalizeName("x".repeat(500))).toHaveLength(APP_CONFIG.limits.maxNameLength);
  });
});

describe("normalizeNames / mergeNames", () => {
  it("removes empties and duplicates while keeping order", () => {
    expect(normalizeNames(["Ben", " ", "Anna", "Ben ", null])).toEqual(["Ben", "Anna"]);
  });
  it("caps the list size", () => {
    const many = Array.from({ length: APP_CONFIG.limits.maxNames + 50 }, (_, i) => `n${i}`);
    expect(normalizeNames(many)).toHaveLength(APP_CONFIG.limits.maxNames);
  });
  it("merges lists without duplicates", () => {
    expect(mergeNames(["Anna"], ["Ben", "Anna"])).toEqual(["Anna", "Ben"]);
  });
});

describe("parseNamesFile", () => {
  it("parses a plain array", () => {
    expect(parseNamesFile('["Anna","Ben"]')).toEqual(["Anna", "Ben"]);
  });
  it("parses an object with a names property", () => {
    expect(parseNamesFile('{"names":["Anna"]}')).toEqual(["Anna"]);
  });
  it("round-trips with serializeNames", () => {
    expect(parseNamesFile(serializeNames(["A", "B"]))).toEqual(["A", "B"]);
  });
  it("throws on invalid shapes", () => {
    expect(() => parseNamesFile('{"foo":1}')).toThrow();
    expect(() => parseNamesFile("not json")).toThrow();
  });
});
