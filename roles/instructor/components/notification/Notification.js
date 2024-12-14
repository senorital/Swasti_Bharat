import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, StatusBar, BackHandler } from "react-native";
import { Avatar } from "react-native-elements";
import Header from "../../../../components/header/Header";
import { useSelector } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import { getServiceNotification, viewServiceNotification } from "../../../../redux/actions/instructor/notification/notification";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const Notification = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.auth.user);

 

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
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.shimmerWrapper}>
              <ShimmerPlaceHolder
                style={styles.shimmerIcon}
                shimmerColors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
              />
              <View style={styles.shimmerTextContainer}>
                <ShimmerPlaceHolder
                  style={styles.shimmerTitle}
                  shimmerColors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
                />
                <ShimmerPlaceHolder
                  style={styles.shimmerSubtitle}
                  shimmerColors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
                />
              </View>
            </View>
          ))}
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ marginVertical: 8, marginHorizontal: 20, flexDirection: "row" }}>
          <View style={{ }}>
            <View style={styles.icon}>
            <MaterialCommunityIcons name="message-processing-outline" size={20} color="black" />
            </View>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 13,
                paddingRight: 20,
                lineHeight: 18,
                textAlign: "justify",
              }}
            >
              Hello and Welcome ! {user?.data?.name} , Thank you for registering with Swasti Bharat...
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
                <View style={{ marginTop: 5, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 14,
                      fontWeight: "700",
                      width: 95,
                      height: 20,
                    }}
                  >
                    {notification.title || "Notification"}
                  </Text>
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
                      color: "grey",
                    }}
                  >
                    {notification.timeAgo || "10 min ago"}
                  </Text>
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
    width: "100%",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    opacity: 0.1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  shimmerWrapper: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  shimmerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  shimmerTextContainer: {
    flex: 1,
  },
  shimmerTitle: {
    height: 10,
    width: "50%",
    marginBottom: 5,
  },
  shimmerSubtitle: {
    height: 8,
    width: "80%",
  },
  icon: {
    backgroundColor: COLORS.notifyicon,
    padding: 0,
    borderColor: COLORS.notifyicon,
    borderWidth: 1,
    borderRadius: 12,
  },
});

export default Notification;
