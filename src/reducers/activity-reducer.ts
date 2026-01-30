import type { Activity } from "../types";

export type ActivityActions =
  | { type: "ADD_ACTIVITY"; payload: { newActivity: Activity } }
  | { type: "REMOVE_ACTIVITY"; payload: { id: Activity["id"] } }
  | { type: "SET_ACTIVE_ACTIVITY"; payload: { id: Activity["id"] } }
  | { type: "UPDATE_ACTIVITY"; payload: { updatedActivity: Activity } }
  | { type: "RESTART_APP" };  

export type ActivityState = {
  activities: Activity[],
  activeID: Activity['id']
};

const localStorageActivities = () => {
  const activities = localStorage.getItem("activities");
  return activities ? JSON.parse(activities) : [];
}

export const initialState: ActivityState = {
  activities: localStorageActivities(),
  activeID: '',
};

export const activityReducer = (
  state: ActivityState = initialState,
  action: ActivityActions
): ActivityState => {
  switch (action.type) {
    case "ADD_ACTIVITY": {
      const activityWithId = {
        ...action.payload.newActivity,
        id: crypto.randomUUID(),
      };
      return {
        ...state,
        activities: [...state.activities, activityWithId],
      };
    }

    case "REMOVE_ACTIVITY": {
      const newActivities = state.activities.filter(
        (activity) => activity.id !== action.payload.id
      );
      return {
        ...state,
        activities: newActivities,
      };
    }

    case "SET_ACTIVE_ACTIVITY": {
      return {
        ...state,
        activeID: action.payload.id,
      };
    }

    case "UPDATE_ACTIVITY": {
      const updatedActivities = state.activities.map((activity) =>
        activity.id === action.payload.updatedActivity.id
          ? action.payload.updatedActivity
          : activity
      );
      return {
        ...state,
        activities: updatedActivities,
        activeID: '',
      };
    }

    case "RESTART_APP": {
      return {
        activities: [],
        activeID: '',
      }
    }

    default:
      return state;
  }
};
