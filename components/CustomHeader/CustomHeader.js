import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants";

const CustomHeader = ({ title, icon, buttonText, onPress, destination }) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    if (destination) {
      navigation.navigate(destination);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Image source={icon} style={styles.back} />
      </TouchableOpacity>

      <Text style={[styles.title, { marginLeft: 20 }]}>{title}</Text>

      {buttonText && (
        <TouchableOpacity onPress={handleNavigation}>
          <View style={styles.btnContainer}>
            <Text style={styles.btn}>{buttonText}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    marginVertical:20,
    flexDirection: "row",
    // backgroundColor: "#fff",
    elevation: 0.1,
    alignItems: "center",
    paddingLeft: 10,
  },
  back: {
    width: 20,
    height: 20,
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily:'Poppins-SemiBold',
    // width: 190,
    flex:1,
    flexDirection:'row'
  },
  btnContainer: {
    width: 90,
    height: 35,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom:10,
    // marginHorizontal:10
  },
  btn: {
    fontSize: 14,
    fontFamily:'Poppins',
    fontWeight: "600",
    color: "#fff",
  },
});
