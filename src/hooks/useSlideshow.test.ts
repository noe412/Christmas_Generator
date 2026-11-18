import { act, renderHook } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { useSlideshow } from "./useSlideshow";

const image = (name: string) => new File(["x"], name, { type: "image/png" });

describe("useSlideshow", () => {
  beforeAll(() => {
    let n = 0;
    URL.createObjectURL = vi.fn(() => `blob:${++n}`);
    URL.revokeObjectURL = vi.fn();
  });

  it("accepts only images and navigates cyclically", () => {
    const { result } = renderHook(() => useSlideshow());
    let accepted = 0;
    act(() => {
      accepted = result.current.addFiles([
        image("a.png"),
        image("b.png"),
        new File(["x"], "c.txt", { type: "text/plain" }),
      ]);
    });
    expect(accepted).toBe(2);
    expect(result.current.slides).toHaveLength(2);

    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => result.current.next());
    expect(result.current.index).toBe(0);
    act(() => result.current.prev());
    expect(result.current.index).toBe(1);
  });

  it("clamps the index and revokes the URL when the current slide is removed", () => {
    const { result } = renderHook(() => useSlideshow());
    act(() => void result.current.addFiles([image("a.png"), image("b.png")]));
    act(() => result.current.setIndex(1));
    const last = result.current.slides[1];
    act(() => result.current.remove(last.id));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(last.url);
    expect(result.current.slides).toHaveLength(1);
    expect(result.current.index).toBe(0);
  });
});
