import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { Linking } from 'react-native';

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
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import EditProfile from "../profile/myprofile/EditProfile";
import AddQualification from "../roles/instructor/components/qualification/AddQuaification";
import Qualification from "../roles/instructor/components/qualification/Qualification";
import Notification from "../roles/instructor/components/notification/Notification";
import Referral from "../profile/shareAndEarn/referral";
import HomeTutor from "../roles/instructor/components/homeTutor/HomeTutor";
import AddTimeSlot from "../roles/instructor/components/homeTutor/AddTimeSlot";
import ShowHomeTutor from "../roles/instructor/components/homeTutor/ShowHomeTutor";
import AllHomeTutor from "../roles/instructor/components/homeTutor/AllHomeTutor";
import AddTLocation from "../roles/instructor/components/tutorLocation/AddTLocation";
import AddTutorPhoto from "../roles/instructor/components/homeTutor/AddTutorPhoto";
import UpdateHomeTutor from "../roles/instructor/components/homeTutor/UpdateHomeTutor";
import ConfirmOrder from '../roles/user/components/HomeTutor/confirmOrder';
import AadharVerification from "../roles/instructor/components/AadharVerification/AadharVerification";
import BankVerification from "../roles/instructor/components/BankVerification/BankVerification";
import UpdateBankVerification from "../roles/instructor/components/BankVerification/UpdateBankVerification";
import UpdateAadharVerification from "../roles/instructor/components/AadharVerification/UpdateAadharVerification";
import Category from "../roles/user/components/category/category";
import UpdateTLocation from "../roles/instructor/components/tutorLocation/UpdateTLocation";
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
import Role from "../auth/roles/Role";
import HomeTutorBooking from "../roles/instructor/components/booking/HomeTutorBooking";
import VersionCheck from 'react-native-version-check';
import VersionCheckModal from "../components/versionCheck/versionCheckModal";
import { useDispatch } from "react-redux";
import { getVersion,addUpdateVersion } from "../redux/actions/auth/auth";
import { store } from "../redux/store/store";
import HomeTutorSearch from "../roles/user/components/Search/HomeTutorSearch";
import LocateAddress from "../roles/user/components/addressBook/LocateAddress";
import UserProfileOverview from "../roles/user/components/Profile/ProfileOverview";
import UserShare from "../roles/user/components/shareAndEarn/share";
import Session from "../roles/user/components/classes/sessions";
import AddTutorPrice from "../roles/instructor/components/homeTutor/AddTutorPrice";
  const Stack = createNativeStackNavigator();

  export default function Main() {
    const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null); // Added role state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [appVersion, setAppVersion] = useState(null);
    const dispatch = useDispatch();
    const [referralCode, setReferralCode] = useState(null);

   
  
    
 
    useEffect(() => {
      const initializeApp = async () => {        
        // Proceed with alreadyLaunched logic
        const alreadyLaunched = await AsyncStorage.getItem("alreadyLaunched");
        console.log("alreadyLaunched :" + alreadyLaunched)
        if (alreadyLaunched === null) {
          await AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstTimeLoad(true);
    
        } else {
          setIsFirstTimeLoad(false);
        }
      };  
    
      initializeApp(); // Wrap initialization in an async function
    }, []);

  

    const addVersion = async () => {
      const currentVersion = VersionCheck.getCurrentVersion();
      setAppVersion(currentVersion);
      
      try {
        const formData = { latestVerision : currentVersion };
        const response = await dispatch(addUpdateVersion(formData));
        setIsModalVisible(false); // Close modal if shown
       } catch (error) {
        console.error("Error in POST API call for version check", error);
      }
    };
  
    const checkAppVersion = async () => {
      const currentVersion = VersionCheck.getCurrentVersion();
      setAppVersion(currentVersion);
      const playStoreVersion = await VersionCheck.getLatestVersion();

      try {
        const response = await dispatch(getVersion());
        if (response?.data?.latestVerision) {
          const storedVersion = response?.data?.latestVerision;  

        if (storedVersion && storedVersion !== currentVersion || playStoreVersion !== storedVersion) {
          setIsModalVisible(true); 
        }} else {
          setIsModalVisible(true); 
  
        }
      } catch (error) {
        console.error("Error fetching stored version", error);
      }

     
    };

    useEffect(() => {
      const fetchData = async () => {
        const loggedInData = await AsyncStorage.getItem("isLoggedIn");
        const userRoleData = await AsyncStorage.getItem("userRole");
        setRole(userRoleData);
        if (loggedInData === 'true') {
          setIsLoggedIn(true);
      } else {
          setIsLoggedIn(false);
      }
      
      };
    
      fetchData();
    }, []);
    





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
              initialParams={{ isLoggedIn, isFirstTimeLoad, role }} // Pass role
            />
            </Stack.Navigator>
            <Toast />
          </BottomSheetModalProvider>
        </NavigationContainer>
        <VersionCheckModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onUpdate={addVersion}  
      />
      </GestureHandlerRootView>
    );
  }

  const MainStack = ({ navigation, route }) => {
    const { isLoggedIn, isFirstTimeLoad ,role} = route.params;
      const [loading, setLoading] = useState(true); // Add loading state
     console.log("Role :" + role)

    useEffect(() => {
      if (isFirstTimeLoad === null || isLoggedIn === null) {
        return;
      }
     console.log("isLoggedin" + isLoggedIn)
    

      setLoading(false); 
    }, [isLoggedIn, isFirstTimeLoad]);

    if (loading) {
      return null;
    }
  

    return (
      <Stack.Navigator>
        {isLoggedIn  ? (
   
          <Stack.Screen
          name="appStack"
          component={AppStack}
         options={{ headerShown: false }}
         initialParams={{ role : role }} // Pass role to AppStack
         />

        ) : 
         isFirstTimeLoad ? (
         
          <>
            <Stack.Screen
              name="OnBoardingScreen"
              component={OnBoardingScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Authentication Flow for Unauthenticated Users
          <>
            <Stack.Screen
              name="AuthStack"
              component={AuthStack}
              options={{ headerShown: false }}
              initialParams={{ role : role }} // Pass role to AppStack

            />
         
          </>
        )}
      </Stack.Navigator>
    );
    
  };


  
  const AuthStack = ({route}) => {
    const { role} = route.params;
    console.log("AuthStack",role)

    return (
      <Stack.Navigator>
        <>
          {console.log("Rendering Login Screen")}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
  
          {console.log("Rendering DenyLocation Screen")}
          <Stack.Screen
            name="DenyLocation"
            component={DenyLocation}
            options={{ headerShown: false }}
          />
  
          {console.log("Rendering Otp Screen")}
          <Stack.Screen
            name="Otp"
            component={Otp}
            options={{ headerShown: false }}
          />
          {/* (role ) */}
          {console.log("Rendering Role Screen")}
          <Stack.Screen
            name="Role"
            component={Role}
            options={{ headerShown: false }}
          />
  
          {console.log("Rendering Register Screen")}
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
  
          {console.log("Rendering TermConditions Screen")}
          <Stack.Screen
            name="TermConditions"
            component={TermConditions}
            options={{ headerShown: false }}
          />
  
          {console.log("Rendering PrivacyPolicy Screen")}
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: false }}
          />
            <Stack.Screen
              name="appStack"
              component={AppStack}
              options={{ headerShown: false }}
              initialParams={{ role : role }} // Pass role to AppStack
            />
        </>
      </Stack.Navigator>
    );
  };
  
  const AppStack = ({ route }) => {
    const roles = route?.params;

  //  if(roles == "true"){
    console.log("AppStack rendered with role:", roles);

    return (
      <Stack.Navigator >
         {roles ? (
          <>
            <Stack.Screen
              name="TabNavigator"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
             <Stack.Screen
          name="DenyLocation"
          component={DenyLocation}
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
          name="AddTutorPrice"
          component={AddTutorPrice}
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
          name="HomeTutorBooking"
          component={HomeTutorBooking}
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
      //  </Stack.Navigator>   
    
         ) : (
          <>
           

            <Stack.Screen
              name="UserTabNavigator"
              component={UserTabNavigator}
              options={{ headerShown: false }}
            />
             <Stack.Screen
          name="DenyLocation"
          component={DenyLocation}
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
            name="HomeTutorSearch"
            component={HomeTutorSearch}
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
            name="UserProfileOverview"
            component={UserProfileOverview}
            options={{ headerShown: false }}
          />
          
          <Stack.Screen
            name="AddressBook"
            component={AddressBook}
            options={{ headerShown: false }}
          />
         
         <Stack.Screen
            name="LocateAddress"
            component={LocateAddress}
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

              
           <Stack.Screen
            name="UserShare"
            component={UserShare}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="Session"
            component={Session}
            options={{ headerShown: false }}
          />
          </>
         ) }
           
    </Stack.Navigator>
    
        

    

);
}

    
  
  


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


 

