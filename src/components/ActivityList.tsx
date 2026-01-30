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
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<number, string>);
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
    []
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
    []
  );

  const isEmptyActivities = useMemo(
    () => activities.length === 0,
    [activities]
  );

  return (
    <>
      <h2 className="text-4xl font-bold text-lime-600 text-center">
        Food and Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-center">No activities yet</p>
      ) : (
        isEmptyActivities
      )}

      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white shadow px-5 py-10 rounded-lg mt-5 flex justify-between items-center relative"
        >
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {activity.description}
            </h3>
            <p className={caloriesClass(activity.category)}>
              {activity.calories} Calories
            </p>
          </div>

          <span
            className={`${categoryClass(
              activity.category
            )} text-sm font-medium px-2.5 py-0.5 rounded absolute top-2 right-2`}
          >
            {categoryMap[activity.category] ?? "Unknown"}
          </span>

          <div className="flex gap-5 items-center">
            <button
              onClick={() =>
                dispatch({
                  type: "SET_ACTIVE_ACTIVITY",
                  payload: { id: activity.id },
                })
              }
            >
              <PencilSquareIcon className="h-6 w-6 text-slate-600 hover:text-lime-600" />
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: "REMOVE_ACTIVITY",
                  payload: { id: activity.id },
                })
              }
            >
              <XCircleIcon className="h-6 w-6 text-slate-600 hover:text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
