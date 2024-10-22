import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import {COLORS} from "../components/constants";
import icons from "../components/constants/icons";
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("MainStack");
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={require("../assets/swasti_bharat.png")} style={styles.logo} />
      <Text style={styles.title}>Swasti Bharat</Text>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomTitle}>Handicraft in #Bharat</Text>
        <Image source ={icons.flag} style={styles.flag}></Image>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 20,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 5,
    fontFamily: 'PoppinsSemiBold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomTitle: {
    color: "white",
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  flag: {
    marginLeft: 5,
    height:20,
    width:20,
    resizeMode:'contain'
  },
});

export default SplashScreen;
