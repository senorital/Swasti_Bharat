import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Header = ({ title, icon }) => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack} style={{marginTop:5}}>
        <Image source={icon} style={styles.back} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    
    flexDirection: "row",
    // backgroundColor: "#fff",
    elevation: 0.1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop:20
  },
  back: {
    width: 20,
    height: 20,
  },
  titleContainer: {
    flex: 1, // Let the title take up the remaining space
    justifyContent: "left",
    alignItems: "left",
    marginLeft:20
  },
  title: {
    fontSize: 18,
    // fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
});
