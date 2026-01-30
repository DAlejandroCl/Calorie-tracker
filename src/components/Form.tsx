import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent, Dispatch } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Activity } from "../types";
import { categories } from "../data/categories";
import type { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  categories: { id: number; name: string }[];
  state: ActivityState;
};

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  description: "",
  calories: 0,
};

export default function Form({dispatch, state}: FormProps) {
  const [activity, setActivity] = useState<Activity>(initialState);
  
  useEffect(() => {
    if (state.activeID) {
      const selectedActivity = state.activities.find(act => act.id === state.activeID);
      if (selectedActivity) {
        setActivity(selectedActivity);
      }
    }
  }, [state.activeID, state.activities]);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const isNumberField = ["category", "calories"].includes(e.target.id);
    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? Number(e.target.value) : e.target.value,
    });
  };

  const isValidActivity = () => {
    const { description, calories } = activity;
    return description.trim() !== "" && calories > 0;
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

    setActivity({ ...initialState, id: uuidv4() });
  };

  return (
    <div>
      <form
        className="space-y-5 bg-white shadow p-10 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-3">
          <label htmlFor="category">Category: </label>
          <select
            className="border border-slate-300 p-2 rounded-lg w-full bg-white"
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
            className="border border-slate-300 p-2 rounded-lg w-full bg-white"
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
            className="border border-slate-300 p-2 rounded-lg w-full bg-white"
            placeholder="e.g., 300, 150, 50, 500, 200"
            value={activity.calories}
            onChange={handleChange}
          />
        </div>

        <input
          className="bg-lime-600 text-white uppercase font-bold w-full p-2 rounded-lg cursor-pointer 
          hover:bg-lime-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          value="Add Entry"
          disabled={!isValidActivity()}
        />
      </form>
    </div>
  );
}
