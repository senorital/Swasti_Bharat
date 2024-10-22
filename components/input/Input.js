  import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const Input = ({
  label,
  iconName,
  error,
  password,
  multiline,
  numberOfLines,
  placeholderTextColor = COLORS.grey,
  isRequired = false,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputProps = {
    autoCorrect: false,
    onFocus: () => {
      onFocus();
      setIsFocused(true);
    },
    onBlur: () => setIsFocused(false),
    secureTextEntry: hidePassword,
    placeholderTextColor,
    style: [
      styles.input,
      multiline ? styles.multilineInput : null,
      { color: "gray" }
    ],
    ...props
  };

  if (multiline) {
    inputProps.multiline = true;
    inputProps.numberOfLines = numberOfLines || 4;
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}{isRequired && <Text style={{ color: 'red' }}> *</Text>}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? "red" : isFocused ? COLORS.icon_background : COLORS.icon_background,
            borderWidth:1,
            alignItems: "center",
            fontFamily:'Poppins-Medium',
            backgroundColor:COLORS.white
          },
        ]}
      >
        {/* <Icon
          name={iconName}
          style={{color: 'blue', fontSize: 22, marginRight: 10}}
        /> */}
        <TextInput {...inputProps} />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            style={{ color: "darkblue", fontSize: 22 }}
          />
        )}
      </View>
      {error && (
        <Text
          style={{
            marginTop: 7,
            color: "red",
            fontSize: 12,
            fontFamily: "Poppins",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: '600',
    color:COLORS.primary,
    marginBottom:5
  },
  inputContainer: {
    // backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    fontFamily: "Poppins",
    color: '#000',
    // textAlignVertical:'top'
  },
  input: {
    flexGrow: 1,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
  },
});

export default Input;
