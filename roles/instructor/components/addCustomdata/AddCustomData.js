import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const AddCustomData = ({ languages, setLanguages, label, isRequired = false }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleInputConfirm = (value) => {
    if (value) {
      setLanguages([...languages, value]);
    }
    setInputVisible(false);
    setSelectedValue("");
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const indianLanguages = [
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Bengali', value: 'Bengali' },
    { label: 'Telugu', value: 'Telugu' },
    { label: 'Marathi', value: 'Marathi' },
    { label: 'Tamil', value: 'Tamil' },
    { label: 'Urdu', value: 'Urdu' },
    { label: 'Gujarati', value: 'Gujarati' },
    { label: 'Kannada', value: 'Kannada' },
    { label: 'Odia', value: 'Odia' },
    { label: 'Malayalam', value: 'Malayalam' },
    { label: 'Punjabi', value: 'Punjabi' },
    { label: 'Assamese', value: 'Assamese' },
    { label: 'Maithili', value: 'Maithili' },
    { label: 'Bhili/Bhilodi', value: 'Bhili/Bhilodi' },
    { label: 'Santali', value: 'Santali' },
    { label: 'Kashmiri', value: 'Kashmiri' },
    { label: 'Nepali', value: 'Nepali' },
    { label: 'Gondi', value: 'Gondi' },
    { label: 'Sindhi', value: 'Sindhi' },
    { label: 'Konkani', value: 'Konkani' },
    // Add more Indian languages if needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {isRequired && <Text style={{ color: 'red' }}> *</Text>}
      </Text>
      <View style={styles.languageContainer}>
        {inputVisible ? (
          <RNPickerSelect
            onValueChange={handleInputConfirm}
            items={indianLanguages}
            style={pickerSelectStyles}
            placeholder={{
              label: `Select ${label}`,
              value: null,
            }}
            value={selectedValue}
            useNativeAndroidPickerStyle={false}
            textInputProps={{
              style: styles.inputWithIcon,
            }}
            Icon={() => {
              return <AntDesign name="plus" size={16} color="#333" style={styles.icon} />;
            }}
          />
        ) : (
          <TouchableOpacity onPress={showInput} style={styles.tag}>
            <AntDesign name="plus" size={16} color="#333" />
            <Text style={styles.tagText}>New {label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  inputWithIcon: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    width:320,
    padding:9,
    fontFamily: "Poppins",
    color: '#000',
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 14,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  tagText: {
    marginLeft: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  inputAndroid: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default AddCustomData;
