import { useEffect, useMemo, useReducer } from "react";
import Form from "./components/Form";
import { activityReducer, initialState } from "./reducers/activity-reducer";
import { categories } from "./data/categories";
import ActivityList from "./components/ActivityList";
import CaloriesTracker from "./components/CaloriesTracker";

function App() {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(state.activities));
  }, [state.activities]);

  const canRestartApp = useMemo(
    () => state.activities.length > 0,
    [state.activities]
  );

  return (
    <>
      <header className="bg-lime-600 text-white py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold text-center">Calories Tracker</h1>
          <button
            className="bg-gray-800 hover:bg-gray-900 p-2 font-bold uppercase 
          text-white cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canRestartApp}
            onClick={() =>
              dispatch({
                type: "RESTART_APP",
              })
            }
          >
            Reset App
          </button>
        </div>
      </header>

      <section className="bg-lime-500">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Form dispatch={dispatch} categories={categories} state={state} />
        </div>
      </section>

      <section className="bg-gray-800 py-10">
        <div className="max-w-4xl mx-auto">
          <CaloriesTracker activities={state.activities} />
        </div>
      </section>

      <section className="bg-gray-200 min-h-screen">
        <div className="px-4 py-6 mx-auto max-w-4xl">
          <ActivityList activities={state.activities} dispatch={dispatch} />
        </div>
      </section>
    </>
  );
}

export default App;
