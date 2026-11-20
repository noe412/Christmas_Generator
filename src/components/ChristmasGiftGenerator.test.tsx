import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { APP_CONFIG } from "@/config";

describe("ChristmasGiftGenerator (integration)", () => {
  beforeEach(() => {
    localStorage.clear();
    // jsdom has no media playback.
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("adds and removes participants via the setup drawer", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Santa’s helper");
    expect(screen.getByRole("button", { name: /start the draw/i })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /^names/i }));
    const dialog = await screen.findByRole("dialog", { name: /set up the draw/i });

    await user.type(within(dialog).getByLabelText(/participant name/i), "Anna{Enter}");
    expect(within(dialog).getByText("Anna")).toBeInTheDocument();

    await user.type(within(dialog).getByLabelText(/participant name/i), "Anna{Enter}");
    expect(within(dialog).getByText(/already on the list/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /remove anna/i }));
    expect(within(dialog).queryByText("Anna")).not.toBeInTheDocument();
  });

  it("draws a winner, moves them to 'already drawn' and starts a new round", async () => {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(["Ben"]));
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start the draw/i }));
    act(() => void vi.advanceTimersByTime(APP_CONFIG.spinTotalMs + 500));

    expect(screen.getByText(/is handing out the presents/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(APP_CONFIG.drawnStorageKey)!)).toEqual(["Ben"]);
    expect(JSON.parse(localStorage.getItem(APP_CONFIG.storageKey)!)).toEqual([]);

    await user.click(screen.getByRole("button", { name: /^names/i }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/already drawn · 1/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: /new round/i }));
    expect(within(dialog).getByText(/in the hat · 1/i)).toBeInTheDocument();
  });

  it("persists the sound preference", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /mute jingles/i }));
    expect(screen.getByRole("button", { name: /unmute jingles/i })).toBeInTheDocument();
    expect(localStorage.getItem(APP_CONFIG.soundStorageKey)).toBe("false");
  });

  it("shakes the snow off the stage and lets it settle again", async () => {
    const user = userEvent.setup();
    render(<App />);
    const [stageSnow] = screen.getAllByRole("button", { name: /shake off the snow/i });
    await user.click(stageSnow);
    expect(stageSnow).toBeDisabled();
    expect(document.querySelectorAll(".animate-snow-drop").length).toBeGreaterThan(0);
  });

  it("offers an animations switch in the dock", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /turn animations off/i }));
    expect(document.documentElement.dataset.motion).toBe("reduced");
    expect(screen.getByRole("button", { name: /turn animations on/i })).toBeInTheDocument();
  });
});
