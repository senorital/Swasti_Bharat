import  * as api from "../../../api/user/index";
import {
  CREATE_ORDER,
    GET_TUTOR,
    GET_TUTOR_BY_ID,
    GET_TUTOR_TIME_SLOT,
    GET_USER
  } from "../../../constants/user/types";

  export const getUser = () => async(dispatch) =>{
    try {
    const {data} = await api.getUser();
    dispatch({type : GET_USER , payload : data});
    console("User Data :" + data)
    return data;
    }catch(error){
      console.log(error);
      throw error;
    }
    };
  
  export const getHomeTutor = () => async(dispatch) =>{
  try {
  const {data} = await api.getHomeTutor();
  dispatch({type : GET_TUTOR , payload : data});
  return data;
  }catch(error){
    console.log(error);
    throw error;
  }
  };

  export const getHomeTutorById = (homeTutorId) => async (dispatch) => {
    try {
      console.log("homeTutorId : " + homeTutorId);
      const { data } = await api.getHomeTutorById(homeTutorId);
      dispatch({ type: GET_TUTOR_BY_ID, payload: data });
      console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const getHomeTutorTimeslot = (homeTutorId,date) => async (dispatch) => {
    try {
      console.log("homeTutorId : " + homeTutorId);
      console.log("Date : " + date);

      const { data } = await api.getHomeTutorTimeslot(homeTutorId,date);
      dispatch({ type: GET_TUTOR_TIME_SLOT, payload: data });
      console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  export const createBookingOrder = (orderInfo) => async (dispatch) => {
    try {
   
      const { data } = await api.createBookingOrder(orderInfo);
      dispatch({ type: CREATE_ORDER , payload: data });
      console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };