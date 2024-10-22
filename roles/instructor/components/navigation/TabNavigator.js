import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Badge } from "react-native-elements";
import Home from "../../components/tabComponent/Home";
// import Class from "../tabComponent/Class";
import { useSelector } from "react-redux";
// import Cart from "../tabComponent/Cart";
// import Profile from "../tabComponent/Profile";
import HomeIcon from "../../../../assets/nav-icons/home.png";
import HomeActive from "../../../../assets/nav-icons/homeActive.png";
import SnagIcon from "../../../../assets/nav-icons/booking.png";
import SnagActive from "../../../../assets/nav-icons/bookingActive.png";
import CartIcon from "../../../../assets/nav-icons/notification_.png";
import CartActive from "../../../../assets/nav-icons/notificationActive.png";
import UserIcon from "../../../../assets/nav-icons/user.png";
import UserActive from "../../../../assets/nav-icons/profileActive.png";
import Profile from "../tabComponent/Profile";
import BookingTab from "../booking/BookingTab";
import HomeTutorBooking from "../booking/HomeTutorBooking";
// import LiveClasses from "../liveClasses/LiveClasses";
// import MainBooking from "../booking/MainBooking";
import Notification from "../notification/Notification";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // Example state for unread messages
  // const [unreadMessages, setUnreadMessages] = useState(10); // Replace with your logic to fetch unread messages
  // const { notifications, unViewedNotification } = useSelector((state) => state.notification);

  useEffect(() => {
    // Fetch the unread messages count from your backend or context/state management
    // setUnreadMessages(fetchUnreadMessagesCount());
  }, []);

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#5F33E1",
          tabBarInactiveTintColor: "#8e8e93",
          tabBarStyle: {
            height: 65,
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            elevation: 10,
            fontFamily: 'Poppins_Medium',
            backgroundColor: "#f9f9f9",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
        }}
      >
        <Tab.Screen
          name={"Home"}
          component={Home}
          options={{
            tabBarLabelStyle: { marginTop: 28, fontSize: 12, fontFamily: 'Poppins' },
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
          name="Booking"
          component={HomeTutorBooking}
          options={{
            tabBarLabelStyle: { marginTop: 28, fontSize: 12, fontFamily: 'Poppins' },
            tabBarLabel: "Booking",
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? SnagActive : SnagIcon}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{
            tabBarLabelStyle: { marginTop: 28, fontSize: 12, fontFamily: 'Poppins' },
            tabBarLabel: "Notification",
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Image
                  source={focused ? CartActive : CartIcon}
                  style={styles.icon}
                />
                {/* {unViewedNotification > 0 && (
                  <Badge
                    value={unViewedNotification}
                    status="error"
                    containerStyle={styles.badgeContainer}
                    badgeStyle={styles.badge}
                    textStyle={styles.badgeText}
                  />
                )} */}

               <Text>1</Text>

              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
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
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    resizeMode:'contain'
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
    backgroundColor: '#5F33E1', // Custom background color
  },
  badgeText: {
    fontSize: 10, // Custom font size
    color: '#FFFFFF', // Custom text color
    textAlign: 'center', // Center the text
    width: '100%', // Ensure the text takes up the full width of the badge
    fontFamily:'Poppins',
    marginTop:2
  },
});

export default TabNavigator;
