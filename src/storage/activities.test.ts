import { describe, expect, it, vi } from "vitest";
import { makeActivity } from "../test/factories";
import { loadActivities, saveActivities, STORAGE_KEY } from "./activities";

const store = (value: string | null) => ({ getItem: () => value });

describe("loadActivities", () => {
  it("returns an empty list when nothing is saved", () => {
    expect(loadActivities(store(null))).toEqual([]);
  });

  it("returns the saved activities", () => {
    const saved = [makeActivity(), makeActivity({ category: 2, calories: 300 })];
    expect(loadActivities(store(JSON.stringify(saved)))).toEqual(saved);
  });

  it.each([
    ["invalid JSON", "{not json"],
    ["an empty string", ""],
    ["an object", '{"id":"a"}'],
    ["a number", "42"],
    ["null", "null"],
  ])("returns an empty list for %s", (_name, value) => {
    expect(loadActivities(store(value))).toEqual([]);
  });

  it("drops entries that do not match the schema and keeps the valid ones", () => {
    const valid = makeActivity();
    const saved = [
      valid,
      { id: "a", category: 1, description: "No calories" },
      { id: "b", category: 1, description: "Text calories", calories: "100" },
      { id: "c", category: 1, description: "Decimal", calories: 10.5 },
      { id: "d", category: 1, description: "Zero", calories: 0 },
      { id: "e", category: 1, description: "Too many", calories: 10001 },
      null,
      "text",
    ];

    expect(loadActivities(store(JSON.stringify(saved)))).toEqual([valid]);
  });

  it("returns an empty list when reading storage throws", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
    };

    expect(loadActivities(blocked)).toEqual([]);
  });

  it("reads from localStorage by default", () => {
    const saved = [makeActivity()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    expect(loadActivities()).toEqual(saved);
  });
});

describe("saveActivities", () => {
  it("writes the list as JSON under the storage key", () => {
    const setItem = vi.fn();
    const activities = [makeActivity()];

    saveActivities(activities, { setItem });

    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(activities));
  });

  it("does not throw when storage is full or blocked", () => {
    const full = {
      setItem: () => {
        throw new DOMException("full", "QuotaExceededError");
      },
    };

    expect(() => saveActivities([makeActivity()], full)).not.toThrow();
  });
});
