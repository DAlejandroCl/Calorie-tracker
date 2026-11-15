import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import App from "./App";
import { makeActivity } from "./test/factories";

async function add(text: string, kcal: number, category?: "Food" | "Exercise") {
  if (category) await userEvent.selectOptions(screen.getByLabelText("Category:"), category);
  await userEvent.type(screen.getByLabelText("Description:"), text);
  fireEvent.change(screen.getByLabelText("Calories:"), { target: { value: String(kcal) } });
  await userEvent.click(screen.getByRole("button", { name: "Add Entry" }));
}

const figure = (label: string) =>
  within(screen.getByText(label).closest("p") as HTMLElement).getAllByText(/^-?\d+$/)[0];

describe("App", () => {
  it("starts empty", () => {
    render(<App />);

    expect(screen.getByText("No activities added yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  it("adds food and exercise and updates the summary", async () => {
    render(<App />);

    await add("Pasta", 800, "Food");
    await add("Running", 300, "Exercise");

    expect(screen.getByRole("heading", { name: "Pasta" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Running" })).toBeInTheDocument();
    expect(figure("Consumed")).toHaveTextContent("800");
    expect(figure("Burned")).toHaveTextContent("300");
    expect(figure("Net")).toHaveTextContent("500");
  });

  it("keeps the list after the page is loaded again", async () => {
    const first = render(<App />);
    await add("Pasta", 800);
    first.unmount();

    render(<App />);

    expect(screen.getByRole("heading", { name: "Pasta" })).toBeInTheDocument();
    expect(figure("Consumed")).toHaveTextContent("800");
  });

  it("edits an activity and goes back to a new entry", async () => {
    render(<App />);
    await add("Pasta", 800);

    await userEvent.click(screen.getByRole("button", { name: "Edit Pasta" }));
    expect(screen.getByLabelText("Description:")).toHaveValue("Pasta");

    fireEvent.change(screen.getByLabelText("Calories:"), { target: { value: "600" } });
    await userEvent.click(screen.getByRole("button", { name: "Update Entry" }));

    expect(screen.getByText("600 Calories")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Pasta" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Add Entry" })).toBeInTheDocument();
    expect(screen.getByLabelText("Description:")).toHaveValue("");
  });

  it("removes an activity", async () => {
    render(<App />);
    await add("Pasta", 800);

    await userEvent.click(screen.getByRole("button", { name: "Remove Pasta" }));

    expect(screen.queryByRole("heading", { name: "Pasta" })).not.toBeInTheDocument();
    expect(figure("Consumed")).toHaveTextContent("0");
  });

  it("leaves edit mode and empties the form when the edited activity is removed", async () => {
    render(<App />);
    await add("Pasta", 800);
    await userEvent.click(screen.getByRole("button", { name: "Edit Pasta" }));
    expect(screen.getByRole("button", { name: "Update Entry" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Remove Pasta" }));

    expect(screen.getByRole("button", { name: "Add Entry" })).toBeInTheDocument();
    expect(screen.getByLabelText("Description:")).toHaveValue("");
    expect(screen.getByLabelText("Calories:")).toHaveValue(0);
  });

  it("resets the whole list", async () => {
    render(<App />);
    await add("Pasta", 800);

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("No activities added yet")).toBeInTheDocument();
    expect(localStorage.getItem("activities")).toBe("[]");
  });

  it("starts normally when the saved value is corrupted", () => {
    localStorage.setItem("activities", "{this is not json");

    render(<App />);

    expect(screen.getByText("No activities added yet")).toBeInTheDocument();
  });

  it("keeps the valid saved entries and drops the invalid ones", () => {
    localStorage.setItem(
      "activities",
      JSON.stringify([makeActivity({ description: "Valid" }), { id: "x", description: "Broken" }]),
    );

    render(<App />);

    expect(screen.getByRole("heading", { name: "Valid" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Broken" })).not.toBeInTheDocument();
  });

  it("has no detectable accessibility violations with entries listed", async () => {
    const { container } = render(<App />);
    await add("Pasta", 800, "Food");
    await add("Running", 300, "Exercise");

    expect((await axe(container)).violations).toEqual([]);
  });
});
