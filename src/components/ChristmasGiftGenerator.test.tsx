import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "@/App";

describe("ChristmasGiftGenerator (integration)", () => {
  beforeEach(() => localStorage.clear());

  it("renders and lets the user add and remove participants", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Santa");
    const start = screen.getByRole("button", { name: /start selection/i });
    expect(start).toBeDisabled();

    await user.type(screen.getByLabelText(/participant name/i), "Anna{Enter}");
    expect(screen.getByText("Anna")).toBeInTheDocument();
    expect(start).toBeEnabled();

    await user.type(screen.getByLabelText(/participant name/i), "Anna{Enter}");
    expect(screen.getByText(/already on the list/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove anna/i }));
    expect(screen.queryByText("Anna")).not.toBeInTheDocument();
  });
});
