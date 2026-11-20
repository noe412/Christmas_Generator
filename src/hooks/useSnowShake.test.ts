import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SNOW_FALL_MS, SNOW_REGROW_MS, useSnowShake } from "./useSnowShake";

describe("useSnowShake", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("falls, regrows and rests again; ignores shakes while not resting", () => {
    const { result } = renderHook(() => useSnowShake());
    act(() => result.current.shake());
    expect(result.current.phase).toBe("falling");
    act(() => result.current.shake());
    expect(result.current.shakes).toBe(1);

    act(() => void vi.advanceTimersByTime(SNOW_FALL_MS));
    expect(result.current.phase).toBe("regrowing");
    act(() => void vi.advanceTimersByTime(SNOW_REGROW_MS));
    expect(result.current.phase).toBe("resting");
  });
});
