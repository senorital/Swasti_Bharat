import {
  GET_TUTOR,
  GET_TUTOR_BY_ID,
  GET_TUTOR_BY_ID_SUCCESS,
  GET_TUTOR_BY_ID_ERROR,
  GET_TUTOR_TIME_SLOT,
} from "../../actions/types";

const initialState = {
  homeTutor: [],
  location: [],
  qualification: [],
  slot: [],
  photo: [],
  state: "idle",
  error: null,
  success: null,
};

export const homeTutorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TUTOR:
      return {
        ...state,
        homeTutor: action.payload,
      };

    case GET_TUTOR_BY_ID:
      return {
        ...state,
        state: "loading", // Update state to loading
        error: null,
      };

    case GET_TUTOR_BY_ID_SUCCESS:
      return {
        ...state,
        homeTutor: action.payload,
        state: "success", // Update state to success
        error: null,
      };

    case GET_TUTOR_BY_ID_ERROR:
      return {
        ...state,
        error: action.error,
        state: "error", // Update state to error
      };

      case GET_TUTOR_TIME_SLOT:
        return {
          ...state,
          state: "loading", // Update state to loading
          error: null,
        };

    default:
      return state;
  }
};

export default homeTutorReducer;
