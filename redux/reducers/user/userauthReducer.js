// import { PROFILE_PIC } from "../../constants/instructor/actionTypes";
import { GET_YOGA_FOR_CATEGORY , GET_IMAGES, UPDATE_USER} from "../../constants/user/types";


const initialState = {
  yogaForCategory :[] , state: "idle",
  error: null,
  success: null,
  user: null,

};

const userauthReducer = (state = initialState, action) => {
  switch (action.type) {

  case GET_IMAGES:
  
  return {
          ...state,
          user: action.payload.user,
        };
  case GET_YOGA_FOR_CATEGORY:
   return {
            ...state,
            yogaForCategory: action.payload,
          };
  case UPDATE_USER:
    
              return {
                ...state,
                success: action.payload,
                error: null,
              };    

   
    
    default:
      return state;
  }
};

export default userauthReducer;
