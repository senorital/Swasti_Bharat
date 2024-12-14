import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.1.7:3307/",
  // baseURL: "http://192.168.1.38:5000/api/",
  // baseURL:"https://swasti.onrender.com/api/",
    // baseURL:"https://swasti.onrender.com/api/",
    // baseURL:"https://stoic-thompson.97-74-83-236.plesk.page/api/",
    // baseURL : "https://stoic-thompson.97-74-83-236.plesk.page/"

});

api.interceptors.request.use(
  async (req) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      console.log(authToken);
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


//HomeTutor
// export const getHomeTutor = (formData) =>
//   api.get(`student/ht/homeTutors`, 
//   });

export const getHomeTutor = (params) => {
  // Log the params object before converting it
  console.log('Params before query string:', params);

  // Convert object to query string
  const queryString = new URLSearchParams(params).toString();
  
  // Log the final query string
  console.log('Generated query string:', queryString);

  // Make the API call
  return api.get(`student/ht/homeTutors?${queryString}`);
};


  export const getMorningEveningTimeSlot = (params) => {
    const queryString = new URLSearchParams(params).toString(); // Convert object to query string
    return api.get(`student/ht/hTMorningEveningSlots?${queryString}`);
  };

export const getUser = () =>
  api.get(`student/`);
export const getBanners = () =>
  api.get(`student/adminBanners`);
export const getTherapists = () =>
  api.get(`student/thrapies`);
export const createBookingOrder = ({ userId, ...orderInfo }) => {
  // Log the order information to the console
  console.log('Creating booking order with the following details:', orderInfo);

  // Make the API request
  return api.post(`student/ht/createHTOrder?userId=${userId}`, orderInfo);
};

export const verifyHtPayment = (orderId) => {
  // Log the order information to the console
  console.log('Creating booking order with the following details:', orderId);

  // Make the API request
  return api.post(`student/pub/verifyHTPayment`,orderId);
};

//HomeTutor Info
// return api.get(`student/ht/homeTutors?${queryString}`);

export const getHomeTutorById = (params) => {
  const { homeTutorId, ...queryParams } = params; // Extract homeTutorId from params
  const queryString = new URLSearchParams(queryParams).toString(); // Convert remaining params to query string

  // Make API call using extracted homeTutorId and query string
  return api.get(`student/ht/homeTutors/${homeTutorId}?${queryString}`);
};

export const getYogaForCategory = () =>
  api.post(`student/pub/y-f-category`);
export const getHomeTutorTimeslot = (homeTutorId, date) => {
  return api.get(`student/ht/getTimeSlote/${homeTutorId}?date=${date}`);
};

//Update User Profile
export const updateUser = (formData) =>
  api.put(`student/profile`, formData);
export const useraddProfilePic = (formData) =>
  api.post(`student/profilePic`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteProfilePic = (id) =>
  api.delete(`student/profilePic/${id}`);
//Address Book
export const addAddress = (formData) =>
  api.post(`student/address`, formData);
export const getAddress = () =>
  api.get(`student/address`);
export const updateAddress = ({ id, ...formData }) => {
  return api.put(`student/address/${id}`, formData)};
export const deleteAddress = (id) =>
  api.delete(`student/address/${id}`);
export const getAddressbyId = (id) =>
  api.get(`student/address/${id}`);
export const getchakras = () =>
  api.get(`student/chakras`);

export const getReferralData = () =>
  api.get(`student/referralDatas`);



