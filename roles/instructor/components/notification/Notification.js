import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, StatusBar, ActivityIndicator,BackHandler } from "react-native";
import { Avatar } from "react-native-elements";
import Header from "../../../../components/header/Header";
import { useSelector } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import { getServiceNotification, viewServiceNotification } from "../../../../redux/actions/instructor/notification/notification"; // Import both functions
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AntDesign from '@expo/vector-icons/AntDesign';

const Notification = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.auth.user);
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Call the first API
        const viewRes = await dispatch(viewServiceNotification());
        const viewData = viewRes.data?.message || [];
        console.log(viewRes.message)
        
        // Call the second API after the first one completes
        const serviceRes = await dispatch(getServiceNotification());
        const serviceData = serviceRes.data?.notification || [];

        // Combine notifications from both responses
        const combinedNotifications = [...viewData, ...serviceData];
        setNotifications(Array.isArray(combinedNotifications) ? combinedNotifications : []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Notification"} icon={icons.back} />
      </View>

      {loading ? (
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        // Show a static welcome message if no notifications
        <View style={{ marginVertical: 8, marginHorizontal: 20, flexDirection: "row" }}>
        <View style={{ marginTop: 4 }}>
          <View style={styles.icon}>
            <AntDesign name="message1" size={24} color="black" />
          </View>
        </View>
        <View style={{ marginTop: 8, marginLeft: 10 }}>
          <Text
            style={{
              fontFamily: "Poppins",
              fontSize: 12,
              width:290 
            }}
          >
           Hello and Welcome! {user.data.name},
          Thank you for registering with Swasti Bharat. You’re now part of our vibrant community. Take a moment to set up your profile and start exploring our features. We’re excited to support you on your journey!
            </Text>
          </View>
          </View>

      ) : (
        <ScrollView style={{ backgroundColor: COLORS.white }}>
          {notifications.map((notification, index) => (
            <View key={index}>
              <View style={{ marginVertical: 8, marginHorizontal: 20, flexDirection: "row" }}>
                <View style={{ marginTop: 4 }}>
                  <View style={styles.icon}>
                    <AntDesign name="message1" size={24} color="black" />
                  </View>
                </View>
                <View style={{ marginTop: 8, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 14,
                      fontWeight: "700",
                      width: 95,
                      height: 20,
                    }}
                  >
                    {notification.title || 'Notification'}
                  </Text>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins",
                        fontWeight: "400",
                        marginTop: 3,
                      }}
                    >
                      {notification.notification}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 10,
                        marginTop: 3,
                        color: 'grey',
                      }}
                    >
                      {notification.timeAgo || '10 min ago'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.hr} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hr: {
    position: "relative",
    width: "100%",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    opacity: 0.1,
    marginTop: 0,
  },
  contentContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal:20

  },
  welcomeText: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: COLORS.primary,
  },
  icon: {
    backgroundColor: COLORS.notifyicon,
    padding: 5,
    borderColor: COLORS.notifyicon,
    borderWidth: 1,
    borderRadius: 12,
  },
});

export default Notification;
