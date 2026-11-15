import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { makeActivity } from "../test/factories";
import ActivityList from "./ActivityList";

describe("ActivityList", () => {
  it("says so when there are no activities", () => {
    render(<ActivityList activities={[]} dispatch={vi.fn()} />);

    expect(screen.getByText("No activities added yet")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows each activity with its calories and category", () => {
    render(
      <ActivityList
        activities={[
          makeActivity({ description: "Salad", calories: 150 }),
          makeActivity({ description: "Running", category: 2, calories: 400 }),
        ]}
        dispatch={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Salad" })).toBeInTheDocument();
    expect(screen.getByText("150 Calories")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Exercise")).toBeInTheDocument();
  });

  it("names the edit and remove buttons after their activity", () => {
    render(
      <ActivityList activities={[makeActivity({ description: "Salad" })]} dispatch={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Edit Salad" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Salad" })).toBeInTheDocument();
  });

  it("dispatches the selected activity to edit", async () => {
    const dispatch = vi.fn();
    const activity = makeActivity({ description: "Salad" });
    render(<ActivityList activities={[activity]} dispatch={dispatch} />);

    await userEvent.click(screen.getByRole("button", { name: "Edit Salad" }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_ACTIVE_ACTIVITY",
      payload: { id: activity.id },
    });
  });

  it("dispatches the removal of the activity", async () => {
    const dispatch = vi.fn();
    const activity = makeActivity({ description: "Salad" });
    render(<ActivityList activities={[activity]} dispatch={dispatch} />);

    await userEvent.click(screen.getByRole("button", { name: "Remove Salad" }));

    expect(dispatch).toHaveBeenCalledWith({ type: "REMOVE_ACTIVITY", payload: { id: activity.id } });
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <ActivityList activities={[makeActivity(), makeActivity({ category: 2 })]} dispatch={vi.fn()} />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
