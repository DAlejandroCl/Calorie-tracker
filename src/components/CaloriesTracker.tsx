import { useMemo } from "react";
import type { Activity } from "../types";
import CaloriesDisplay from "./CaloriesDisplay";

type CaloriesTrackerProps = {
  activities: Activity[];
};

export default function CaloriesTracker({ activities }: CaloriesTrackerProps) {
  const caloriesConsumed = useMemo(
    () =>
      activities.reduce(
        (total, activity) =>
          activity.category === 1 ? total + activity.calories : total,
        0,
      ),
    [activities],
  );

  const caloriesBurned = useMemo(
    () =>
      activities.reduce(
        (total, activity) =>
          activity.category === 2 ? total + activity.calories : total,
        0,
      ),
    [activities],
  );

  const netCalories = useMemo(() => {
    return caloriesConsumed - caloriesBurned;
  }, [caloriesConsumed, caloriesBurned]);

  return (
    <>
      <h2 className="text-4xl font-extrabold text-white text-center tracking-tight">
        Calories Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <CaloriesDisplay calories={caloriesConsumed} text="Consumed" />
        <CaloriesDisplay calories={caloriesBurned} text="Burned" />
        <CaloriesDisplay
  calories={netCalories}
  text="Net"
  variant={netCalories < 0 ? "negative" : "positive"}
/>

      </div>
    </>
  );
}
