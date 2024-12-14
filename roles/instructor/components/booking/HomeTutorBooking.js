import React, { useCallback } from "react";
import { Text, View, StyleSheet, Image, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../../../components/header/Header";
import { icons } from "../../../../components/constants";
import { StatusBar } from 'expo-status-bar';
import { COLORS } from "../../../../components/constants";
const HomeTutorBooking = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
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
    }, [navigation])
  );

  return (
    <View style={styles.container}>
    <StatusBar backgroundColor={COLORS.primary} style="light"  />

    <View style={{ paddingTop: 20 }}>
        <Header title={"My Bookings"} icon={icons.back} />
      </View>    
    <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image source={require("../../../../assets/booking1.png")} style={styles.image} />
        </View>
        <Text style={styles.text}>No Booking Found!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 250,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    marginTop: 5,
    fontFamily: "Poppins",
    fontSize: 18,
    textAlign: "center",
    color: "#5F33E1",
  },
});

export default HomeTutorBooking;
