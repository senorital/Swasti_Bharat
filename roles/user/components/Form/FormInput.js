import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { EvilIcons } from '@expo/vector-icons';

const FormInput = ({
  labelValue,
  onChangeText,
  title = '',
  placeholderText = '',
  iconType = '',
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = true,
  inputMode = 'text'
}) => {
  const [countryCode, setCountryCode] = useState('IN'); // Default country code
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2);
    setCountryPickerVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.input}>
        <CountryPicker
          countryCode={countryCode}
          withFlagButton={true}
          withCountryNameButton={false}
          withCallingCodeButton={true}
          withFilter={true}
          withAlphaFilter={true}
          onSelect={onSelectCountry}
          visible={countryPickerVisible}
          containerButtonStyle={{ paddingHorizontal: 0 }}
          textStyle={{ fontSize: 12, fontFamily: 'Poppins', color: '#333' }} // Adjust font size and family
        />
        <TouchableOpacity onPress={() => setCountryPickerVisible(!countryPickerVisible)}>
          <EvilIcons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        <TextInput
          value={labelValue}
          onChangeText={onChangeText}
          style={styles.inputText}
          placeholder={placeholderText}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          inputMode={inputMode}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {},
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E3E5E5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: '#333',
    marginTop: 2,
    marginLeft: 10,
  },
});

export default FormInput;
