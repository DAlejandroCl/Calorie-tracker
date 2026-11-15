import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { makeActivity } from "../test/factories";
import CaloriesTracker from "./CaloriesTracker";

/** The big number shown above a label such as "Consumed". */
const figure = (label: string) => {
  const card = screen.getByText(label).closest("p") as HTMLElement;
  return within(card).getAllByText(/^-?\d+$/)[0];
};

describe("CaloriesTracker", () => {
  it("shows zeros for an empty list", () => {
    render(<CaloriesTracker activities={[]} />);

    expect(figure("Consumed")).toHaveTextContent("0");
    expect(figure("Burned")).toHaveTextContent("0");
    expect(figure("Net")).toHaveTextContent("0");
  });

  it("adds only food to consumed", () => {
    render(
      <CaloriesTracker
        activities={[makeActivity({ calories: 200 }), makeActivity({ calories: 350 })]}
      />,
    );

    expect(figure("Consumed")).toHaveTextContent("550");
    expect(figure("Burned")).toHaveTextContent("0");
    expect(figure("Net")).toHaveTextContent("550");
  });

  it("adds only exercise to burned and gives a negative net", () => {
    render(<CaloriesTracker activities={[makeActivity({ category: 2, calories: 400 })]} />);

    expect(figure("Consumed")).toHaveTextContent("0");
    expect(figure("Burned")).toHaveTextContent("400");
    expect(figure("Net")).toHaveTextContent("-400");
    expect(figure("Net")).toHaveClass("text-red-500");
  });

  it("subtracts burned from consumed", () => {
    render(
      <CaloriesTracker
        activities={[
          makeActivity({ category: 1, calories: 900 }),
          makeActivity({ category: 2, calories: 300 }),
        ]}
      />,
    );

    expect(figure("Net")).toHaveTextContent("600");
    expect(figure("Net")).toHaveClass("text-lime-400");
  });

  it("ignores an activity of an unknown category", () => {
    render(<CaloriesTracker activities={[makeActivity({ category: 9, calories: 500 })]} />);

    expect(figure("Consumed")).toHaveTextContent("0");
    expect(figure("Burned")).toHaveTextContent("0");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<CaloriesTracker activities={[makeActivity()]} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
