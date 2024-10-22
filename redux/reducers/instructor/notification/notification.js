import { GET_SERVICE_NOTIFICATION} from "../../../constants/instructor/actionTypes";


const initialState = {
  notifications: [],
  unViewedNotification: 0,
  state: "idle",
  error: null,
  success: null,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SERVICE_NOTIFICATION:
      return {
        ...state,
        notifications: action.payload.notifications,
        unViewedNotification: action.payload.unViewedNotification,
      };

    default:
      return state;
  }
};

export default notificationReducer;
