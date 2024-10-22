import React, { forwardRef } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

const OtpInput = forwardRef(({ value, onChangeText, index, onFocusNext }, ref) => {
  const focusNextInput = () => {
    if (onFocusNext) {
      onFocusNext(index + 1);
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Backspace' && value === '') {
      if (onFocusNext) {
        onFocusNext(index - 1);
      }
    }
  };

  return (
    <TextInput
      ref={ref}
      style={styles.input}
      value={value}
      onChangeText={(text) => {
        onChangeText(text);
        if (text.length === 1) {
          focusNextInput();
        }
      }}
      onKeyPress={handleKeyPress}
      keyboardType="numeric"
      maxLength={1}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: ScreenWidth/8,
    height: 45,
  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    margin: 5,
    fontSize: 18,
  },
});

export default OtpInput;
