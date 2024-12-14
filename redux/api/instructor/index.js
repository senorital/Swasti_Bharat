import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { ToastAndroid } from "react-native";

const api = axios.create({
  baseURL: "http://192.168.1.7:3307/",
  // baseURL:"https://swasti.onrender.com/api/",
  // baseURL:"https://stoic-thompson.97-74-83-236.plesk.page/api/",
  //  baseURL : "https://stoic-thompson.97-74-83-236.plesk.page/"
});
  
api.interceptors.request.use(
  async (req) => {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        // Handle offline scenario
        console.log("You are offline. Please check your internet connection.");
        return Promise.reject(new Error("No internet connection"));
      }
      const authToken = await AsyncStorage.getItem("authToken");

      if (authToken) {
        req.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error("Error retrieving authToken from AsyncStorage", error);
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      // Handle cases like network failure
      //  ToastAndroid.SHORT
      // console.error("Network error or server is not reachable");
    }
    return Promise.reject(error);
  }
);



//Authentication
export const register = (userInfo) =>
  api.post(`user/registerByNumber`, userInfo);
export const login = (userInfo) =>
  api.post(`user/loginByNumber`, userInfo);
export const  loginEmail = (userInfo) =>
  api.post(`user/loginByEmail`, userInfo);
export const registerEmail = (userInfo) =>
  api.post(`user/registerByEmail`, userInfo);
export const verfiyOtpByEmail = (otpInfo) =>
  api.post(`user/verifyEmailOTP`, otpInfo);
export const verifyOtp = (otpInfo) =>
  api.post(`user/verifyNumberOTP`, otpInfo);
export const getUserInstructor = (instructinfo) =>
  api.post(`user/instructor-user`, instructinfo);
export const getVersion = () =>
  api.get(`swasti/version`);
export const addUpdateVersion = (latestVersion) =>
  api.post(`swasti/version`, latestVersion);
//Instructuor APIS
export const getInstructor = () => api.get(`instructor/`);
export const getUser = () => api.get(`student/`);

export const updateInstructor = (formData) =>
  api.put(`instructor/update`, formData);
export const updateTutorTerm = (termInfo) =>
  api.put(`instructor/ht/homeTutorTerm`, termInfo);
export const updateTherapistTerm = (termInfo) =>
  api.put(`instructor/therapistTerm`, termInfo);

export const updateYogaStudioTerm = (termInfo) =>
  api.put(`instructor/yogaStudioTerm`, termInfo);


