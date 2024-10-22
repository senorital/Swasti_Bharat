import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../splash/Splash";
import Login from "../auth/login/Login";
import OnBoardingScreen from "../auth/onboarding/OnBoardingScreen";
import Otp from "../auth/otp/Otp";
import Register from "../auth/register/Register";
import DenyLocation from "../auth/login/DenyLocation";
import UserTabNavigator from "../roles/user/components/navigation/TabNavigator";
import TabNavigator from "../roles/instructor/components/navigation/TabNavigator";
import FirstHTutorScreen from "../roles/instructor/components/homeTutor/FirstHTutorScreen";
import TermConditions from "../roles/instructor/components/term&conditions/TermConditions";
import PrivacyPolicy from "../roles/instructor/components/privacy&policy/PrivacyPolicy";
// import Terms from "../terms/Terms";
import Help from "../roles/instructor/components/help/Help";
import MainProfile from "../profile/myprofile/MainProfile";
import ProfileOverview from "../profile/myprofile/ProfileOverview";
import Experience from "../roles/instructor/components/experience/Experience";
import AddExperience from "../roles/instructor/components/experience/AddExperience";
import ExperienceDetails from "../roles/instructor/components/experience/ExperienceDetails";
import EditExperience from "../roles/instructor/components/experience/EditExperience";
import EditQualification from "../roles/instructor/components/qualification/EditQualification";
import steps  from "../profile/shareAndEarn/steps";
import Share from "../profile/shareAndEarn/share";
import ShowInstructorForUser from "../roles/user/components/HomeTutor/ShowHomeTutor";
// import GeneralQuiz from "../generalQuiz/GeneralQuiz";
// import Language from "../language/Language";
// import Wallet from "../wallet/Wallet";
// import WalletScreen1 from "../wallet/WalletScreen1";
// import WalletScreen2 from "../wallet/WalletScreen2";
// import WalletScreen3 from "../wallet/WalletScreen3";
// import WalletScreen4 from "../wallet/WalletScreen4";
// import TabNavigator from "../navigation/TabNavigator";
// import Notification from "../notification/Notification";
// import CreateCourse from "../createCourse/CreateCourse";
// import LiveClasses from "../liveClasses/LiveClasses";

// import EditProfile from "../profile/EditProfile";
// import Qualification from "../qualification/Qualification";
// import AddQualification from "../qualification/AddQuaification";

// import QualificationDetails from "../qualification/QualificationDetails";
// import EditQualification from "../qualification/EditQualification";

// import CourseDetails from "../courseDetails/CourseDetails";
// import YStudioForm from "../yogaStudio/YStudioForm";
// import YogaStudio from "../yogaStudio/YogaStudio";
// import Studio from "../studio/Studio";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import EditProfile from "../profile/myprofile/EditProfile";
import AddQualification from "../roles/instructor/components/qualification/AddQuaification";
import Qualification from "../roles/instructor/components/qualification/Qualification";
import Notification from "../roles/instructor/components/notification/Notification";
import Referral from "../profile/shareAndEarn/referral";

// import YogaStudioScreen from "../yogaStudio/YogaStudioScreen";
// import EditBusinessProfile from "../businessProfile/EditBusinessProfile";
// import EditYStudioForm from "../businessProfile/EditYStudioForm";
// import EditContactDetails from "../businessProfile/EditContactDetails";
// import EditTiming from "../businessProfile/EditTiming";
// import BusinessTimings from "../businessTimings/BusinessTimings";
// import AddBusinessPhoto from "../addBusinessPhoto/AddBusinessPhoto";
// import AddBusinessContact from "../addBusinessContact/AddBusinessContact";
// import ParticularStudio from "../particularStudio/ParticularStudio";
// import AllBusinessStudio from "../allBusinessStudio/AllBusinessStudio";
import HomeTutor from "../roles/instructor/components/homeTutor/HomeTutor";
import AddTimeSlot from "../roles/instructor/components/homeTutor/AddTimeSlot";
import ShowHomeTutor from "../roles/instructor/components/homeTutor/ShowHomeTutor";
import AllHomeTutor from "../roles/instructor/components/homeTutor/AllHomeTutor";
// import FirstTherapistScreen from "../therapist/FirstTherapistScreen";
import AddTLocation from "../roles/instructor/components/tutorLocation/AddTLocation";
import AddTutorPhoto from "../roles/instructor/components/homeTutor/AddTutorPhoto";
  import UpdateHomeTutor from "../roles/instructor/components/homeTutor/UpdateHomeTutor";
  // import Therapist from "../therapist/Therapist";
  // import AllTherapist from "../therapist/AllTherapist";
  // import ShowTherapist from "../therapist/ShowTherapist";
  // import TherapistLocation from "../therapist/TherapistLocation";
  // import TherapistTimeSlot from "../therapist/TherapistTimeSlot";
  // import TherapistPhoto from "../therapist/TherapistPhoto";
  // import AddTherapy from "../therapist/AddTherapy";
  // import FirstYogaStudioScreen from "../yogaStudio/FirstYogaStudioScreen";
  // import ComingSoonStudio from "../yogaStudio/ComingSoonStudio";
  // import ComingSoonTherapist from "../therapist/ComingSoonTherapist";
  // import ComingSoonInfluencer from "../influencer/ComingSoonInfluencer";

 import ConfirmOrder from '../roles/user/components/HomeTutor/confirmOrder';
  import AadharVerification from "../roles/instructor/components/AadharVerification/AadharVerification";
  import BankVerification from "../roles/instructor/components/BankVerification/BankVerification";
  import UpdateBankVerification from "../roles/instructor/components/BankVerification/UpdateBankVerification";
  import UpdateAadharVerification from "../roles/instructor/components/AadharVerification/UpdateAadharVerification";
  import Category from "../roles/user/components/category/category";
  import UpdateTLocation from "../roles/instructor/components/tutorLocation/UpdateTLocation";
  // import TestStepSecond from "../yogaStudio/TestStepSecond";
  import Index from '../roles/user/components/HomeTutor/Index';
  import BookAppointment from '../roles/user/components/HomeTutor/BookAppointment';
  import Payment from '../roles/user/components/HomeTutor/Payment'
