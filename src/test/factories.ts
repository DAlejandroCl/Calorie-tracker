import type { Activity } from "../types";

let next = 0;

/** A valid activity; any field can be overridden. */
export function makeActivity(overrides: Partial<Activity> = {}): Activity {
  next += 1;
  return { id: `id-${next}`, category: 1, description: `Item ${next}`, calories: 100, ...overrides };
}
