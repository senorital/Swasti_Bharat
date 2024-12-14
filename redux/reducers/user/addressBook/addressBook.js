import {
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  GET_ADDRESS,
  DELETE_ADDRESS,
  GET_ADDRESS_BY_ID,
} from "../../../constants/user/types";

// Use this as your initial state
const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressReducer = (state = initialState, action) => {
  console.log("Current State: ", state);
  console.log("Dispatching Action: ", action);

  switch (action.type) {
    case GET_ADDRESS:
      console.log("Handling GET_ADDRESS action");
      return {
        ...state,
        addresses: Array.isArray(action.payload) 
          ? [...action.payload] // Assuming payload is a new array of addresses
          : state.addresses, // Fallback to current state if payload is invalid
      };

    case ADD_ADDRESS:
      console.log("Handling ADD_ADDRESS action");
      return {
        ...state,
        addresses: [...state.addresses, action.payload], // Add new address to the array
      };

    case UPDATE_ADDRESS:
      console.log("Handling UPDATE_ADDRESS action");
      return {
        ...state,
        addresses: state.addresses.map((address) =>
          address.id === action.payload.id ? action.payload : address
        ),
      };

    case DELETE_ADDRESS:
      console.log("Handling DELETE_ADDRESS action");
      return {
        ...state,
        addresses: state.addresses.filter(
          (address) => address.id !== action.payload
        ),
      };

    default:
      console.log("Unknown action type");
      return state; // Always return the current state if the action is unknown
  }
};

export default addressReducer;
