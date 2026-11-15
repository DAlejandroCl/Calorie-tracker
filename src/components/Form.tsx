import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent, Dispatch } from "react";
import type { Activity } from "../types";
import { categories } from "../data/categories";
import { MAX_CALORIES } from "../schemas/activity";
import type {
  ActivityActions,
  ActivityState,
} from "../reducers/activity-reducer";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  categories: { id: number; name: string }[];
  state: ActivityState;
};

// The id stays empty: the reducer gives each new activity its own id.
const initialState: Activity = {
  id: "",
  category: 1,
  description: "",
  calories: 0,
};

export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>(initialState);

  useEffect(() => {
    if (state.activeID) {
      const selectedActivity = state.activities.find(
        (act) => act.id === state.activeID,
      );
      if (selectedActivity) {
        setActivity(selectedActivity);
      }
    }
  }, [state.activeID, state.activities]);

  // When the activity being edited is removed, the form goes back to a new entry.
  useEffect(() => {
    if (!state.activeID && activity.id !== "") {
      setActivity(initialState);
    }
  }, [state.activeID, activity.id]);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    const isNumberField = ["category", "calories"].includes(e.target.id);
    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? Number(e.target.value) : e.target.value,
    });
  };

  const isValidActivity = () => {
    const { description, calories } = activity;
    return (
      description.trim() !== "" &&
      Number.isInteger(calories) &&
      calories >= 1 &&
      calories <= MAX_CALORIES
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (state.activeID) {
      dispatch({
        type: "UPDATE_ACTIVITY",
        payload: { updatedActivity: activity },
      });
    } else {
      dispatch({
        type: "ADD_ACTIVITY",
        payload: { newActivity: activity },
      });
    }

    setActivity(initialState);
  };

  return (
    <div>
      <form
        className="space-y-6 bg-white shadow-lg border border-slate-200 p-8 rounded-xl"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-3">
          <label
            className="text-sm font-semibold text-slate-700"
            htmlFor="category"
          >
            Category:{" "}
          </label>
          <select
            className="border border-slate-300 p-3 rounded-md w-full bg-white 
focus:outline-none focus:ring-2 focus:ring-lime-500"
            id="category"
            value={activity.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label htmlFor="description">Description: </label>
          <input
            type="text"
            id="description"
            className="border border-slate-300 p-3 rounded-md w-full bg-white 
focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="e.g., French fries, Cesar salad, Orange juice, Running, Weightlifting"
            value={activity.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label htmlFor="calories">Calories: </label>
          <input
            type="number"
            id="calories"
            min={1}
            max={MAX_CALORIES}
            step={1}
            aria-describedby="calories-hint"
            className="border border-slate-300 p-3 rounded-md w-full bg-white 
focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="e.g., 300, 150, 50, 500, 200"
            value={activity.calories}
            onChange={handleChange}
          />
          <p id="calories-hint" className="text-sm text-slate-600">
            Whole number from 1 to {MAX_CALORIES.toLocaleString("en-US")}.
          </p>
        </div>

        <input
          className="bg-lime-600 text-white uppercase font-semibold tracking-wide w-full p-3 
  rounded-md cursor-pointer hover:bg-lime-700 transition disabled:opacity-40"
          type="submit"
          value={state.activeID ? "Update Entry" : "Add Entry"}
          disabled={!isValidActivity()}
        />
      </form>
    </div>
  );
}
