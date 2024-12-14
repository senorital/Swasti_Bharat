import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../../api/instructor/index";
import {
  REGISTER,
  LOGIN,
  VERIFY_OTP,
  GET_INSTRUCTOR,
  UPDATE_INSTRUCTOR,
  UPDATE_TUTOR_TERM,
  UPDATE_THERAPIST_TERM,
  UPDATE_YS_TERM,
  ADD_AADHAR_VERIFICATION,
  GET_AADHAR_VERIFICATION,
  ADD_BANK_VERIFICATION,
  GET_BANK_VERIFICATION,
  REGISTER_EMAIL,LOGIN_EMAIL,
  VERIFY_OTP_EMAIL,
  PROFILE_PIC,
  GET_USER_INSTRUCTOR,
  GET_VERSION,
  ADD_UPDATE_VERSION,
  UPDATE_AADHAR_VERIFICATION,
  UPDATE_BANK_VERIFICATION
} from "../../constants/instructor/actionTypes";
import { GET_USER } from "../../constants/user/types";

export const register = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.register(userInfo);
    dispatch({ type: REGISTER, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.login(userInfo);
    dispatch({ type: LOGIN, payload: data });
    console.log("data")
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginEmail = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.loginEmail(userInfo);
    dispatch({ type: LOGIN_EMAIL, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerEmail = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.registerEmail(userInfo);
    dispatch({ type: REGISTER_EMAIL, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOtp = (otpInfo) => async (dispatch) => {
  try {
    const { data } = await api.verifyOtp(otpInfo);
    dispatch({ type: VERIFY_OTP, payload: data });
    console.log("authToken", data.authToken);
    await AsyncStorage.setItem("authToken", data.authToken);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const getUserInstructor = (instructinfo) => async (dispatch) => {
  try {
    
    const { data } = await api.getUserInstructor(instructinfo);
    dispatch({ type: GET_USER_INSTRUCTOR, payload: data });
    console.log("INSTRUCER USER DATA " + data)
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addUpdateVersion = (latestVersion) => async (dispatch) => {
  try {
    
    const { data } = await api.addUpdateVersion(latestVersion);
    dispatch({ type: ADD_UPDATE_VERSION, payload: data });
    console.log("ADD UPDATE VERSION" + data)
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getVersion = () => async (dispatch) => {
  try {
    const { data } = await api.getVersion();
    console.log("data :" + data)
    dispatch({ type: GET_VERSION, payload: data });
   
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// export const verfiyOtpByEmail = (otpInfo) => async (dispatch) => {
//   try {
//     const { data } = await api.verfiyOtpByEmail(otpInfo);

//     // Assume the API response contains a flag or some logic to determine the role
//     const role = data.isInstructor; // This should be some logic or a flag from the response
//     // const role = isUser ? 'user' : 'instructor'; // Set role based on the flag

//     // Dispatch the Redux action with both the data and role
//     dispatch({
//       type: VERIFY_OTP_EMAIL,
//       payload: {
//         ...data,    // Include all other data from the response
//         role,       // Add the role as either 'user' or 'instructor'
//       },
//     });

//     // Log the auth token and user data for debugging
//     console.log("authToken:", data.authToken);
//     console.log("User Data:", data);

//     // Save the auth token and user role in AsyncStorage for future use
//     await AsyncStorage.setItem("authToken", data.authToken);
//     await AsyncStorage.setItem("userRole", role);  // Store the role in AsyncStorage

//     return data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export const verfiyOtpByEmail = (otpInfo) => async (dispatch) => {
  try {
    // API call to verify OTP by email
    const { data } = await api.verfiyOtpByEmail(otpInfo);

    console.log("authToken", data.authToken);
    await AsyncStorage.setItem("authToken", data.authToken);
    return data;
  } catch (error) {
    console.log("Error in OTP verification:", error);
    throw error;
  }
};



export const getInstructor = () => async (dispatch) => {
  try {
    const { data } = await api.getInstructor();
    console.log("data :" + data.data)
    dispatch({ type: GET_INSTRUCTOR, payload: data });
   
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUser = () => async(dispatch) =>{
  try {
  const {data} = await api.getUser();
  dispatch({type : GET_USER , payload : data});
  console.log("User Data :" + data)
  return data;
  }catch(error){
    console.log(error);
    throw error;
  }
  };

export const addProfilePic = (formData) => async (dispatch) => {
  try {
    const response  = await api.addProfilePic(formData);
    // console.log("data :" + response)
    dispatch({ type: PROFILE_PIC, payload: response });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// export const getInstructor = () => async (dispatch) => {
//   try {
//     const { data } = await api.getInstructor();
//     console.log('data :' + data );

//     // const userRole = await AsyncStorage.getItem("role"); 

//     // console.log('roleactions :' + userRole );

//     // Set the payload based on the role
//     // const payload = userRole ? data.data : data;
//     // console('Payload :' + payload)
//     dispatch({ type: GET_INSTRUCTOR, payload : data });
//     return data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export const updateInstructor = (formData) => async (dispatch) => {
  try {
    const response = await api.updateInstructor(formData);
    dispatch({ type: UPDATE_INSTRUCTOR, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTutorTerm = (termInfo) => async (dispatch) => {
  try {
    const response = await api.updateTutorTerm(termInfo);
    dispatch({ type: UPDATE_TUTOR_TERM, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTherapistTerm = (termInfo) => async (dispatch) => {
  try {
    const response = await api.updateTherapistTerm(termInfo);
    dispatch({ type: UPDATE_THERAPIST_TERM, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const updateYogaStudioTerm = (termInfo) => async (dispatch) => {
  try {
    const response = await api.updateYogaStudioTerm(termInfo);
    dispatch({ type: UPDATE_YS_TERM, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addKYC = (formData) => async (dispatch) => {
  try {
    const response = await api.addKYC(formData);
    console.log(response);
    dispatch({ type: ADD_AADHAR_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getKYC = () => async (dispatch) => {
  try {
    const response = await api.getKYC();
    dispatch({ type: GET_AADHAR_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const updateKYC = (id,formData) => async (dispatch) => {
  try {
    console.log("FormData : " + formData)
    console.log("Id : " + id)

  const response = await api.updateKYC(formData);
  console.log("resposne :" + response)
    dispatch({ type: UPDATE_AADHAR_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const updateBankDetails = (id,formData) => async (dispatch) => {
  try {
    console.log("FormData : " + formData)
    console.log("Id : " + id)

  const response = await api.updateBankDetails(formData);
  console.log("resposne :" + response)
    dispatch({ type: UPDATE_BANK_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



export const addBankDetails = (formData) => async (dispatch) => {
  try {
    const response = await api.addBankDetails(formData);
    dispatch({ type: ADD_BANK_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBankDetails = () => async (dispatch) => {
  try {
    const response = await api.getBankDetails();
    dispatch({ type: GET_BANK_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};




