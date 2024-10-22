import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import Button from "../components/Form/Button";
import FormInput from "../components/Form/FormInput";
import { register, registerByEmail } from "../context/actions/authActions";
import Input from "../components/Form/TextInputs";
const RegisterScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { phoneNumber, email, region } = route.params;
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

 
  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (region === "IN") {
      // If validation needed for mobile number
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
        phoneNumber: phoneNumber,
        isInstructor : 'false'
      };

      try {
        const res = await dispatch(register(formData));
        if (res && res.success) {
          navigation.navigate("OtpScreen", { mobileNumber: phoneNumber, region });
        } else {
          setErrors((prevState) => ({
            ...prevState,
            mobileNumber: res.error || "Unknown error occurred",
          }));
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.message;
          handleError(message);
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
      const formData = {
        email,
        name: inputs.name.trim(),
        phoneNumber: mobileNumber.trim(),
        isInstructor : 'false'
      };

      try {
        const res = await dispatch(registerByEmail(formData));
        if (res && res.success) {
          navigation.navigate("OtpScreen", { email, region });
        } else if (res && res.success === false && res.message === "NOTPRESENT!") {
          navigation.navigate("Register", { email });
          handleError(res.message, "email");
        }
      } catch (error) {
        console.error("Error occurred while registering user:", error);
        setErrors((prevState) => ({
          ...prevState,
          email: "Error occurred while registering user",
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <StatusBar style="dark" backgroundColor="#fff" />
        <Text style={styles.text}>Welcome</Text>
        <Text style={styles.smalltext}>Register your account</Text>
        <View style={{ marginVertical: 10 }}>
        {region === "IN" && (
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
                
              )}
          {region === "US" && (
            <>
             <Input
              onChangeText={(text) => handleOnchange(text, "name")}
              onFocus={() => handleError(null, "name")}
              label="Name"
              placeholder="Name"
              error={errors.name}
                />
              <Text style={styles.label}>Mobile Number</Text>
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
        </View>
        <Text style={styles.vsmalltext}>
          You will receive an SMS verification that may apply on the next step.
        </Text>
      </ScrollView>
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
        onPress={region === "IN" ? handleSubmit : handleEmailSubmit}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E3E5E5',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#333',
    marginTop: 2,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
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
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  indicator: {
    marginLeft: 8,
  },
});

export default RegisterScreen;
