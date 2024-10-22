import  * as api from "../../api";
import {
    GET_THERAPIST,
  } from "../types";

  export const getTherapists = () => async(dispatch) =>{
  try {
  const {data} = await api.getTherapist();
  dispatch({type : GET_THERAPIST , payload : data});
  return data;
  }catch(error){
    console.log(error);
    throw error;
  }
  }