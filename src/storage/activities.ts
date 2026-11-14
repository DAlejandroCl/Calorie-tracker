import type { Activity } from "../types";
import { ActivitySchema } from "../schemas/activity";

export const STORAGE_KEY = "activities";

/**
 * Reads the saved activities. A value that is not valid JSON or not a list gives an
 * empty list, and an entry that does not match the schema is dropped, so a corrupted
 * or hand-edited value can no longer stop the app from starting.
 */
export function loadActivities(storage: Pick<Storage, "getItem"> = localStorage): Activity[] {
  let raw: unknown;
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved === null) return [];
    raw = JSON.parse(saved);
  } catch {
    return [];
  }

  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry) => {
    const result = ActivitySchema.safeParse(entry);
    return result.success ? [result.data] : [];
  });
}

export function saveActivities(
  activities: Activity[],
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // Storage can be full or blocked (private mode); the app keeps working without saving.
  }
}
