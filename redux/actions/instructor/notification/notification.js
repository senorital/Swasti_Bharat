import * as api from "../../../api/instructor/index";
import {
GET_SERVICE_NOTIFICATION, 
VIEW_SERVICE_NOTIFICATION
} from "../../../constants/instructor/actionTypes";


export const getServiceNotification = () => async (dispatch) => {
  try {
    const { data } = await api.getServiceNotification();
    dispatch({ type: GET_SERVICE_NOTIFICATION,  payload: {
      notifications: data.data.notification,
      unViewedNotification: data.data.unViewedNotification,
    }, });
    // console.log(data)
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const viewServiceNotification = (experience) => async (dispatch) => {
  try {
    const response = await api.viewServiceNotification(experience);
    dispatch({ type: VIEW_SERVICE_NOTIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};




