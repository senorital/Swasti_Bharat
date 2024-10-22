import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS

 } from "../../../../components/constants";
const Accordion = ({ title, answer }) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setAccordionOpen(!accordionOpen)}
        style={styles.header}
      >
        <Text style={[styles.title, accordionOpen && styles.openTitle]}>
          {title}
        </Text>
        <Icon 
          name={accordionOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={20} 
          color="#000" 
        />
      </TouchableOpacity>
      <View style={styles.hr}/>
      {accordionOpen && (
        <View style={styles.content}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hr: {
    position: "relative",
    width: "100%",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    opacity: 0.1,
    marginTop: 0,
  },
  container: {
    // backgroundColor: "#fff",
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: "#dcdcdc",
    // borderRadius: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins',
    width: 270,
    flexWrap: 'wrap'
  },
  openTitle: {
    color: COLORS.primary, // Change color when accordion is open
    fontFamily:'Poppins_Medium'
  },
  icon: {
    fontSize: 20,
    fontWeight: "300",
    
  },
  content: {
    marginHorizontal: 10,
    paddingVertical: 15,
  },
  answer: {
    fontSize: 12.5,
    justifyContent:'space-evenly',
    alignContent:'space-evenly',
    textAlign:'auto',
    fontFamily: 'Poppins'
  },
});

export default Accordion;
