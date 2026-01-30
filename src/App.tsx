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
    [state.activities],
  );

  return (
    <>
      <header className="bg-slate-900 text-white py-5 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Calories Tracker
          </h1>

          <button
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm font-semibold uppercase 
      rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!canRestartApp}
            onClick={() => dispatch({ type: "RESTART_APP" })}
          >
            Reset
          </button>
        </div>
      </header>

      <section className="bg-slate-100 border-b">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Form dispatch={dispatch} categories={categories} state={state} />
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <CaloriesTracker activities={state.activities} />
        </div>
      </section>

      <section className="bg-slate-50 min-h-screen">
        <div className="px-6 py-12 mx-auto max-w-5xl">
          <ActivityList activities={state.activities} dispatch={dispatch} />
        </div>
      </section>
    </>
  );
}

export default App;
