// reducers/locationReducer.js
import { SET_LOCATION_ADDRESS, CLEAR_LOCATION_ADDRESS }  from "../../../constants/instructor/actionTypes";


const initialState = {
  address: null,
  state: "idle",
  error: null,
  success: null,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };
    case CLEAR_LOCATION_ADDRESS:
      return {
        ...state,
        address: null,
      };
    default:
      return state;
  }
};

export default locationReducer;
