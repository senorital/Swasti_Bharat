import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
// import Batches from "../components/Courses/Batches";
import HomeScreen from "../../screens/HomeScreen";
// import TherapistScreen from "../screens/TherapistScreen";
import MainProfile from "../../components/Profile/MainProfile";
import Index from "../HomeTutor/Index";
import Class from "../classes/myClasses";
// import CourseDetail from "../screens/courses/CourseDetail";
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import MentorScreen from "../screens/mentor/MentorScreen";
// import WishList from "../components/Courses/Wishlist";
// import Profile from "../screens/Profile";
// import SearchResult from "../components/Search/SearchResult";
// import Index from "../components/HomeTutor/Index";
// import ShowHomeTutor from "../components/HomeTutor/ShowHomeTutor";
// import CategoryDetail from "../components/therapist/CategoryDetail";
// import BookAppointment from "../components/therapist/BookAppointment";

const Stack = createStackNavigator();  


const screenOptions = {
  headerStyle: {
  
  
  },
  headerTitleAlign: 'left',
  headerLeftContainerStyle: { paddingLeft: 10 },
};

const FirstScreenNavigator = ({route}) => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="TherapistScreen"
        component={TherapistScreen}
        options={{ headerShown: false }}
      /> */}
{/* 
       <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetail}
        options={{ headerShown: false }}

      /> */}

    
{/*       
      <Stack.Screen
        name="MainProfile"
        component={MainProfile}
        options={{ headerShown: false }}

      /> */}
      {/* <Stack.Screen
        name="CourseDetail"
        component={CourseDetail}
        options={{ headerShown: false }}

      />
      <Stack.Screen
        name="MentorScreen"
        component={MentorScreen}
        options={{ headerShown: false }}

      /> */}
    </Stack.Navigator>
  );
};

export { FirstScreenNavigator };

const SecondScreenNavigator = ({route}) => {

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Class"
        component={Class}
        options={{ headerShown: false }}

      />
    </Stack.Navigator>
  );
};

export { SecondScreenNavigator };

const ThirdScreenNavigator = ({route}) => {

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Index"
        component={Index}
        options={{ headerShown: false }}

      />
    </Stack.Navigator>
  );
};

export { ThirdScreenNavigator };

const FourthScreenNavigator = ({route}) => {

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MainProfile"
        component={MainProfile}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Wishlist"
        component={WishList}
        options={{ headerShown: false }}

      /> */}
    </Stack.Navigator>
  );
};

export { FourthScreenNavigator };