import Steps from "../profile/shareAndEarn/steps";
import EditUserProfile from "../roles/user/components/Profile/EditUserProfile";
import AddressBook from "../roles/user/components/addressBook/AddressBook";
import AddNewAddress from "../roles/user/components/addressBook/AddNewAddress";
import ReviewsPage from "../roles/user/components/Reviews";
import EditAddress from "../roles/user/components/addressBook/EditAddress";
import CategoryDetail from "../roles/user/components/category/categoryDetail";
import Class from "../roles/user/components/classes/myClasses";

  const Stack = createNativeStackNavigator();

  export default function Main() {
    const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null); // Added role state

    useEffect(() => {
      AsyncStorage.getItem("alreadyLaunched").then((value) => {
        if (value === null) {
          AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstTimeLoad(true);
        } else {
          setIsFirstTimeLoad(false);
        }
      });
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        const loggedInData = await AsyncStorage.getItem("isLoggedIn");
        const userRoleData = await AsyncStorage.getItem("userRole");
  
        setIsLoggedIn(loggedInData === "true");
      setRole(userRoleData === "true" ? "Instructor" : "User"); // Ensure correct role assignment
    console("userRoleData : "+userRoleData)
        setLoading(false);
      };
      fetchData();
    }, []);


    // async function getData() {
    //   // await AsyncStorage.removeItem("isLoggedIn");
    //   // await AsyncStorage.removeItem("role");
    //   const data = await AsyncStorage.getItem("isLoggedIn");
    //   const userRole = await AsyncStorage.getItem("userRole"); // Get the user role

    //   setIsLoggedIn(data === "true");
    //   setRole(userRole === "true" ? "Instructor" : "User"); // Ensure correct role assignment
    //   console.log("uroleserRole" + userRole)
    // }
    // async function getData() {
    //   const data = await AsyncStorage.getItem("isLoggedIn");
    //   const userRole = await AsyncStorage.getItem("role");

    //   setIsLoggedIn(data === "true");
    //   setRole(userRole || "User"); // Set role with default to 'User' if role is not found
    // } 


    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <Stack.Navigator>
              <Stack.Screen
                name="Splash"
                component={Splash}
                options={{ headerShown: false }}
              />
            <Stack.Screen
              name="MainStack"
              component={MainStack}
              options={{ headerShown: false }}
              initialParams={{ isLoggedIn, isFirstTimeLoad,role }} // Pass role
            />
            </Stack.Navigator>
            <Toast />
          </BottomSheetModalProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }

  const MainStack = ({ navigation, route }) => {
    const { isLoggedIn, isFirstTimeLoad,role } = route.params;
      const [loading, setLoading] = useState(true); // Add loading state
    
    useEffect(() => {
      if (isFirstTimeLoad === null || isLoggedIn === null) {
        return;
      }
     console.log("isLoggedIn" + isLoggedIn)
     console.log("role" + role)

      if (!isLoggedIn && role === null) {
        navigation.navigate("authStack");
      }

      setLoading(false); 
    }, [isLoggedIn, isFirstTimeLoad]);

    if (loading) {
      return null;
    }



    return (
      <Stack.Navigator>
    
        {isLoggedIn && role ? (
          console.log('isLoggedIn' + isLoggedIn),
          console.log("role 12334" + role) ,
          <>
            <Stack.Screen
              name="appStack"
              component={AppStack}
              options={{ headerShown: false }}
              initialParams={{role  : role}} // Pass role to AppStack

            />
        
          </>
        ) : (
          <>
            {isFirstTimeLoad && (
              <Stack.Screen
                name="OnBoardingScreen"
                component={OnBoardingScreen}
                options={{ headerShown: false }}
              />
            )}
            <Stack.Screen
              name="authStack"
              component={AuthStack}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="appStack"
              component={AppStack}
              options={{ headerShown: false }}
              initialParams={{ role : role }} // Pass role to AppStack

            />      

          </>
        )}
      </Stack.Navigator>
    );
  };

  const AuthStack = () => {
    return (
      <Stack.Navigator>
    <>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DenyLocation"
          component={DenyLocation}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="Otp"
          component={Otp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="TermConditions"
          component={TermConditions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        /> 
      
      </>
      
      </Stack.Navigator>
    );
  };


  const CommonStack = () => {
    return (
      <Stack.Navigator>
    <>
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermConditions"
          component={TermConditions}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="Share"
          component={Share}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Referral"
          component={Referral}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Steps"
          component={Steps}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{ headerShown: false }}
        /> 
      
      </>
      
      </Stack.Navigator>
    );
  };


  const AppStack = ({ route }) => {
    const role = route?.params?.role;
  console.log('role123' + role)
    return (
      <Stack.Navigator>
        {role === "Instructor" && (
          <>
            <Stack.Screen
              name="TabNavigator"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FirstHTutorScreen"
              component={FirstHTutorScreen}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainProfile"
              component={MainProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileOverview"
              component={ProfileOverview}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="AddQualification"
              component={AddQualification}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="TermConditions"
              component={TermConditions}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="Qualification"
              component={Qualification}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="Experience"
              component={Experience}
              options={{ headerShown: false }}
            />
              <Stack.Screen
          name="AddExperience"
          component={AddExperience}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExperienceDetails"
          component={ExperienceDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditExperience"
          component={EditExperience}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="EditQualification"
          component={EditQualification}
          options={{ headerShown: false }}
        />
            <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
       

      <Stack.Screen
          name="AadharVerification"
          component={AadharVerification}
          options={{ headerShown: false }}
        />
    
      <Stack.Screen
          name="BankVerification"
          component={BankVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateBankVerification"
          component={UpdateBankVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateAadharVerification"
          component={UpdateAadharVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTutor"
          component={HomeTutor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllHomeTutor"
          component={AllHomeTutor}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="AddTLocation"
          component={AddTLocation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTutorPhoto"
          component={AddTutorPhoto}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateHomeTutor"
          component={UpdateHomeTutor}
          options={{ headerShown: false }}
        />
            <Stack.Screen
          name="ShowHomeTutor"
          component={ShowHomeTutor}
          options={{ headerShown: false }}
        />
              <Stack.Screen
          name="UpdateTLocation"
          component={UpdateTLocation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTimeSlot"
          component={AddTimeSlot}
          options={{ headerShown: false }}
        />
      
          

<Stack.Screen
          name="Share"
          component={Share}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Referral"
          component={Referral}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Steps"
          component={Steps}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{ headerShown: false }}
        /> 
          </>
        )}
        {role === "User" && (
          <>
            <Stack.Screen
              name="UserTabNavigator"
              component={UserTabNavigator}
              options={{ headerShown: false }}
            />
              <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
              name="TermConditions"
              component={TermConditions}
              options={{ headerShown: false }}
            />
           <Stack.Screen
            name="Category"
            component={Category}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Index"
            component={Index}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="ShowInstructorForUser"
            component={ShowInstructorForUser}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="BookAppointment"
            component={BookAppointment}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="Payment"
            component={Payment}
            options={{ headerShown: false }}
          />

         <Stack.Screen
            name="ConfirmOrder"
            component={ConfirmOrder}
            options={{ headerShown: false }}
          />
          
          <Stack.Screen
            name="EditUserProfile"
            component={EditUserProfile}
            options={{ headerShown: false }}
          />
          
          <Stack.Screen
            name="AddressBook"
            component={AddressBook}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddNewAddress"
            component={AddNewAddress}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="EditAddress"
            component={EditAddress}
            options={{ headerShown: false }}
          />
             <Stack.Screen
            name="ReviewsPage"
            component={ReviewsPage}
            options={{ headerShown: false }}
          />
                <Stack.Screen
            name="CategoryDetail"
            component={CategoryDetail}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="Class"
            component={Class}
            options={{ headerShown: false }}
          />
          
           <Stack.Screen
            name="CommonStack"
            component={CommonStack}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// const AppStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="TabNavigator"
//         component={TabNavigator}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Terms"
//         component={Terms}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Help"
//         component={Help}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TermConditions"
//         component={TermConditions}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="PrivacyPolicy"
//         component={PrivacyPolicy}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="GeneralQuiz"
//         component={GeneralQuiz}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Language"
//         component={Language}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Wallet"
//         component={Wallet}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="WalletScreen1"
//         component={WalletScreen1}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="WalletScreen2"
//         component={WalletScreen2}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="WalletScreen3"
//         component={WalletScreen3}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="WalletScreen4"
//         component={WalletScreen4}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="Notification"
//         component={Notification}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="CreateCourse"
//         component={CreateCourse}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="LiveClasses"
//         component={LiveClasses}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="MainProfile"
//         component={MainProfile}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ProfileOverview"
//         component={ProfileOverview}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditProfile"
//         component={EditProfile}
//         options={{ headerShown: false }}
//       />
//           <Stack.Screen
//         name="Steps"
//         component={steps}
//         options={{ headerShown: false }}
//       />
//          <Stack.Screen
//         name="Share"
//         component={Share}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Qualification"
//         component={Qualification}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddQualification"
//         component={AddQualification}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="QualificationDetails"
//         component={QualificationDetails}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditQualification"
//         component={EditQualification}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Experience"
//         component={Experience}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddExperience"
//         component={AddExperience}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ExperienceDetails"
//         component={ExperienceDetails}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditExperience"
//         component={EditExperience}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="CourseDetails"
//         component={CourseDetails}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="YStudioForm"
//         component={YStudioForm}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditYStudioForm"
//         component={EditYStudioForm}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditContactDetails"
//         component={EditContactDetails}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditTiming"
//         component={EditTiming}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="YogaStudio"
//         component={YogaStudio}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Studio"
//         component={Studio}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="YogaStudioScreen"
//         component={YogaStudioScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditBusinessProfile"
//         component={EditBusinessProfile}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="BusinessTiming"
//         component={BusinessTimings}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddBusinessPhoto"
//         component={AddBusinessPhoto}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddBusinessContact"
//         component={AddBusinessContact}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ParticularStudio"
//         component={ParticularStudio}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AllBusinessStudio"
//         component={AllBusinessStudio}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="HomeTutor"
//         component={HomeTutor}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddTimeSlot"
//         component={AddTimeSlot}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ShowHomeTutor"
//         component={ShowHomeTutor}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AllHomeTutor"
//         component={AllHomeTutor}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Therapist"
//         component={Therapist}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="FirstHTutorScreen"
//         component={FirstHTutorScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddTLocation"
//         component={AddTLocation}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddTutorPhoto"
//         component={AddTutorPhoto}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="UpdateHomeTutor"
//         component={UpdateHomeTutor}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="FirstTherapistScreen"
//         component={FirstTherapistScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AllTherapist"
//         component={AllTherapist}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ShowTherapist"
//         component={ShowTherapist}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TherapistLocation"
//         component={TherapistLocation}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="TherapistTimeSlot"
//         component={TherapistTimeSlot}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="TherapistPhoto"
//         component={TherapistPhoto}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddTherapy"
//         component={AddTherapy}
//         options={{ headerShown: false }}
//       />
//         <Stack.Screen
//         name="FirstYogaStudioScreen"
//         component={FirstYogaStudioScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ComingSoonStudio"
//         component={ComingSoonStudio}
//         options={{ headerShown: false }}
//       />
//         <Stack.Screen
//         name="ComingSoonTherapist"
//         component={ComingSoonTherapist}
//         options={{ headerShown: false }}
//       />
//           <Stack.Screen
//         name="ComingSoonInfluencer"
//         component={ComingSoonInfluencer}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AadharVerification"
//         component={AadharVerification}
//         options={{ headerShown: false }}
//       />
   
//      <Stack.Screen
//         name="BankVerification"
//         component={BankVerification}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="UpdateBankVerification"
//         component={UpdateBankVerification}
//         options={{ headerShown: false }}
//       />
//        <Stack.Screen
//         name="UpdateAadharVerification"
//         component={UpdateAadharVerification}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Referral"
//         component={Referral}
//         options={{ headerShown: false }}
//       />
//        <Stack.Screen
//         name="UpdateTLocation"
//         component={UpdateTLocation}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };
