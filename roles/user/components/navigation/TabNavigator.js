import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TransitionPresets } from '@react-navigation/stack';
import { LinearGradient } from "expo-linear-gradient";
import HomeIcon from "../../../../assets/nav-icons/home.png";
import HomeActive from "../../../../assets/nav-icons/homeActive.png";
import SnagIcon from "../../../../assets/icons/class_filled.png";
import SnagActive from "../../../../assets/icons/class_unfilled.png";
import CartIcon from "../../../../assets/icons/list_unfil.png";
import CartActive from "../../../../assets/icons/list_fill.png";
import UserIcon from "../../../../assets/nav-icons/user.png";
import UserActive from "../../../../assets/nav-icons/profileActive.png";
import HomeScreen from "../../screens/HomeScreen";
import Class from "../classes/myClasses";
import Index from "../HomeTutor/Index";
import MainProfile from '../Profile/MainProfile';
import { COLORS } from "../../../../components/constants";
const Tab = createBottomTabNavigator();


const UserTabNavigator = () => {


  return (
    <Tab.Navigator
    initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: {
          height: 65,
          // marginBottom:30,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          fontFamily: 'Poppins-Medium',
          borderTopLeftRadius: 30, // Increased curve for top-left corner
          borderTopRightRadius: 30, // Increased curve for top-right corner
          overflow: "hidden", // Ensure the corners are not clipped
          // elevation: 1, // Disable shadow effect
          // borderColor:'#F9F9F9',
          borderTopWidth:1,
          // backgroundColor: "transparent", // Remove default white
        },
      }}
    >
      {/* Render the custom background */}
      {/* <Tab.Screen
        name="TabBarBackground"
        component={TabBarBackground}
        options={{ tabBarButton: () => null }} // Don't show a tab for the background screen
      /> */}

      <Tab.Screen
        name={"HomeScreen"}
        component={HomeScreen}
        options={{
          tabBarLabelStyle: { marginTop: 28, fontSize: 12, fontFamily: 'Poppins-Medium' },
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? HomeActive : HomeIcon}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Classes"
        component={Class}
        options={{
          tabBarLabelStyle: { marginTop: 28, fontSize: 12, fontFamily: 'Poppins' },
          tabBarLabel: "Classes",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? SnagActive : SnagIcon}
              style={[styles.icon, { width: 30, height: 20 }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Index"
        component={Index}
        options={{
          tabBarLabelStyle: { marginTop: 28, fontSize: 12, fontFamily: 'Poppins' },
          tabBarLabel: "Instructors",
          tabBarIcon: ({ focused }) => (
            // <View style={styles.iconContainer}>
              <Image
                source={focused ? CartActive : CartIcon}
                style={[styles.icon, { width: 30, height: 25 }]}
              />
            // </View>
          ),
          // ...TransitionPresets.SlideFromRightIOS, // Add left-to-right slide transition here
        }}
      />
      <Tab.Screen
        name="MainProfile"
        component={MainProfile}
        options={{
          tabBarLabelStyle: { marginTop: 28, fontSize: 12, fontFamily: 'Poppins' },
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? UserActive : UserIcon}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    resizeMode: 'contain',
  },
  iconContainer: {
    position: 'relative',
    top: -25
  },
  badgeContainer: {
    position: 'absolute',
    top: 23,
    right: -11,
  },
  badge: {
    // backgroundColor: '#5F33E1', // Custom background color
  },
});

export default UserTabNavigator;
