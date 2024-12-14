import  * as api from "../../../api/user/index";
import {
  CREATE_ORDER,
    GET_TUTOR,
    GET_TUTOR_BY_ID,
    GET_TUTOR_TIME_SLOT,
    GET_USER,
    VERIFY_PAYMENT
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
  
    export const getHomeTutor = (filters = {}) => async (dispatch) => {
      try {
      
    
        // Make the API call
        const { data } = await api.getHomeTutor(filters);
    
        // Dispatch the fetched data
        dispatch({ type: GET_TUTOR, payload: data });
    
        console.log('Tutor data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
      }
    };
    
    export const getHometutors = () => async(dispatch) =>{
      try {
      const {data} = await api.getHomeTutors();
      dispatch({type : GET_TUTOR , payload : data});
      console("User Data :" + data)
      return data;
      }catch(error){
        console.log(error);
        throw error;
      }
      };

  export const getHomeTutorById = (params) => async (dispatch) => {
    try {
      // console.log("homeTutorId : " + homeTutorId);
      const { data } = await api.getHomeTutorById(params);
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

  export const verifyHtPayment = (orderId) => async (dispatch) => {
    try {
   
      const { data } = await api.verifyHtPayment(orderId);
      console.log("VERIFY_PAYMENT :" + data)

      dispatch({ type: VERIFY_PAYMENT , payload: data });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };