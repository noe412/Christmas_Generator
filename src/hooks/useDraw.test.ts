import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDraw } from "./useDraw";

describe("useDraw", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("selects a winner from the candidates after the spin", () => {
    const onStart = vi.fn();
    const onWinner = vi.fn();
    const { result } = renderHook(() => useDraw(["Anna", "Ben"], { onStart, onWinner, stepMs: 10, totalMs: 50 }));

    act(() => void result.current.start());
    expect(result.current.phase).toBe("spinning");
    expect(onStart).toHaveBeenCalledOnce();

    act(() => void vi.advanceTimersByTime(60));
    expect(result.current.phase).toBe("done");
    expect(["Anna", "Ben"]).toContain(result.current.winner);
    expect(onWinner).toHaveBeenCalledWith(result.current.winner);
  });

  it("does not start without candidates", () => {
    const { result } = renderHook(() => useDraw([]));
    let started = true;
    act(() => {
      started = result.current.start();
    });
    expect(started).toBe(false);
    expect(result.current.phase).toBe("idle");
  });

  it("ignores a second start while spinning", () => {
    const onStart = vi.fn();
    const { result } = renderHook(() => useDraw(["Anna"], { onStart, stepMs: 10, totalMs: 100 }));
    act(() => void result.current.start());
    act(() => void result.current.start());
    expect(onStart).toHaveBeenCalledOnce();
  });
});
