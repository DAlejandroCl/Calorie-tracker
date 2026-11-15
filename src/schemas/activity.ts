import { z } from "zod";

/** The most calories one entry may have: a safe upper bound for a single meal or workout. */
export const MAX_CALORIES = 10000;

export const ActivitySchema = z.object({
  id: z.string(),
  category: z.number().int(),
  description: z.string(),
  calories: z.number().int().min(1).max(MAX_CALORIES),
});

export const ActivitiesSchema = z.array(ActivitySchema);
