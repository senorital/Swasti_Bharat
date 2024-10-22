import {
    ADD_ADDRESS,
    UPDATE_ADDRESS,
    GET_ADDRESS,
    DELETE_ADDRESS,
    GET_ADDRESS_BY_ID,
  } from "../../../constants/user/types";
  
  const initialState = {
    addresses: [],
    loading: false,
    error: null,
  };
  
  const addressReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ADDRESS:
        return {
          ...state,
          addresses: action.payload, // Assuming the response is an array of addresses
          loading: false,
          error: null,
        };
  
      case ADD_ADDRESS:
        return {
          ...state,
          addresses: action.payload, // Assuming the response is an array of addresses
          loading: false,
          error: null,
        };
  
      case UPDATE_ADDRESS:
        return {
          ...state,
          addresses: action.payload, // Assuming the response is an array of addresses
          loading: false,
          error: null,
        };
  
      case DELETE_ADDRESS:
        return {
          ...state,
          addresses: state.addresses.filter(
            (address) => address.id !== action.payload
          ), // Remove the deleted address
          loading: false,
          error: null,
        };

        case GET_ADDRESS_BY_ID:
          return {
            ...state,
            state: "loading", // Update state to loading
            error: null,
          };
    
  
      default:
        return state;
    }
  };
  
  export default addressReducer;
  