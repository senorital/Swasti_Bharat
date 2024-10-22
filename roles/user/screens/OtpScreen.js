import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";

import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Form/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyOtp, login, verifyOtpByEmail, loginByEmail } from "../context/actions/authActions";
import { useSelector } from "react-redux";
import RNOtpVerify from 'react-native-otp-verify';  // Import the react-native-otp-verify package

const OtpScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const address = useSelector((state) => state.location.address);

  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [showTimer, setShowTimer] = useState(true); // Set initial state to true to start the timer immediately
  const [otp1, setOtp1] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [error, setError] = useState(false); // State to handle errors
  const [resendAttempts, setResendAttempts] = useState(0); // State to track resend attempts
  const [resendLoading, setResendLoading] = useState(false); // State to manage resend button loading

  const { mobileNumber, email, region } = route.params;
  // console.log("Address : " + address);
  const otp = Object.keys(otp1)
    .map((key) => otp1[key])
    .join("");

  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const fifthInput = useRef();
  const sixthInput = useRef();

  const inputRefs = [
    firstInput,
    secondInput,
    thirdInput,
    fourthInput,
    fifthInput,
    sixthInput,
  ];

  console.log(mobileNumber);

  const handleSubmit = async () => {
    setError(false); // Reset error state
    if (!loading) {
      setLoading(true);
      try {
        // Verify OTP
        {
          region === "IN"
            ? await dispatch(verifyOtp({ phoneNumber: mobileNumber, otp }))
            : await dispatch(verifyOtpByEmail({ email: email, otp }));
        }

        await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
        // Show toast message
        ToastAndroid.show("OTP Verified Successfully!", ToastAndroid.SHORT);

        // Navigate to TabNavigator
        navigation.navigate("appStack");
      } catch (error) {
        console.error("Error occurred while verifying OTP:", error);
        setError(true); // Set error state
        // Show toast message for error
        ToastAndroid.show(error.response?.data.message, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    if (resendAttempts >= 3) {
      ToastAndroid.show("OTP attempts exhausted. Please try again after some time.", ToastAndroid.SHORT);
      return;
    }

    setError(false); // Reset error state
    setResendLoading(true); // Show loading indicator
    try {
      let res;
      // Verify OTP
      if (region === "IN") {
        res = await dispatch(login({ phoneNumber: mobileNumber }));
      } else {
        res = await dispatch(loginByEmail({ email: email }));
      }
      if (res && res.success) {
        setResendAttempts(resendAttempts + 1); // Increment resend attempts
        ToastAndroid.show("OTP Resent Successfully!", ToastAndroid.SHORT);
        setRemainingTime(30); // Reset the countdown time
        setShowTimer(true);
        console.log("Setting showTimer to true");
      }
    } catch (error) {
      console.error("Error occurred while resending OTP:", error);
      setError(true); // Set error state
      // Show toast message for error
      ToastAndroid.show("Error occurred while resending OTP", ToastAndroid.SHORT);
    } finally {
      setResendLoading(false); // Hide loading indicator
    }
  };

   // OTP Auto-read functionality using react-native-otp-verify (RNOtpVerify)
   useEffect(() => {
    RNOtpVerify.getHash()
      .then(hash => {
        console.log("Hash: ", hash);
      })
      .catch(error => console.error("Error getting hash: ", error));

    RNOtpVerify.getOtp()
      .then(() => RNOtpVerify.addListener(otpHandler))
      .catch(error => console.error("Error starting OTP listener: ", error));

    return () => {
      RNOtpVerify.removeListener();
      console.log("OTP Listener removed");
    };
  }, []);

  const otpHandler = (message) => {
    console.log("Received OTP message: ", message);

    // Adjusted regex to match 6 digits followed by a space or any other character
    const extractedOtp = message.match(/\b\d{6}\b/)?.[0];
    console.log("Extracted OTP: ", extractedOtp);
    console.log("Extracted OTP: ", extractedOtp);

  
    if (extractedOtp) {
      const otpArray = extractedOtp.split('');
      const updatedOtp = {};
  
      otpArray.forEach((digit, index) => {
        updatedOtp[index + 1] = digit;
      });
  
      setOtp1(updatedOtp);
  
      // Automatically move focus to the last input box (6th input)
      if (inputRefs[5]?.current) {
        inputRefs[5].current.focus();
      }
    }
  
  };

  useEffect(() => {
    if (showTimer) {
      // Start the countdown only when showTimer is true
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowTimer(false);
            return 30;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Clear the timer when the component unmounts
      return () => clearInterval(timer);
    }
  }, [showTimer]);

  useEffect(() => {
    // Enable the timer when the component mounts
    setShowTimer(true);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{ marginLeft: 20, paddingTop: 50 }}>
        <Text style={styles.headerText}>Send OTP Code</Text>
        {region === "IN" ? (
          <Text style={styles.subHeaderText}>
            Enter the 6-digit that we have sent via the phone number to&nbsp;
            {mobileNumber}
          </Text>
        ) : (
          <Text style={styles.subHeaderText}>
            Enter the 6-digit that we have sent via the email to&nbsp;
            {email}
          </Text>
        )}
      </View>

      <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <TextInput
              key={index}
              style={[
                styles.underlineStyleBase,
                { borderColor: error ? "red" : otp1[index] ? "blue" : "gray" },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp1[index]}  

              ref={inputRefs[index - 1]}
              onChangeText={(text) => {
                setOtp1({ ...otp1, [index]: text });
                if (text && index < 6) {
                  inputRefs[index].current.focus();
                }
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && otp1[index] === "") {
                  if (index > 1) {
                    inputRefs[index - 2].current.focus();
                  }
                }
              }}
            />
          ))}
        </View>
       
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end", marginVertical: 20 }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
          onPress={handleResend}
          disabled={showTimer || resendAttempts >= 3}
        >
          {resendLoading ? (
            <ActivityIndicator size="small" color="blue" style={styles.indicator} />
          ) : (
            <Text style={[styles.resendText, { color: showTimer || resendAttempts >= 3 ? 'gray' : 'blue' }]}>
              {showTimer ? `Resend Code in ${remainingTime} sec` : 'Resend Code'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ marginBottom: 10, paddingHorizontal: 20 }}>
          <Button
            title={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Continue"
              )
            }
            onPress={handleSubmit}
            disabled={loading}
          />
        </View>
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By signing up or logging in, I accept the app's{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('TermConditions')}>
            <Text style={styles.linkText}>Terms of Services</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}> and </Text>
          <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>.</Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center", 
    paddingHorizontal: 20,


  },
  headerText: {
    fontSize: 28,
    fontFamily: "Poppins_Medium",
  },
  subHeaderText: {
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "400",
    marginTop: 5,
    lineHeight: 24,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 230,
  },
  resendText: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: 16,
    paddingHorizontal: 20,
    color: "rgba(107, 78, 255, 1)",
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    textAlign: "center",
  },
  termsText: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: 14,
  },
  linkText: {
    color: "rgba(107, 78, 255, 1)",
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: 14,
  },
  otpInput: {
    width: "100%",
    height: 100,
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 0.5,
    borderColor: "gray",
    color: "#000",
    fontSize: 20,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginLeft: 2,
    marginRight: 2,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
});

export default OtpScreen;
