// components/ContentSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../../components/constants";

const ContentSection = ({ title, children }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
    color: COLORS.primary,
    // marginVertical: 10,
  },
});

export default ContentSection;