export const addProfilePic = (formData) =>
  api.post(`instructor/profilePic`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
// yoga studio form
// export const yogaStudio = (studio) =>
//   api.post(`instructor/createYogaStudioBusiness`, studio);
// export const getYogaStudio = () => api.get(`instructor/myYogaStudios`);
// export const updateYogaStudio = ({ id, ...studio }) =>
//   api.put(`instructor/updateYogaStudioBusiness/${id}`, studio);
// export const getYogaStudioById = (id) => api.get(`instructor/yogaStudios/${id}`);
// export const studioStepFirst = ({ businessId, ...studio }) =>
//   api.post(`instructor/createYogaStudioContact/${businessId}`, studio);
// export const updateStudioStepFirst = ({ id, ...studio }) =>
//   api.put(`instructor/updateYogaStudioContact/${id}`, studio);
// export const studioStepSecond = ({ businessId, ...studio }) =>
//   api.post(`instructor/createYogaStudioTiming/${businessId}`, studio);
// export const updateStudioStepSecond = ({ id, ...studio }) =>
//   api.put(`instructor/updateYogaStudioTime/${id}`, studio);
// export const studioStepThird = (formData, businessId) => {
//   return api.post(`instructor/createYogaStudioImage/${businessId}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

// export const deleteStudio = (id) =>
//   api.delete(`instructor/deleteYSBusiness/${id}`);
// export const deleteStudioImage = (id) =>
//   api.delete(`instructor/deleteYSImage/${id}`);
// export const deleteStudioContact = (id) =>
//   api.delete(`instructor/deleteYSContact/${id}`);
// export const deleteStudioTime = (id) =>
//   api.delete(`instructor/deleteYSTime/${id}`);

export const getCategory = () => api.get(`instructor/mas/coursecategories`);
export const getCourseDuration = () => api.get(`instructor/mas/courseDurations`);
export const getCourseType = () => api.get(`instructor/mas/courseTypes`);
export const getInstitute = (university_name) => api.get(`instructor/mas/institutes`, {
  params: { university_name }
});
export const getUniversity = () => api.get(`instructor/mas/university`);

export const getCourseDurationType = (type) =>
  api.get(`instructor/mas/courseDTByUniversity/${type}`);

export const addCourse = (formData) => {
  return api.post(`instructor/addCourse`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addQualification = (formData) => {
  return api.post(`instructor/qualification`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getQualification = (id) =>
  api.get(`instructor/qualification/${id}`);
export const updateQualification = (id, formData) => {

  return api.put(`instructor/qualification/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteQualification = (id) =>
  api.delete(`instructor/qualification/${id}`);

export const addExperience = (experienceInfo) =>
  api.post(`instructor/experience`, experienceInfo);
export const getExperience = (id) => api.get(`instructor/experience/${id}`);
export const updateExperience = ({ id, ...experience }) => {
  return api.put(`instructor/experience/${id}`, experience);
};

export const updateKYC = ({ id, ...formData }) => {
 
  return api.put(`instructor/KYC/${id}`, formData);
};

export const updateBankDetails = ({id, ...formData}) => {
  console.log('Request URL:', `instructor/bankDetails/${id}`); // Log the request URL
  return api.put(`instructor/bankDetails/${id}`, formData);
};

export const deleteExperience = (id) =>
  api.delete(`instructor/experience/${id}`);

// home tutor
export const addHomeTutor = (tutorInfo) =>
  api.post(`instructor/ht/createHomeTutor`, tutorInfo);

export const addTutorLocation = ({ id, ...location }) =>
  api.post(`instructor/ht/addHTutorSeviceArea/${id}`, location);
export const addTutorPrice = ({ id, ...price }) =>
  api.post(`instructor/ht/addHTutorPrice/${id}`, price);
export const getTutorQualification = (id) => api.get(`instructor/qualificationIn/${id}`);
export const getTutor = () => api.get(`instructor/ht/homeTutors`);
export const getTutorById = (id) => api.get(`instructor/ht/homeTutors/${id}`);
export const addTimeSlot = ({ id, ...slot }) => {

  
  return api.post(`instructor/ht/addHTutorTimeSlote/${id}`, slot);
};

export const addTutorPhoto = (formData,id) => {

  return api.post(`instructor/ht/addHTutorImage/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const updateHomeTutor = ({ id, ...tutorInfo }) => {

  return api.put(`instructor/ht/updateHomeTutor/${id}`, tutorInfo);
};

export const updateHTServiceArea = ({ id,...formData }) => {
  return api.put(`instructor/ht/updateHTServiceArea/${id}`,formData);
};



export const submitHomeTutor = (id) => {
  return api.put(`instructor/ht/submitHomeTutor/${id}`);
};

export const getServiceArea = (id) => {
  return api.get(`instructor/ht/hTServiceArea/${id}`);
};

export const getPrice = (id) => {
  return api.get(`instructor/ht/hTPrice/${id}`);
};

export const  getYogaForCategory = () => {
  return api.get(`instructor/mas/y-f-category/`);
};

export const publishHomeTutor = ({ id, ...publish }) => {
  return api.put(`instructor/ht/publishHomeTutor/${id}`, publish);
};


export const deleteHomeTutor = (id) =>
  api.delete(`instructor/ht/deleteHomeTutor/${id}`);
export const deleteTutorImage = (id) =>
  api.delete(`instructor/ht/deleteHTutorImage/${id}`);
export const deleteTutorLocation = (id) =>
  api.delete(`instructor/ht/deleteHTutorServiceArea/${id}`);

export const deleteTutorSlot = (id) =>
  api.delete(`instructor/ht/deleteHTutorTimeSlote/${id}`);

export const addTherapist = (therapistInfo) =>
  api.post(`instructor/createTherapy`, therapistInfo);
export const getTherapist = () => api.get(`instructor/therapies`);
export const getTherapistById = (id) => api.get(`instructor/therapies/${id}`);
export const addTherapistLocation = ({ id, ...location }) =>
  api.post(`instructor/addTherapySeviceArea/${id}`, location);

export const addTherapistSlot = ({ id, ...slot }) =>
  api.post(`instructor/addTherapyTimeSlote/${id}`, slot);
export const addTherapistPhoto = (formData, id) => {
  return api.post(`instructor/addTherapyImage/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addTherapy = ({ id, ...therapyInfo }) =>
  api.post(`instructor/addTherapyTypeOffered/${id}`, therapyInfo);

export const submitYogaStudio = (id) => {
  return api.put(`instructor/submitYogaStudio/${id}`);
};

export const submitYogaStudioContact = (id) => {
  return api.put(`instructor/submitYSContact/${id}`);
};

export const submitYogaStudioTime = (id) => {
  return api.put(`instructor/submitYSTime/${id}`);
};
export const submitYogaStudioImage = (id) => {
  return api.put(`instructor/submitYSImage/${id}`);
};

export const publishYogaStudio = ({ id, ...publish }) => {
  return api.put(`instructor/publishYogaStudio/${id}`, publish);
};


//notifcation
export const getServiceNotification = () =>
  api.get(`instructor/ht/userNotifications`);

export const viewServiceNotification = () =>
  api.put(`instructor/ht/viewServiceNotifications`);

//Get All Service Area 


//KYC
export const addKYC = (formData) =>
  api.post(`instructor/kyc`, formData);

export const getKYC = () =>
  api.get(`instructor/kyc`);


//Bank Verification
export const addBankDetails = (formData) =>
  api.post(`instructor/bankDetails`,formData);

export const getBankDetails = () =>
  api.get(`instructor/bankDetails`);


export const getchakras = () =>
  api.get(`instructor/chakras`);

export const getReferralData = () =>
  api.get(`instructor/referralDatas`);
