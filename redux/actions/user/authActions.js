import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../../api/user/index";
import {
  ADD_PROFILE_PIC,
  DELETE_PROFILE_PIC,
  GET_IMAGES,
  GET_YOGA_FOR_CATEGORY,
  UPDATE_USER,

} from "../../constants/user/types";




export const getBanners = () => async (dispatch) => {
  try {

    const { data } = await api.getBanners();
    // console.log(data);
    dispatch({ type: GET_IMAGES, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUser = (formData) => async (dispatch) => {
  try {
    const response = await api.updateUser(formData);
    dispatch({ type: UPDATE_USER, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const useraddProfilePic = (formData) => async (dispatch) => {
  try {
    const response = await api.useraddProfilePic(formData);
    // console.log("Response from API:", response); // Debug log for API response
    dispatch({ type: ADD_PROFILE_PIC, payload: response });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteProfilePic = (id) => async (dispatch) => {
  try {
    const response = await api.deleteProfilePic(id);
    dispatch({ type: DELETE_PROFILE_PIC, payload: id });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getYogaForCategory = () => async (dispatch) => {
  try {

    const { data } = await api.getYogaForCategory();
    console.log("in actions... " + data);
    dispatch({ type: GET_YOGA_FOR_CATEGORY, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

