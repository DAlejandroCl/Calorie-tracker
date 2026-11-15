import { describe, expect, it } from "vitest";
import { makeActivity } from "../test/factories";
import { activityReducer, createInitialState, type ActivityState } from "./activity-reducer";

const stateWith = (...activities: ActivityState["activities"]): ActivityState => ({
  activities,
  activeID: "",
});

describe("activityReducer", () => {
  it("adds an activity and gives it its own id, ignoring the one it came with", () => {
    const incoming = makeActivity({ id: "from-the-form" });

    const state = activityReducer(stateWith(), {
      type: "ADD_ACTIVITY",
      payload: { newActivity: incoming },
    });

    expect(state.activities).toHaveLength(1);
    expect(state.activities[0].id).not.toBe("from-the-form");
    expect(state.activities[0]).toMatchObject({ description: incoming.description, calories: 100 });
  });

  it("gives two added activities different ids", () => {
    const first = activityReducer(stateWith(), {
      type: "ADD_ACTIVITY",
      payload: { newActivity: makeActivity() },
    });
    const second = activityReducer(first, {
      type: "ADD_ACTIVITY",
      payload: { newActivity: makeActivity() },
    });

    expect(new Set(second.activities.map((a) => a.id)).size).toBe(2);
  });

  it("removes only the activity with that id", () => {
    const keep = makeActivity();
    const drop = makeActivity();

    const state = activityReducer(stateWith(keep, drop), {
      type: "REMOVE_ACTIVITY",
      payload: { id: drop.id },
    });

    expect(state.activities).toEqual([keep]);
  });

  it("leaves edit mode alone when another activity is removed", () => {
    const editing = makeActivity();
    const other = makeActivity();

    const state = activityReducer(
      { activities: [editing, other], activeID: editing.id },
      { type: "REMOVE_ACTIVITY", payload: { id: other.id } },
    );

    expect(state.activeID).toBe(editing.id);
  });

  it("ends edit mode when the activity being edited is removed", () => {
    const editing = makeActivity();

    const state = activityReducer(
      { activities: [editing], activeID: editing.id },
      { type: "REMOVE_ACTIVITY", payload: { id: editing.id } },
    );

    expect(state.activities).toEqual([]);
    expect(state.activeID).toBe("");
  });

  it("selects an activity for editing", () => {
    const state = activityReducer(stateWith(makeActivity({ id: "a" })), {
      type: "SET_ACTIVE_ACTIVITY",
      payload: { id: "a" },
    });

    expect(state.activeID).toBe("a");
  });

  it("replaces the activity on update and ends edit mode", () => {
    const original = makeActivity({ id: "a", description: "Old", calories: 100 });
    const untouched = makeActivity({ id: "b" });

    const state = activityReducer(
      { activities: [original, untouched], activeID: "a" },
      {
        type: "UPDATE_ACTIVITY",
        payload: { updatedActivity: { ...original, description: "New", calories: 250 } },
      },
    );

    expect(state.activities[0]).toMatchObject({ id: "a", description: "New", calories: 250 });
    expect(state.activities[1]).toBe(untouched);
    expect(state.activeID).toBe("");
  });

  it("empties the list and ends edit mode on restart", () => {
    const state = activityReducer(
      { activities: [makeActivity()], activeID: "x" },
      { type: "RESTART_APP" },
    );

    expect(state).toEqual({ activities: [], activeID: "" });
  });

  it("does not mutate the previous state", () => {
    const before = stateWith(makeActivity());
    const snapshot = structuredClone(before);

    activityReducer(before, { type: "RESTART_APP" });
    activityReducer(before, { type: "REMOVE_ACTIVITY", payload: { id: before.activities[0].id } });

    expect(before).toEqual(snapshot);
  });
});

describe("createInitialState", () => {
  it("starts with the saved activities and no edit in progress", () => {
    localStorage.setItem("activities", JSON.stringify([makeActivity({ id: "saved" })]));

    const state = createInitialState();

    expect(state.activities.map((a) => a.id)).toEqual(["saved"]);
    expect(state.activeID).toBe("");
  });

  it("starts empty when nothing is saved", () => {
    expect(createInitialState()).toEqual({ activities: [], activeID: "" });
  });
});
