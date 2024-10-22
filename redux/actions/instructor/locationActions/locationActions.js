import { SET_LOCATION_ADDRESS, CLEAR_LOCATION_ADDRESS} from '../../../constants/instructor/actionTypes';

export const setLocationAddress = (address) => async (dispatch) => {
    try {
      dispatch({ type: SET_LOCATION_ADDRESS, payload: address });
      return address;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  export const clearLocationAddress = () => async (dispatch) => {
    try {
      dispatch({ type: CLEAR_LOCATION_ADDRESS });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
