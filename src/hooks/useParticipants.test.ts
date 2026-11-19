import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { APP_CONFIG } from "@/config";
import { useParticipants } from "./useParticipants";

describe("useParticipants", () => {
  beforeEach(() => localStorage.clear());

  it("adds, rejects duplicates and persists", () => {
    const { result } = renderHook(() => useParticipants());
    act(() => void expect(result.current.add(" Anna ")).toBe("added"));
    expect(result.current.add("Anna")).toBe("duplicate");
    expect(result.current.add("  ")).toBe("empty");
    expect(result.current.names).toEqual(["Anna"]);
    expect(JSON.parse(localStorage.getItem(APP_CONFIG.storageKey)!)).toEqual(["Anna"]);
  });

  it("restores and sanitizes persisted names", () => {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(["Ben", "Ben", " ", 7]));
    const { result } = renderHook(() => useParticipants());
    expect(result.current.names).toEqual(["Ben", "7"]);
  });

  it("survives corrupted storage", () => {
    localStorage.setItem(APP_CONFIG.storageKey, "{broken");
    const { result } = renderHook(() => useParticipants());
    expect(result.current.names).toEqual([]);
  });

  it("imports names from a file", async () => {
    const { result } = renderHook(() => useParticipants());
    const file = new File(['["Cara","Dan"]'], "names.json", { type: "application/json" });
    await act(async () => void (await result.current.importFromFile(file)));
    expect(result.current.names).toEqual(["Cara", "Dan"]);
  });

  it("moves winners to the drawn list and restores them on a new round", () => {
    const { result } = renderHook(() => useParticipants());
    act(() => void result.current.add("Anna"));
    act(() => void result.current.add("Ben"));
    act(() => result.current.markDrawn("Anna"));
    expect(result.current.names).toEqual(["Ben"]);
    expect(result.current.drawn).toEqual(["Anna"]);
    expect(result.current.add("Anna")).toBe("duplicate");

    act(() => result.current.resetRound());
    expect(result.current.names).toEqual(["Ben", "Anna"]);
    expect(result.current.drawn).toEqual([]);
  });

  it("removes names", () => {
    const { result } = renderHook(() => useParticipants());
    act(() => void result.current.add("Eva"));
    act(() => result.current.remove("Eva"));
    expect(result.current.names).toEqual([]);
  });
});
