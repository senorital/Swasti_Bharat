import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";

import { useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "../../../../components/constants";
import { addKYC } from "../../../../redux/actions/auth/auth";

const AadharVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const [inputs, setInputs] = useState({
    name: user.data.name || "",
    aadharNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validate = async (event) => {
    event.preventDefault();

    try {
      let isValid = true;
      const fields = ["name", "aadharNumber", "address"];

      // Validate Name (should not be empty and should contain only alphabetic characters and spaces)
      if (!inputs.name.trim()) {
        handleError("Name is required", "name");
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(inputs.name)) {
        handleError("Name should contain only alphabets and spaces", "name");
        isValid = false;
      }

      // Validate Aadhar Number (should be exactly 12 digits)
      if (!inputs.aadharNumber.trim()) {
        handleError("Aadhar Number is required", "aadharNumber");
        isValid = false;
      } else if (!/^\d{12}$/.test(inputs.aadharNumber)) {
        handleError("Aadhar Number must be exactly 12 digits", "aadharNumber");
        isValid = false;
      }

      // Validate Address (should not be empty)
      if (!inputs.address.trim()) {
        handleError("Address is required", "address");
        isValid = false;
      }

      if (!isValid) return;

      setLoading1(true);

      // Create formData object for API call
      const formData = {
        name: inputs.name,
        aadharNumber: inputs.aadharNumber,
        address: inputs.address,
        isVerify: true, // Adding the isVerify field with a value of true
      };
      console.log("formData :" + formData)

      const res = await dispatch(addKYC(formData));

      if (res.success) {
        setErrors({});
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        ToastAndroid.show(res.message || "An error occurred. Please try again.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      const msg = error.res?.data?.message || "An error occurred. Please try again.";
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } finally {
      setLoading1(false);
    }
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack(); // Go back if the current screen is focused
        return true; // Prevent default behavior (exit app)
      }
      return false; // If not focused, allow default behavior (exit app)
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Adhaar Verification Details"} icon={icons.back} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 10 }}>
              <Input
                value={inputs.name}
                onChangeText={(text) => handleOnchange(text, "name")}
                onFocus={() => handleError(null, "name")}
                label="Name"
                placeholder="Enter Name"
                error={errors.name}
                isRequired={true}
              />
              <Input
                value={inputs.aadharNumber}
                onChangeText={(text) => handleOnchange(text, "aadharNumber")}
                onFocus={() => handleError(null, "aadharNumber")}
                label="Aadhar Card Number"
                placeholder="Enter Aadhar Card Number"
                error={errors.aadharNumber}
                keyboardType="numeric"
                isRequired={true}
              />
              <Input
                value={inputs.address}
                style={{ textAlignVertical: "top", paddingTop: 10 }}
                onChangeText={(text) => handleOnchange(text, "address")}
                onFocus={() => handleError(null, "address")}
                label="Address"
                multiline
                numberOfLines={5}
                placeholder="Enter Address"
                error={errors.address}
                isRequired={true}
              />
            </View>
          </View>
          <Button
            title={
              loading1 ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Save"
              )
            }
            onPress={validate}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  errorText: {
    marginTop: 7,
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontFamily: "Poppins",
    height: 45,
    borderColor: "gray",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AadharVerification;
