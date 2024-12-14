import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS } from '../constants';

const CustomTimePickerWithClock = ({ isVisible, onConfirm, selectedTime }) => {
  const [selectedHour, setSelectedHour] = useState(selectedTime ? selectedTime.getHours() : 0);
  const [selectedMinute, setSelectedMinute] = useState(selectedTime ? selectedTime.getMinutes() : 0);

  const closeModal = () => {
    onConfirm(new Date(0, 0, 0, selectedHour, selectedMinute));
  };

  const generateOptions = (range) => Array.from({ length: range }, (_, i) => i);

  const renderItem = ({ item, type }) => {
    const isSelected = type === "hour" ? item === selectedHour : item === selectedMinute;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => (type === "hour" ? setSelectedHour(item) : setSelectedMinute(item))}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item.toString().padStart(2, "0")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.heading}>Select a Time</Text>
             
              <View style={styles.pickerContainer}>
              <View style={styles.column}>
    <Text style={styles.columnLabelText}>Hour</Text>
    <FlatList
      data={generateOptions(24)}
      keyExtractor={(item) => `hour-${item}`}
      renderItem={({ item }) => renderItem({ item, type: "hour" })}
      showsVerticalScrollIndicator={false}
      style={styles.list} // Limit the height

    />
  </View>
  <View style={styles.column}>
    <Text style={styles.columnLabelText}>Minute</Text>
    <FlatList
      data={generateOptions(60)}
      keyExtractor={(item) => `minute-${item}`}
      renderItem={({ item }) => renderItem({ item, type: "minute" })}
      showsVerticalScrollIndicator={false}
      style={styles.list} // Limit the height

    />
  </View>
              </View>
              <TouchableOpacity style={styles.confirmButton} onPress={closeModal}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    maxHeight: "50%",
    paddingBottom: 20, // Added padding at the bottom
  },
  heading: {
    textAlign: "center",
    fontSize: 15,
    fontFamily:'Poppins-Medium',
    marginBottom: 10,
  },
  columnLabels: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    // marginBottom: 10,
    alignItems:'center',
    alignContent:'center'
  },
  columnLabelText: {
    // backgroundColor:COLORS.user_front_theme_color,

    fontSize: 16,
    fontFamily:'Poppins',
    color: "#000",
  },
  pickerContainer: {
    flexDirection: "row", // Arrange columns in a row
    justifyContent: "space-between", // Space out the columns
    alignItems: "flex-start", // Align columns at the top
    
  },
  column: {
    width: "50%", // Set each column to take 45% of the width
    alignItems: "center", // Center align content inside the column
    
  },
  itemContainer: {
    paddingVertical: 8,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#dfe6e9",
    paddingHorizontal:12,
    width:100,
    borderRadius:10
  },
  itemText: {
    fontSize: 15,
    fontFamily:'Poppins',
    color: "#333",
  },
  selectedItemText: {
    // fontWeight: "bold",
    color: COLORS.primary,
    fontFamily:'Poppins-Medium'
  },
  confirmButton: {
    marginTop: 20,
    alignSelf: "center",
    // backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  list: {
    maxHeight: 200, // Limit the height of the FlatList
  },
  confirmButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily:'Poppins-SemiBold',
  },
});

export default CustomTimePickerWithClock;
