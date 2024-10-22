import React, {useEffect} from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { COLORS } from "../constants";
const SplashScreen = ({navigation}) => {

    useEffect(()=>{
    setTimeout(()=>{
   navigation.navigate('MainStack')
    },3000);
    },[])
  return (
    <View style={[styles.container]}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={require("../assets/swasti_bharat.png")} style={styles.logo} />
      <Text style={styles.title}>Swasti Bharat</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 20,
  },
  title: {
    color: "white",
    fontSize: 22,
    marginTop: 5,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SplashScreen;
