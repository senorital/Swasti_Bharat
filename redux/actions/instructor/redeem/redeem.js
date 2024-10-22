import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../../../api/instructor/index";
import {
  GET_BANK_VERIFICATION,
  GET_CHAKRA,
  GET_REFERRAL_DATA,
  
} from "../../../constants/instructor/actionTypes";




export const getchakras = () => async (dispatch) => {
  try {
    const response = await api.getchakras();
    dispatch({ type: GET_CHAKRA, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getReferralData = () => async (dispatch) => {
  try {
    const response = await api.getReferralData();
    dispatch({ type: GET_REFERRAL_DATA, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};




