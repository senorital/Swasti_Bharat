import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,Dimensions,BackHandler,Image,  KeyboardAvoidingView,Platform,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/button/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyOtp, login, verfiyOtpByEmail, loginEmail, getUserInstructor} from "../../redux/actions/auth/auth"
import { useSelector } from "react-redux";
// import TermConditions from "../term&conditions/TermConditions";
import RNOtpVerify from 'react-native-otp-verify';  // Import the react-native-otp-verify package
import TabNavigator from "../../roles/instructor/components/navigation/TabNavigator";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RadioButton } from 'react-native-paper'; 
import { COLORS } from "../../components/constants";
import Role from "../roles/Role";
const VerifyOtp = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const address = useSelector((state) => state.location.address);

  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [showTimer, setShowTimer] = useState(true);
  const [otp1, setOtp1] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [error, setError] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const { mobileNumber, email, region } = route.params;

  const [selectedRole, setSelectedRole] = useState(null); // Track selected role
  const bottomSheetModalRef = React.useRef(null);


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

  const handleResend = async () => {
    if (resendAttempts >= 3) {
      ToastAndroid.show("OTP attempts exhausted. Please try again after some time.", ToastAndroid.SHORT);
      return;
    }

    setError(false);
    setResendLoading(true);
    try {
      let res;
      
        res = await dispatch(login({ phoneNumber: mobileNumber }));
     

      if (res && res.success) {
        setResendAttempts(resendAttempts + 1);
        ToastAndroid.show("OTP Resent Successfully!", ToastAndroid.SHORT);
        setRemainingTime(30);
        setShowTimer(true);
        setOtp1({
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
        });
  
        // Optionally focus on the first input field
        inputRefs[0]?.current?.focus();
        console.log("OTP Resent Successfully. Resend Attempts: ", resendAttempts + 1);
      }
    } catch (error) {
      console.error("Error occurred while resending OTP:", error);
      setError(true);
      ToastAndroid.show("Error occurred while resending OTP", ToastAndroid.SHORT);
    } finally {
      setResendLoading(false);
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

      if (otpArray.length === 6 && !loading) {
        handleSubmit(updatedOtp);
      }
    }
  
  };

  const openBottomSheet = () => {
    bottomSheetModalRef.current.present();
  };
  const closeBottomSheet = () => {
    bottomSheetModalRef.current.dismiss();
  };

 
  
   


  useEffect(() => {
    if (showTimer) {
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

      return () => clearInterval(timer);
    }
  }, [showTimer]);

  useEffect(() => {
    setShowTimer(true);
  }, []);




  const handleSubmit = async (otpObject = otp1) => {
    setError(false);
   
    const otp = Object.keys(otpObject)
      .map((key) => otpObject[key])
      .join("");
    console.log("OTP:", otp);

    if (otp.length !== 6) {
      setError(true);
      ToastAndroid.show("Please enter a valid 6-digit OTP.", ToastAndroid.SHORT);
      return;
    }

    if (!loading) {
      setLoading(true);
      try {
        let response;
       
          response = await dispatch(verifyOtp({ phoneNumber: mobileNumber, otp }));
        // } else {
        //   console.log("OTP!@# : "+ otp)
        //   response = await dispatch(verfiyOtpByEmail({ email: email, otp }));
        // }

        if (response && response.success) {
          const { authToken, data } = response;
          console.log("Response Data:", JSON.stringify(data, null, 2)); 

          console.log("data " + JSON.stringify(data.isInstructor))
          // Save auth token and user role in AsyncStorage
          await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
          const userRole = data.isInstructor;
          await AsyncStorage.setItem("userRole", JSON.stringify(userRole));
    
          // Notify the user
          ToastAndroid.show("OTP Verified Successfully!", ToastAndroid.SHORT);
    
          if (userRole === null) {
            navigation.navigate("Role");
          } else {
            // Otherwise, navigate based on user role
            // await AsyncStorage.getItem("userRole");
            const userRoleData = await AsyncStorage.getItem("userRole");

            navigation.navigate("appStack" ,{ role : userRoleData});
          }
          
          setOtp1({
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
        });
  
        // Optionally reset focus to the first input field
        inputRefs[0]?.current?.focus();
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'appStack', params: { role: data.isInstructor ? 'Instructor' : 'User' } }],
        // });
      }
      } catch (error) {
        console.error("Error occurred while verifying OTP:", error);

        let errorMessage = "Verification failed. Please try again.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView contentContainerStyle={{ flex: 1 }}>

    <View style={styles.container}>
      {/* <StatusBar dark backgroundColor="transparent" /> */}
      <View style={{  }}>
      <Image source={require("../../assets/swasti_bharat.png")} style={styles.logo} />
      <View style={styles.centerContent}>
        {/* <Text style={styles.headerText}>Send OTP Code</Text>
        {region === "IN" ? ( */}
          <Text style={styles.subHeaderText}>
            Enter the 6-digit OTP that we have sent via the phone number to +91 &nbsp;
            {mobileNumber}
          </Text>
        {/* ) : ( */}
          {/* <Text style={styles.subHeaderText} numberOfLines={2}
          ellipsizeMode="tail">
            Enter the 6-digit OTP that we have sent via the email to&nbsp;
            {email}
          </Text>
        )} */}
      </View>

      <View style={{ }}>
     
     <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
  {[1, 2, 3, 4, 5, 6].map((index) => (
    <TextInput
      key={index}
      style={[
        styles.underlineStyleBase,
        { borderColor: error ? "red" : otp1[index] ? "blue" : "gray" },
      ]}
      value={otp1[index]} // This binds the value to the state
      keyboardType="number-pad"   // Default keyboard for email OTP entry
      maxLength={1} // Restricting each input to 1 character
      ref={inputRefs[index - 1]} // Assigning the input reference for auto-focusing
      onChangeText={(text) => {
        // Update the corresponding otp1 field
        const updatedOtp = { ...otp1, [index]: text };
        setOtp1(updatedOtp);

        // Auto-focus to the next input field when a value is entered
        if (text && index < 6) {
          inputRefs[index]?.current?.focus();
        }
        if (index === 6 && text) {
          handleSubmit(updatedOtp);
        }
      }}
      onKeyPress={({ nativeEvent }) => {
        // Move focus to previous input when backspace is pressed
        if (nativeEvent.key === "Backspace" && !otp1[index]) {
          if (index > 1) {
            inputRefs[index - 2]?.current?.focus();
          }
        }
      }}
    />
  ))}
</View>

</View>     
      </View>
      <View style={{flex: 2, justifyContent: 'flex-end'}}>
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

        <View style={{ marginVertical: 10}}>
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

    </ScrollView>
    </KeyboardAvoidingView>


  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:50,
    alignItems:'center',
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center", // Center content vertically

  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius:10,
    marginBottom: 20, // Spacing between the logo and text
  },
  textContainer: {
    flexDirection: "column", // Ensures subtext is displayed below the main text
    marginLeft: 10,
  },
  headerText: {
    fontSize: 28,
    fontFamily: "Poppins_Medium",
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: "Poppins",
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
    marginTop:20,
    paddingHorizontal: 20,
    color: "rgba(107, 78, 255, 1)",
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    // paddingHorizontal: 20,
    textAlign: "center",
    marginVertical:11
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
    margin:2,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add the overlay effect
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    padding: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "lightgray",
    borderWidth: 1,
  },
  textContainer: {
    flexDirection: "column", // Ensures subtext is displayed below the main text
    marginLeft: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontFamily:'Poppins',
    marginLeft: 5,
  },
  subText: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: "gray", // Grey subtext
    flexWrap: 'wrap', // Allow the text to wrap into multiple lines
    width: '98%', // Adjust width to fit within the screen (accounting for padding)
    lineHeight: 18, // Optional for better readability
  },
  centerContent: {
    // alignItems: "center", // Center text and inputs horizontally
    // marginVertical:20
  },
  otpInputContainer: {
    marginVertical: 30,
    alignItems: "center", // Center OTP input boxes horizontally
  },
});


export default VerifyOtp;
