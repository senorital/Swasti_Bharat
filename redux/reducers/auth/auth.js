import {
  REGISTER,
  LOGIN,
  VERIFY_OTP,
  GET_INSTRUCTOR,
  GET_USER,
  UPDATE_INSTRUCTOR,
  UPDATE_TUTOR_TERM,
  UPDATE_THERAPIST_TERM,
  UPDATE_YS_TERM,
  REGISTER_EMAIL,
  LOGIN_EMAIL,
  VERIFY_OTP_EMAIL,
  ADD_AADHAR_VERIFICATION,
  GET_AADHAR_VERIFICATION,
  ADD_BANK_VERIFICATION,
  GET_BANK_VERIFICATION,
  GET_USER_INSTRUCTOR,
} from "../../constants/instructor/actionTypes";
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { GET_MORNING_EVENING_TIMESLOT, GET_YOGA_FOR_CATEGORY } from "../../constants/user/types";

const initialState = {
  user: null,
  aadharVerification: null,
  bankVerification: null,
  success: null,
  error: null,
  yogaForCategory :[] ,
  morningEveningSlot : []
};

const authReducer = (state = initialState, action) => {
  // console.log("Action type" + action.type)
  switch (action.type) {
    case REGISTER:
    case LOGIN:
    case VERIFY_OTP:
    case REGISTER_EMAIL:
    case LOGIN_EMAIL:
    case VERIFY_OTP_EMAIL:
      case GET_USER_INSTRUCTOR :  
   
      return {
        ...state,
        user: action.payload.data,
      };

      // case GET_USER_INSTRUCTOR :  

      case GET_YOGA_FOR_CATEGORY:
        return {
          ...state,
          yogaForCategory: action.payload.data,
        };
   
      case GET_MORNING_EVENING_TIMESLOT:
        return {
        ...state,
        morningEveningSlot: action.payload.data,
        };


      case GET_INSTRUCTOR:
        return {
          ...state,
          user: action.payload.data,
        };
    case GET_USER:
      return {
        ...state,
        user: action.payload.data,
      };

    case UPDATE_INSTRUCTOR:
    case UPDATE_TUTOR_TERM:
    case UPDATE_THERAPIST_TERM:
    case UPDATE_YS_TERM:
      return {
        ...state,
        success: action.payload,
        error: null,
      };

    case GET_AADHAR_VERIFICATION:
      return {
        ...state,
        aadharVerification: action.payload,
      };

    case GET_BANK_VERIFICATION:
      return {
        ...state,
        bankVerification: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;


