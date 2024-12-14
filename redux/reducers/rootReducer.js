import { combineReducers } from "redux";
import authReducer from "../reducers/auth/auth";
// import yogaStudio from "./yogaStudio/yogaStudio";
import category from "../reducers/instructor/category/category";
import institute from "../reducers/instructor/institute/institute";
import course from "../reducers/instructor/course/course";
import qualification from "../reducers/instructor/qualification/qualification";
import experience from "../reducers/instructor/experience/experience";
import homeTutor from "../reducers/instructor/homeTutor/homeTutor";
import locationReducer from "../reducers/instructor/locationReducer/locationReducer";
import notificationReducer from "../reducers/instructor/notification/notification";
import redeemReducer from "../reducers/instructor/redeem/referralData";
import userauthReducer from "./user/userauthReducer";
import addressReducer from "./user/addressBook/addressBook";

export const rootReducer = combineReducers({
  notification: notificationReducer,
  location : locationReducer,
  auth: authReducer,
  // studio:yogaStudio,
  // auth :userauthReducer,
  userauth : userauthReducer,
  category,
  institute,
  course,
  qualification,
  experience,
  homeTutor,
  referralData : redeemReducer,
  addresses : addressReducer
});
