import { useMemo } from "react";
import type { Dispatch } from "react";
import type { Activity } from "../types";
import { categories } from "../data/categories";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/solid";
import type { ActivityActions } from "../reducers/activity-reducer";

type ActivityListProps = {
  activities: Activity[];
  dispatch: Dispatch<ActivityActions>;
};

export default function ActivityList({
  activities,
  dispatch,
}: ActivityListProps) {
  const categoryMap = useMemo(() => {
    return categories.reduce(
      (acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, []);

  const categoryClass = useMemo(
    () => (categoryId: number) => {
      switch (categoryId) {
        case 1:
          return "bg-lime-200 text-lime-600";
        case 2:
          return "bg-red-200 text-red-600";
        default:
          return "bg-gray-200 text-gray-600";
      }
    },
    [],
  );

  const caloriesClass = useMemo(
    () => (categoryId: number) => {
      switch (categoryId) {
        case 1:
          return "text-lime-600 text-xl font-bold";
        case 2:
          return "text-red-600 text-xl font-bold";
        default:
          return "text-gray-600 text-xl font-bold";
      }
    },
    [],
  );

  return (
    <>
      <h2 className="text-4xl font-extrabold text-slate-800 text-center mb-10">
        Food and Activities
      </h2>

      {activities.length === 0 && (
        <p className="text-center text-slate-500 mt-6">
          No activities added yet
        </p>
      )}

      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white border border-slate-200 rounded-xl p-6 mt-6 
  flex justify-between items-center shadow-sm hover:shadow-md transition"
        >
          {/* Left */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {activity.description}
            </h3>

            <p className={caloriesClass(activity.category)}>
              {activity.calories} Calories
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-4">
            <span
              className={`${categoryClass(activity.category)} 
      text-xs font-semibold px-3 py-1 rounded-full`}
            >
              {categoryMap[activity.category] ?? "Unknown"}
            </span>

            <div className="flex gap-4">
              <button
                type="button"
                aria-label={`Edit ${activity.description}`}
                onClick={() =>
                  dispatch({
                    type: "SET_ACTIVE_ACTIVITY",
                    payload: { id: activity.id },
                  })
                }
              >
                <PencilSquareIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-slate-400 hover:text-lime-600 transition"
                />
              </button>

              <button
                type="button"
                aria-label={`Remove ${activity.description}`}
                onClick={() =>
                  dispatch({
                    type: "REMOVE_ACTIVITY",
                    payload: { id: activity.id },
                  })
                }
              >
                <XCircleIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-slate-400 hover:text-red-500 transition"
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
