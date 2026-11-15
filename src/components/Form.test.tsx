import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { categories } from "../data/categories";
import { makeActivity } from "../test/factories";
import type { ActivityState } from "../reducers/activity-reducer";
import Form from "./Form";

const emptyState: ActivityState = { activities: [], activeID: "" };

const setup = (state: ActivityState = emptyState) => {
  const dispatch = vi.fn();
  render(<Form dispatch={dispatch} categories={categories} state={state} />);
  return dispatch;
};

const submitButton = () => screen.getByRole("button", { name: /Add Entry|Update Entry/ });
const description = () => screen.getByLabelText("Description:");
const calories = () => screen.getByLabelText("Calories:");

describe("Form", () => {
  it("starts with the Add Entry button disabled", () => {
    setup();
    expect(submitButton()).toBeDisabled();
  });

  it("enables the button for a description and whole calories", async () => {
    setup();

    await userEvent.type(description(), "Salad");
    fireEvent.change(calories(), { target: { value: "150" } });

    expect(submitButton()).toBeEnabled();
  });

  it("keeps the button disabled for a blank description", async () => {
    setup();

    await userEvent.type(description(), "   ");
    fireEvent.change(calories(), { target: { value: "150" } });

    expect(submitButton()).toBeDisabled();
  });

  it.each([
    ["zero", "0"],
    ["a negative number", "-5"],
    ["a decimal", "10.5"],
    ["more than the maximum", "10001"],
  ])("keeps the button disabled for %s calories", async (_name, value) => {
    setup();

    await userEvent.type(description(), "Salad");
    fireEvent.change(calories(), { target: { value } });

    expect(submitButton()).toBeDisabled();
  });

  it("accepts the maximum", async () => {
    setup();

    await userEvent.type(description(), "Feast");
    fireEvent.change(calories(), { target: { value: "10000" } });

    expect(submitButton()).toBeEnabled();
  });

  it("dispatches a new activity with the chosen category, description and calories", async () => {
    const dispatch = setup();

    await userEvent.selectOptions(screen.getByLabelText("Category:"), "Exercise");
    await userEvent.type(description(), "Running");
    fireEvent.change(calories(), { target: { value: "400" } });
    await userEvent.click(submitButton());

    expect(dispatch).toHaveBeenCalledWith({
      type: "ADD_ACTIVITY",
      payload: { newActivity: { id: "", category: 2, description: "Running", calories: 400 } },
    });
  });

  it("clears the fields after adding", async () => {
    setup();

    await userEvent.type(description(), "Salad");
    fireEvent.change(calories(), { target: { value: "150" } });
    await userEvent.click(submitButton());

    expect(description()).toHaveValue("");
    expect(calories()).toHaveValue(0);
  });

  it("fills the fields from the activity being edited and offers Update Entry", () => {
    const activity = makeActivity({ category: 2, description: "Running", calories: 400 });
    setup({ activities: [activity], activeID: activity.id });

    expect(screen.getByLabelText("Category:")).toHaveValue("2");
    expect(description()).toHaveValue("Running");
    expect(calories()).toHaveValue(400);
    expect(screen.getByRole("button", { name: "Update Entry" })).toBeEnabled();
  });

  it("dispatches the update with the edited values and the same id", async () => {
    const activity = makeActivity({ description: "Salad", calories: 150 });
    const dispatch = setup({ activities: [activity], activeID: activity.id });

    fireEvent.change(calories(), { target: { value: "200" } });
    await userEvent.click(screen.getByRole("button", { name: "Update Entry" }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_ACTIVITY",
      payload: { updatedActivity: { ...activity, calories: 200 } },
    });
  });

  it("describes the calories limit for assistive technology", () => {
    setup();
    expect(calories()).toHaveAccessibleDescription("Whole number from 1 to 10,000.");
  });

  it("has no detectable accessibility violations", async () => {
    const dispatch = vi.fn();
    const { container } = render(<Form dispatch={dispatch} categories={categories} state={emptyState} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
