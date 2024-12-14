import React, { useState, useEffect ,useRef} from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PhoneInput from "react-native-phone-number-input"; 
import { useDispatch } from "react-redux";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { register, registerEmail } from "../../redux/actions/auth/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules, Alert } from 'react-native';

const Register = ({ navigation,route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const { phoneNumber , email , region} = route.params;
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [address, setAddress] = useState(null);
  const { InstallReferrerModule } = NativeModules;

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [showEmail, setShowEmail] = useState(false);
  
  const [referralCode, setReferralCode] = useState(null);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };


  const fetchAndStoreReferralCode = async () => {
    try {
      // Call the native method to get the referral code
      InstallReferrerModule.getInstallReferrerCode((referralCode) => {
        if (referralCode) {
          setReferralCode(referralCode);
          // Show the referral code in an alert first
          // Alert.alert('Referral Code', `Your referral code is: ${referralCode}`);
          
        
        } else {
          console.log('No referral code received');
        }
      });
    } catch (error) {
      console.error('Error fetching referral code:', error);
    }
  };

  useEffect(() => {
    fetchAndStoreReferralCode();
  }, []);

  const handleSubmit = async () => {
    let isValid = true;
  
    if (region === "IN") {
    
    }
  
    if (!inputs.name.trim()) {
      handleError("Please enter your name", "name");
      isValid = false;
    } else {
      handleError(null, "name");
    }
  
    if (!inputs.email.trim()) {
      handleError("Please enter your email", "email");
      isValid = false;
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(inputs.email)) {
        handleError("Please enter a valid email", "email");
        isValid = false;
      } else {
        handleError(null, "email");
      }
    }
  
    if (isValid && !loading) {
      setLoading(true);

  
      const formData = {
        name: inputs.name.trim(),
        email: inputs.email.trim(),
        phoneNumber: phoneNumber, // Assuming phoneNumber is already validated
        referralCode: referralCode ? referralCode.trim() : '',  
      };
      console.log("Form Data being sent:", JSON.stringify(formData, null, 2));

  
      try {
        const res = await dispatch(register(formData));
        if (res && res.success) {
          navigation.navigate("Otp", { mobileNumber: phoneNumber, region : region });
        }   
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.data.message;  

          if (message === "This credentials already exist!!") {
          
              handleError("Email ID already exists", "email");
           
          } else {
            console.error("Error occurred while registering user:", error);
          }
        } else {
          console.error("Error occurred while submitting mobile number:", error);
          handleError("Error occurred while submitting mobile number", "mobileNumber");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  

  // const handleEmailSubmit = async () => {
  //   let isValid = true;
  
  //   if (!mobileNumber) {
  //     setMobileNumberError("Please enter your mobile number");
  //     isValid = false;
  //   } else if (mobileNumber.length !== 10) {
  //     setMobileNumberError("Mobile number should have 10 digits");
  //     isValid = false;
  //   } 
  
  //   if (isValid && !loading) {
  //     setLoading(true);
  
  //     const formData = {
  //       email: email,
  //       name: inputs.name.trim(),
  //       phoneNumber: mobileNumber.trim(),
  //       referralCode: referralCode ? referralCode.trim() : '',  

  //     };
  
  //     try {
  //       const res = await dispatch(registerEmail(formData));
  //       if (res && res.success) {
  //         navigation.navigate("Otp", { email: email, region: region });
  //       } else if (res && res.success === false && res.message === "NOTPRESENT!") {
  //         navigation.navigate("Register", { email: email });
  //         handleError(res.message, "email");
  //       }
  //     } catch (error) {
  //       // Using `error.response` to check if there's a 400 status code error
  //       if (error.response && error.response.status === 400) {
  //         const message = error.response.data.message;  // Use `error.response.data.message` to get the message from the response
  //         console.log(message); // Log the error message
  
  //         if (message === "This credentials already exist!") {
  //           setMobileNumberError("Mobile No. already exists");
  //           isValid = false;
  //         }
  //       } else {
  //         console.error("Error occurred while registering user:", error);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };
  
  // const handleEmailSubmit = async () => {
  //   console.log("Submit Register");
  //   let isValid = true;
  
  //   if (!mobileNumber) {
  //     setMobileNumberError("Please enter your mobile number");
  //     isValid = false;
  //   } else if (mobileNumber.length !== 10) {
  //     setMobileNumberError("Mobile number should have 10 digits");
  //     isValid = false;
  //   } else {
  //     setMobileNumberError("");
  //   }
  
  
  //   if (isValid && !loading) {
  //     setLoading(true);
  //     const formData = {
  //       email: email,
  //       name : inputs.name.trim(),
  //       phoneNumber : mobileNumber.trim(),
      

  //     };
  //     try {
  //       const res = await dispatch(registerEmail(formData));
  //       if (res && res.success) {
  //         navigation.navigate("Otp", { email: email ,region : region});
  //       } else if (res && res.success === false && res.message === "NOTPRESENT!") {
  //         navigation.navigate("Register", { email: email });
  //         handleError(res.message, "email");
  //       }  
         
  //     }  catch (error) {
  //       if (res && res.success === false && res.status === 400) {
  //         console.log("message.......");
  //         const message = res.message;
  //         console.log(message);
  //         if (message === "This credentials already exist!!") {
          
  //                 //  setMobileNumberError("Please enter your mobile number");
  //           setMobileNumberError("Mobile already exists");
  //           isValid = false;
  //         }
  //         }
        
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };


//   let referralCode = null;
//   try {
// const userData = await AsyncStorage.getItem("referralCode");
// if (userData) {

//   referralCode = userData || null;
// }
// } catch (error) {
// console.error("Error retrieving referral code:", error);
// }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: 20,
          paddingTop: 50,
        }}
      >
        <View style={{ flex: 1 }}>
          <View>
            <Text
              style={{
                fontSize: hp(4),
                fontFamily: "Poppins_Medium",
              }}
            >
              Welcome
            </Text>
            <Text
              style={{
                fontSize: hp(2.2),
                fontFamily: "Poppins",
                color: "gray",
                fontWeight: "400",
              }}
            >
              Register your account
            </Text>
          </View>
          <View style={{ marginVertical: 20 }}>
              {/* {region === "IN" && ( */}
                <>
                  <Input
                onChangeText={(text) => handleOnchange(text, "name")}
                onFocus={() => handleError(null, "name")}
                label="Name"
                placeholder="Name"
                error={errors.name}
                  />
                  <Input
                    onChangeText={(text) => handleOnchange(text, "email")}
                    onFocus={() => handleError(null, "email")}
                    label="Email"
                    placeholder="Email"
                    error={errors.email}
                  />
                
                  
                </>
                
              
          
              {/* <>
                 <Input
              onChangeText={(text) => handleOnchange(text, "name")}
              onFocus={() => handleError(null, "name")}
              label="Name"
              placeholder="Name"
              error={errors.name}
                />
                  <Text style={styles.label}>Mobile Number</Text>
                <PhoneInput
                  defaultCode="US"
                  layout="first"
                  containerStyle={styles.inputContainer}
                  textContainerStyle={{
                    paddingVertical: 0,
                    backgroundColor: "#fff",
                    color: "gray",
                  }}
                  keyboardType="number-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
                {mobileNumberError ? (
                <Text style={{ color: "red" }}>{mobileNumberError}</Text>
                
                ) : null}
              </> */}
              
           
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                // marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "400",
                  fontSize: 12,
                }}
              >
                You will receive an SMS verification that may apply on the next
                step.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Button
            title={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : "Register"
            }
            onPress={ handleSubmit }
            disabled={loading}
          />
        </View>
      </ScrollView>
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: hp(2),
    fontFamily: "Poppins",
  },
  codeTextStyle: {
    color: "gray",
    fontSize: hp(2),
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    fontFamily: "Poppins",
    height: 48,
    alignItems: "center",
    paddingHorizontal: 10,
    width: wp(88),
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
    fontFamily:'Poppins-Medium',
    color: "gray", // Grey subtext
  },
});

export default Register;







