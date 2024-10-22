import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  BackHandler,
} from "react-native";
import Header from "../header/Header";
import { COLORS, icons } from "../constants";

const PrivacyPolicy = ({ navigation }) => {
  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        // Check if the current screen is focused
        navigation.goBack(); // Go back if the current screen is focused
        return true; // Prevent default behavior (exiting the app)
      }
      return false; // If not focused, allow default behavior (exit the app)
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
        <Header
          title={"Privacy Policy"}
          icon={icons.back}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
      >
        <View style={{ flex: 1 }}>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "PoppinsSemiBold",
                color: COLORS.primary,
                
              }}
            >
              Introduction
            </Text>
            <Text
                  style={styles.text}
                >
              We are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our application.
            </Text>
          </View>

          <View style={{ paddingVertical: 20 }}>
            <Text
              style={{
                fontFamily: "PoppinsSemiBold",
            fontSize: 17,
            marginVertical:10,
            color: COLORS.primary,
            textDecorationLine:'underline'
              }}
            >
              Data Collection
            </Text>

            <View style={{ flexDirection: "row" }}>
              <View style={styles.dot} />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "PoppinsSemiBold",
                  color: COLORS.primary,
                }}
              >
                &nbsp; Personal Information :
              </Text>
            </View>
            <Text
                  style={styles.text}
                >
              Name, email address, phone number, address, payment information,
              etc.
            </Text>

            <View style={{ flexDirection: "row" }}>
              <View style={styles.dot} />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "PoppinsSemiBold",
                  color: COLORS.primary,
                }}
              >
                &nbsp; Usage Data :
              </Text>
            </View>
            <Text
                  style={styles.text}
                >
              Information on how the app is accessed and used, including device
              information, IP address, browser type, etc.
            </Text>
            <View style={{ paddingVertical: 10 }}>
              <Text
                style={{
                  fontFamily: "PoppinsSemiBold",
            fontSize: 17,
            marginVertical:10,
            color: COLORS.primary,
            textDecorationLine:'underline'
                }}
              >
                Data Usage
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; To provide and maintain our services.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; To notify you about changes to our services.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; To allow you to participate in interactive features.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; To provide customer support.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; To gather analysis for service improvement.
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontFamily: "PoppinsSemiBold",
                  fontSize: 17,
                  marginVertical:10,
                  color: COLORS.primary,
                  textDecorationLine:'underline'
                }}
              >
                Data Protection
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; We implement security measures to protect your
                  information.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; Data encryption and secure server storage.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; Regular security audits and updates.
                </Text>
              </View>
            </View>
            <View style={{ paddingVertical: 20 }}>
              <Text
                style={{
                  fontFamily: "PoppinsSemiBold",
            fontSize: 17,
            marginVertical:10,
            color: COLORS.primary,
            textDecorationLine:'underline'
                }}
              >
                User Rights
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; Access: You can request access to your personal
                  information.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; Correction: You can request corrections to any
                  inaccurate information.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.dot} />
                <Text
                  style={styles.text}
                >
                  &nbsp; Deletion: You can request the deletion of your personal
                  information.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginVertical: 8,
    // marginLeft: 20,
  },
  text :{
    fontSize: 13,
    fontFamily: "Poppins_Light",
    color: COLORS.black,
    textAlign: "justify",
  }
});

export default PrivacyPolicy;
