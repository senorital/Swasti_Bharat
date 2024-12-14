import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  BackHandler,ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { COLORS, icons } from "../../../../components/constants";
import CustomAlertModal from "../../../../components/CustomAlert/CustomAlertModal";
import {  getUser } from "../../../../redux/actions/auth/auth";
import {  updateUser, useraddProfilePic } from "../../../../redux/actions/user/authActions";
import * as FileSystem from 'expo-file-system';
import { getAddress, updateAddress } from "../../../../redux/actions/user/addressBook/addressBook";
import { getAddressbyId } from "../../../../redux/actions/user/addressBook/addressBook";

const EditAddress = ({ navigation,route }) => {
const { id } = route.params; 

  const totalSteps = 1;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    mobileNumber: "",
   
  });
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState("Select Date");
  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading1, setLoading1] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [onAlertOk, setOnAlertOk] = useState(() => () => {});
  const [boldText, setBoldText] = useState('');

 
  
 
  

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        // Check if the current screen is focused
        navigation.goBack(); // Go back if the current screen is focused
        return true; // Prevent default behavior (exiting the app)
      }
      return false; // If not focused, allow default behavior (exit the app)
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

 


  const nextStep = () => {
    setCurrentStep((prevStep) =>
      prevStep < totalSteps ? prevStep + 1 : prevStep
    );
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getAddressbyId(id)); // Fetch the address data by ID
  
        if (res && res?.data) {
          // Assuming res.data contains the address information
          setInputs({
            name: res.data.name || "",
            email: res.data.email || "",
            phoneNumber: res.data.phoneNumber || "",
            zipCode: res.data.zipCode || "",
            city: res.data.city || "",
            country: res.data.country || "",
            address: res.data.address || ""
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        const msg = error.response?.data?.message;
        ToastAndroid.show(msg || 'An error occurred. Please try again.', ToastAndroid.SHORT);
      }
    };
  
    fetchData();
  }, [dispatch, id]);  // Make sure id is included in the dependency array
  
  const validate = () => {
    let isValid = true;
  
    if (!inputs.name) {
      handleError("Please input name", "name");
      isValid = false;
    }
  
    if (!image) {
      handleError("Please upload your image", "image");
      isValid = false;
    }
  
    return isValid;
  };
  
  const handleSubmit = async () => {

    try {
      setLoading1(true);
  
      let formData1 = {
        name: inputs.name,
        email: inputs.email,
        phoneNumber: inputs.phoneNumber,
        zipCode: inputs.zipCode,
        city: inputs.city,
        country: inputs.country,
        address: inputs.address,
        latitude: String(0.2), // Convert latitude to string
        longitude: String(2.3), // Convert longitude to string
        id : id
      };
  
  
      // Send the updated address data by ID in the API request
      const res = await dispatch(updateAddress(formData1)); // updateAddressById should be defined in actions
  
      if (res && res?.success) {
        ToastAndroid.show(res?.message, ToastAndroid.SHORT);
        navigation.goBack(); // Go back to the previous screen

      }
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
      const msg = error.response?.data?.message;
      ToastAndroid.show(msg || 'An error occurred. Please try again.', ToastAndroid.SHORT);
    } finally {
      setLoading1(false);
    }
  };
  
  const renderStep1 = () => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
        <View style={{ flex: 1 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "name")}
            label="Save Address as *"
            placeholder="Name"
            value={inputs.name}
            error={errors.name}
            maxLength={50}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "email")}
            label="Email"
            placeholder="Email"
            value={inputs.email}
            error={errors.email}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "phoneNumber")}
            label="Mobile Number"
            placeholder="Mobile Number"
            keyboardType="numeric"
            value={inputs.phoneNumber}
            error={errors.phoneNumber}
            maxLength={10}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "zipCode")}
            label="Zip Code"
            placeholder="Zip Code"
            keyboardType="numeric"
            value={inputs.zipCode}
            error={errors.zipCode}
            maxLength={6}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "city")}
            label="City"
            placeholder="City"
            value={inputs.city}
            error={errors.city}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "country")}
            label="Country"
            placeholder="Country"
            value={inputs.country}
            error={errors.country}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "address")}
            label="Address"
            placeholder="Enter Your Address"
            value={inputs.address}
            multiline
            numberOfLines={5}
          />
        </View>
  
        <Button
          title={loading1 ? <ActivityIndicator size="small" color="#ffffff" style={styles.indicator} /> : "Submit"}
          onPress={handleSubmit}
        />
      </ScrollView>
    );
  };
  
 
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />
      <View style={{ paddingTop: 20 }}>
        <Header
          title={"Edit Address"}
          icon={icons.back}
        />
      </View>
   
      <View style={{ flex: 1}}>
        <View>{renderStep1()}</View>
      </View>
      <CustomAlertModal
        visible={showAlert}
        greeting="Hello ,"
        boldText={boldText}
        message={alertMessage}
        onCancel={() => setShowAlert(false)}
        onOk={onAlertOk}
      />
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
  defaultBorder: {
    borderColor: COLORS.icon_background,
    borderWidth:1,
    borderRadius:10 // Default border color
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth:1,
    borderRadius:10 // Error border color
  },
  multiSelectContainer: {
    marginBottom: 10,
  },
  label: {
    marginVertical: 5,
    color : COLORS.primary,
    fontSize: 14,
    fontFamily: "Poppins_Medium",
  },
  errorText: {
    fontFamily:'Poppins',
    color: "red",
    fontSize: 12,
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
  marginBottom:10,
    paddingHorizontal: 10,
    fontFamily: "Poppins",
    height: 45,
  },
  languageList: {
    flexDirection: "row", // Display items horizontally
    flexWrap: "wrap", // Wrap items to next row when needed
  },
  languageItem: {
    margin: 5, // Add some margin between items
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  cameraContainer: {
    width: wp(40),
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10,
    marginBottom:10,
    backgroundColor: "#fff",
  },
  cameraImage: {
    width: 30,
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  cameraText: {
    fontSize: hp(2),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  progressBar: {
    backgroundColor: "#ccc",
    height: 5,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 5,
  },
  progressBarActive: {
    backgroundColor: "#5F33E1",
  },
  stepContainer: {
    padding: 20,
  },
  autocompleteContainer: {
    zIndex: 1,
    width: "100%",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
  },

  retryText: {
    color: "#00f",
    textDecorationLine: "underline",
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  tab: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 5,
    marginTop:3,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  styleInputGroup: {
    borderWidth: 0, // Remove underline from input group
    borderBottomWidth : 0,
    paddingVertical:10,
   marginLeft:0,
  //  padding:8,
  padding:0,
  minHeight:48,
   paddingHorizontal :0
  },
  styleDropdownMenuSubsection: {
    borderWidth: 0, // Remove underline from dropdown menu subsection
    borderBottomWidth : 0,
    paddingVertical:10,
    paddingHorizontal:0
  },
  styleMainWrapper: {
    
    paddingHorizontal: 10,
    paddingVertical:0,
  },
  tabText: {
    color: '#000',
    fontSize: 13,
    fontFamily:'Poppins'
  },
  removeButton: {
    marginLeft: 5,
    padding: 5,
    marginTop:-5,
    borderRadius: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#000'
  },
  styleDropdownMenu: {
    borderWidth: 0, // Remove underline from dropdown menu
    // paddingVertical:10,

  },
});

export default EditAddress;
