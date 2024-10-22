import * as api from "../../../api/instructor/index";
import { GET_COURSE_TYPE,GET_COURSE_DURATION,GET_INSTITUTE,GET_COURSE_DURATION_TYPE, GET_UNIVERSITY } 
 from "../../../constants/instructor/actionTypes";



export const getCourseType = () => async (dispatch) => {  
    try {
      const { data } = await api.getCourseType();
      dispatch({ type: GET_COURSE_TYPE, payload: data });
      // console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const getCourseDuration = () => async (dispatch) => {  
    try {
      const { data } = await api.getCourseDuration();
      dispatch({ type: GET_COURSE_DURATION, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const getInstitute = (university_name) => async (dispatch) => {  
    try {
      const { data } = await api.getInstitute(university_name);
      dispatch({ type: GET_INSTITUTE, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const getUniversity = () => async (dispatch) => {  
    try {
      const { data } = await api.getUniversity();
      dispatch({ type: GET_UNIVERSITY, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const getCourseDurationType = (type) => async (dispatch) => {  
    try {
      const { data } = await api.getCourseDurationType(type);
      dispatch({ type: GET_COURSE_DURATION_TYPE, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

