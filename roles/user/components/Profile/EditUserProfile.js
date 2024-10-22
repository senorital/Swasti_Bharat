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
  BackHandler,ToastAndroid,Alert
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
import { useFocusEffect } from '@react-navigation/native';


const EditUserProfile = ({ navigation }) => {
  const totalSteps = 1;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log("User NAme123 :" + user.name)
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






  // console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getUser()); // Fetch the user data
  
        console.log("User Response:", res);
  
        // Check if the response contains the expected structure
        if (res && res.data && res.data.profilePic) {
          const imageUri = res.data.profilePic.path; // Access profile picture path
          if (imageUri) {
            setImage(imageUri); // Set the profile picture
            console.log("Profile image set:", imageUri);
          }
        } else {
          console.log("Profile picture not found in response.");
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        const msg = error.response?.data?.message;
        ToastAndroid.show(msg || 'An error occurred. Please try again.', ToastAndroid.SHORT);
      }
    };
  
    fetchData();
  }, [dispatch]);
  

  useEffect(() => {
    if (user) {
      setInputs({
        name: user.name || "",
        email: user.email || "",
        mobileNumber: user.phoneNumber || "",
      
      });

    }
  }, [user]);
  const validate = async () => {
    let isValid = true;

    if (!inputs.name) {
      handleError("Please input name", "name");
      isValid = false;
    }
   
    if (!image) {
      handleError("Please upload your image", "image");
      isValid = false;
    }

    if (isValid) {
      nextStep();
    } else {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!inputs.name) {
      handleError("Please input name", "name");
      isValid = false;
    }

    // if (!image) {
    //   handleError("Please upload your image", "image");
    //   isValid = false;
    // }
    try {
        setLoading1(true);
        // console.log("etwefwef" +  String(inputs.location.longitude));
        let formData1 = {
       
          name: inputs.name,
       
        };
      
      
      
        console.log("FormData object as JSON:", formData1);
      
        // Send the formData object as JSON in the API request
        const res = await dispatch(updateUser(formData1))
        console.log(res);
        if (res && res.success) {

            ToastAndroid.show(res.message, ToastAndroid.SHORT);
           console.log("Response :" + res)
          navigation.goBack();    
          }      
        } catch (error) {
          console.error("Error occurred while updating profile:", error);
          const msg = error.response?.data?.message;
          ToastAndroid.show(msg || 'An error occurred. Please try again.', ToastAndroid.SHORT);
        } finally {
          setLoading1(false);
        }

  };


  const addProfilePics = async (imageUri) => {
    try {
      console.log("addProfilePics function called");
  
      if (!imageUri) {
        console.log("No image URI provided");
        throw new Error("No image URI provided");
      }
  
      console.log("Image URI is valid, imageUri: " + imageUri);
  
      const formData = new FormData();
      
      formData.append("StudentProfile", {
        uri: imageUri,
        name: `image.jpg`,
        type: "image/jpeg",
      });
  
      console.log("FormData object created:", formData);
  
      // Dispatch the action to upload the profile picture
      const res = await dispatch(useraddProfilePic(formData));
  
      // console.log("Response from dispatch:", res);
  
      if (res.error) {
        console.log("Error uploading profile image:", res.error);
        console.error("Response details:", res);
      } else {
        console.log("Profile image uploaded successfully:", res);
      }
    } catch (error) {
      console.error("Error in addProfilePics:", error.message);
    }
  };
  
  // const pickImage = async () => {
  //   try {
  //     console.log("pickImage function called");
  
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });
  
  //     console.log("Result from ImagePicker:", result);
  
  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       const imageUri = result.assets[0].uri;
  //       console.log("Image selected, URI:", imageUri);
  
  //       // Get image file info including size
  //       const imageInfo = await FileSystem.getInfoAsync(imageUri);
  //       const imageSizeInBytes = imageInfo.size;
  //       const imageSizeInKB = (imageSizeInBytes / 1024).toFixed(2); // Convert to KB
  //       const imageSizeInMB = (imageSizeInBytes / (1024 * 1024)).toFixed(2); // Convert to MB
  
  //       console.log(`Image Size: ${imageSizeInBytes} bytes (${imageSizeInKB} KB, ${imageSizeInMB} MB)`);
  
  //       // Ensure setImage and setErrors are called before addProfilePics
  //       setImage(imageUri);
  //       setErrors(false);
  //       console.log("setImage and setErrors called with imageUri:", imageUri);
  
  //       // Call addProfilePics with imageUri
  //       await addProfilePics(imageUri);
  //       console.log("addProfilePics function called with imageUri:", imageUri);
  //     } else {
  //       console.log("Image selection was canceled or no assets found");
  //       setErrors(true);
  //     }
  //   } catch (error) {
  //     console.error("Error in pickImage:", error.message);
  //   }
  // };

  const pickImage = async () => {
    try {
      console.log("pickImage function called");
  
      // Request permission to access the media library
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibraryPermission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need permission to access your media library to proceed.",
          [{ text: "OK" }]
        );
        return;
      }
  
      // Request permission to access the camera
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need permission to access your camera to proceed.",
          [{ text: "OK" }]
        );
        return;
      }
  
      // Launch the image picker to select an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // You can change this to include videos if needed
        aspect: [4, 3], // Adjust aspect ratio to your preference
        quality: 1, // Image quality (0 to 1)
      });
  
      console.log("Result from ImagePicker:", result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log("Image selected, URI:", imageUri);
  
        // Get image file info including size
        const imageInfo = await FileSystem.getInfoAsync(imageUri);
        const imageSizeInBytes = imageInfo.size;
        const imageSizeInKB = (imageSizeInBytes / 1024).toFixed(2); // Convert to KB
        const imageSizeInMB = (imageSizeInBytes / (1024 * 1024)).toFixed(2); // Convert to MB
  
        console.log(
          `Image Size: ${imageSizeInBytes} bytes (${imageSizeInKB} KB, ${imageSizeInMB} MB)`
        );
  
        // Ensure setImage and setErrors are called before addProfilePics
        setImage(imageUri);
        setErrors(false);
        console.log("setImage and setErrors called with imageUri:", imageUri);
  
        // Call addProfilePics with imageUri
        await addProfilePics(imageUri);
        console.log("addProfilePics function called with imageUri:", imageUri);
      } else {
        console.log("Image selection was canceled or no assets found");
        setErrors(true);
      }
    } catch (error) {
      console.error("Error in pickImage:", error.message);
    }
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
     
      default:
        return null;
    }
  };
  const renderStep1 = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
      >
        <View style={{ flex: 1 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "name")}
            onFocus={() => handleError(null, "name")}
            label="Name"
            placeholder="Name"
            value={inputs.name}
            error={errors.name}
            isRequired={true}
          />
          <Input
            label="Email"
            placeholder="Email"
            value={inputs.email}
            isRequired={true}
            editable={false} // Set editable to false to make it read-only

          />
          <Input
            label="Mobile Number"
            placeholder="Mobile Number"
            value={inputs.mobileNumber}
            isRequired={true}
            editable={false} // Set editable to false to make it read-only

          />

        
     
    
          <Text style={styles.label}>
            Upload Image <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={[styles.cameraContainer,  errors.image ? styles.errorBorder : styles.defaultBorder,]}>
            {image ? (
              <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
                <Image
                  source={{ uri: image }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
                <View style={styles.cameraButton}>
                  <Image
                    style={styles.cameraImage}
                    source={require("../../../../assets/camera.png")}
                  />
                  <Text style={styles.cameraText}>Add Photo</Text>
                </View>
              </TouchableOpacity>
            )}
            
          </View>
          {/* {errors.image && (
        <Text style={styles.errorText}>Please select a photo</Text>
      )} */}
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
              "Submit"
            )
          }
          onPress={handleSubmit}
        />
      
      </ScrollView>
    );
  };
 
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header
          title={"Edit Profile"}
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

export default EditUserProfile;
