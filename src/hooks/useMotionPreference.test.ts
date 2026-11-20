import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { APP_CONFIG } from "@/config";
import { isMotionReduced, useMotionPreference } from "./useMotionPreference";

function mockSystemReduced(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  );
}

describe("isMotionReduced", () => {
  it("follows the system until the user decides", () => {
    expect(isMotionReduced("system", true)).toBe(true);
    expect(isMotionReduced("system", false)).toBe(false);
    expect(isMotionReduced("on", true)).toBe(false);
    expect(isMotionReduced("off", false)).toBe(true);
  });
});

describe("useMotionPreference", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("lets the user turn animations on although the system reduces motion", () => {
    mockSystemReduced(true);
    const { result } = renderHook(() => useMotionPreference());
    expect(result.current.reduced).toBe(true);
    expect(document.documentElement.dataset.motion).toBe("reduced");

    act(() => result.current.toggle());
    expect(result.current.reduced).toBe(false);
    expect(document.documentElement.dataset.motion).toBe("full");
    expect(localStorage.getItem(APP_CONFIG.motionStorageKey)).toBe('"on"');
  });
});
