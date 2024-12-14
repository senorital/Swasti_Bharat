import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../../../api/user/index";

import { ADD_ADDRESS, DELETE_ADDRESS, GET_ADDRESS, GET_ADDRESS_BY_ID, UPDATE_ADDRESS } from "../../../constants/user/types";


export const addAddress = (formData) => async (dispatch) => {
    try {
      const response = await api.addAddress(formData);
      dispatch({ type: ADD_ADDRESS, payload: response.data });  
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const updateAddress = (formData) => async (dispatch) => {
    try {
      const response = await api.updateAddress(formData);
      dispatch({ type: UPDATE_ADDRESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const getAddress = () => async (dispatch) => {
    try {
      const response = await api.getAddress();
      dispatch({ type: GET_ADDRESS, payload:response.data});
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  export const deleteAddress = (id) => async (dispatch) => {
    try {
      const response = await api.deleteAddress(id);
      console.log("Delete aDdress :" + response)
      dispatch({ type: DELETE_ADDRESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export const getAddressbyId = (id) => async (dispatch) => {
    try {
      const response = await api.getAddressbyId(id);
      console.log("getAddressbyId :" + response)
      dispatch({ type: GET_ADDRESS_BY_ID, payload: response.data });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
