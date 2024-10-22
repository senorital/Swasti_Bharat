// src/screens/LoginScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import FormInput from '../components/Form/FormInput';
import TextInputs from '../components/Form/TextInputs';
import { login, loginByEmail } from '../context/actions/authActions';
import { useDispatch } from "react-redux";
import Button from '../components/Form/Button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Location from 'expo-location';
import { setLocationAddress,clearLocationAddress } from '../context/actions/locationActions/locationActions';
import DenyLocation from './DenyLocation';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [region, setRegion] = useState("");
  const [inputs, setInputs] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    dispatch(clearLocationAddress());

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);
      if (status !== 'granted') {
        setErrorMsg("Permission to access location was denied.");
        setLoading(false);
        navigation.navigate('DenyLocation');
        return;
      }
  
  
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      console.log("Location services enabled:", isLocationEnabled);

      if (!isLocationEnabled) {
        setErrorMsg("Permission to access location was denied or location services are disabled");
        setLoading(false);
        navigation.navigate('DenyLocation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("Location:", location);
      setLocation(location);

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("Geocode:", geocode);
      dispatch(setLocationAddress(geocode[0]));

      setRegion(geocode[0].isoCountryCode);
    } catch (error) {
      console.log("Error:", error.message);

      if (error.message === "Location request failed due to unsatisfied device settings") {
        setErrorMsg("Location request failed due to unsatisfied device settings");
        navigation.navigate(DenyLocation);
      } else {
        setErrorMsg("Error fetching location");
        // navigation.navigate(DenyLocation);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  useEffect(() => {
    if (region === "US") {
      setShowEmail(true);
    } else if (region === "IN") {
      setShowEmail(false);
    }
  }, [region]);



  const handleSubmit = async () => {
    let isValid = true;

    if (!mobileNumber) {
      setMobileNumberError("Please enter your mobile number");
      isValid = false;
    } else if (mobileNumber.length !== 10) {
      setMobileNumberError("Mobile number should have 10 digits");
      isValid = false;
    } else {
      setMobileNumberError("");
    }

    if (isValid && !loading) {
      setLoading(true);
      const formData = { phoneNumber: mobileNumber };

      try {
        const res = await dispatch(login(formData));
        console.log("res", res);
        if (res && res.success) {
          navigation.navigate("OtpScreen", { mobileNumber: mobileNumber, region: region });
        } else if (res && res.success === false && res.message === "NOTPRESENT!") {
          navigation.navigate("RegisterScreen", { phoneNumber: mobileNumber, region: region });
        } else if (res && res.error && res.error.data && res.error.data.message) {
          handleError(res.error.data.message, "mobileNumber");
        } else {
          console.error(res);
          handleError("Unknown error occurred", "mobileNumber");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.message || "NOTPRESENT!";
          navigation.navigate("RegisterScreen", { phoneNumber: mobileNumber, region: region });
          handleError(message, "mobileNumber");
        } else {
          console.error("Error occurred while submitting mobile number:", error);
          handleError("Error occurred while submitting mobile number", "mobileNumber");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmailSubmit = async () => {
    let isValid = true;

    if (!inputs.email) {
      handleError("Please input email", "email");
      isValid = false;
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(inputs.email)) {
        handleError("Please enter a valid email", "email");
        isValid = false;
      }
    }

    if (isValid && !loading) {
      setLoading(true);
      const formData = { email: inputs.email };

      try {
        const res = await dispatch(loginByEmail(formData));
        if (res && res.success) {
          navigation.navigate("OtpScreen", { email: inputs.email, region: region });
        } else if (res && res.success === false && res.message === "NOTPRESENT!") {
          navigation.navigate("RegisterScreen", { email: inputs.email, region: region });
          handleError(res.message, "email");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.message || "NOTPRESENT!";
          navigation.navigate("RegisterScreen", { email: inputs.email, region: region });
          handleError(message, "email");
        } else {
          console.error("Error occurred while submitting email:", error);
          handleError("Error occurred while submitting email", "email");
        }
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <View style={styles.container}>
     
      <View style={styles.content}>
        <StatusBar style="dark" backgroundColor="#fff" />
        <Text style={styles.text}>Welcome back.</Text>
        <Text style={styles.smalltext}>Log in to your account</Text>
        {region === "IN" && (
              <>
        <FormInput
          labelValue={mobileNumber}
          placeholderText="Mobile Number"
          iconType="user"
          keyboardType="numeric"
          inputMode="numeric"
          onChangeText={(text) => setMobileNumber(text)}
        />
        {mobileNumberError ? (
                  <Text style={{ color: "red" }}>{mobileNumberError}</Text>
                ) : null}
              </>
            )}
            {region === "US" && (
              <>
               <TextInputs
                  label="Email"
                  placeholder="Enter your email"
                  onChangeText={(text) => handleOnchange(text, "email")}
                  onFocus={() => handleError(null, "email")}
                  error={errors.email}
                  containerStyle={styles.inputContainer}
                />
               </>
             )}
        <Text style={styles.vsmalltext}>
          You will receive an SMS verification that may apply message and data rates.
        </Text>
      </View>
      {region === "IN" && (
           
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
         )}
         {region === "US" && (
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
            onPress={handleEmailSubmit}
            disabled={loading}
          />
        
         )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    width: wp(85),
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
   paddingVertical:60
  },
  appButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    marginBottom: 2,
    color: '#000',
  },
  smalltext: {
    fontFamily: 'Poppins-Light',
    fontSize: 15,
    marginBottom: 10,
    color: '#000',
  },
  vsmalltext: {
    fontFamily: 'Poppins-Light',
    fontSize: 13,
    marginBottom: 10,
    marginTop: 10,
    color: '#6C7072',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginVertical: 5,
  },
  appButton: {
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  appButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});

export default LoginScreen;
