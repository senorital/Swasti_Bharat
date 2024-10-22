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
import MultiSelect from "react-native-multiple-select";
import { Ionicons } from "@expo/vector-icons";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import MapView, { Marker } from "react-native-maps";
// import { GOOGLE_MAPS_APIKEY } from "../../apiKey/index";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
// import AddCustomData from "../addCustomdata/AddCustomData";
import * as Location from "expo-location";
import { getInstructor, updateInstructor,addProfilePic } from "../../redux/actions/auth/auth";
import { COLORS, icons } from "../../components/constants";
import CustomAlertModal from "../../components/CustomAlert/CustomAlertModal";
import * as FileSystem from 'expo-file-system';

const defaultLocation = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const EditProfile = ({ navigation }) => {
  const totalSteps = 2;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    facebook: "",
    twitter_x: "",
    linkedIn: "",
    instagram: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState("Select Date");
  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState(defaultLocation);
  const [name, setName] = useState("");
  // const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [dateError, setDateError] = useState("");
  const [imageError, setImageError] = useState("");
  const [languagesError, setLanguagesError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [onAlertOk, setOnAlertOk] = useState(() => () => {});
  const [boldText, setBoldText] = useState('');

  const items = [
    { id: 'English', name: 'English' },
    { id: 'Spanish', name: 'Spanish' },
    { id: 'French', name: 'French' },
    { id: 'German', name: 'German' },
    { id: 'Hindi', name: 'Hindi' },
    { id: 'Bengali', name: 'Bengali' },
    { id: 'Telugu', name: 'Telugu' },
    { id: 'Marathi', name: 'Marathi' },
    { id: 'Tamil', name: 'Tamil' },
    { id: 'Urdu', name: 'Urdu' },
    { id: 'Gujarati', name: 'Gujarati' },
    { id: 'Malayalam', name: 'Malayalam' },
    { id: 'Kannada', name: 'Kannada' },
    { id: 'Odia', name: 'Odia' },
    { id: 'Punjabi', name: 'Punjabi' },
    { id: 'Assamese', name: 'Assamese' },
    { id: 'Maithili', name: 'Maithili' },
    { id: 'Sanskrit', name: 'Sanskrit' },
    { id: 'Konkani', name: 'Konkani' },
    { id: 'Nepali', name: 'Nepali' },
    { id: 'Manipuri', name: 'Manipuri' },
    { id: 'Sindhi', name: 'Sindhi' },
    { id: 'Dogri', name: 'Dogri' },
    { id: 'Kashmiri', name: 'Kashmiri' },
    { id: 'Bodo', name: 'Bodo' },
  ];
  
  const addProfilePics = async (imageUri) => {
    try {
      console.log("addProfilePics function called");
  
      if (!imageUri) {
        console.log("No image URI provided");
        throw new Error("No image URI provided");
      }
  
      console.log("Image URI is valid, imageUri: " + imageUri);
  
      const formData = new FormData();
      
      formData.append("profileImage", {
        uri: imageUri,
        name: `image.jpg`,
        type: "image/jpeg",
      });
  
      console.log("FormData object created:", formData);
  
      // Dispatch the action to upload the profile picture
      const res = await dispatch(addProfilePic(formData));
  
      console.log("Response from dispatch:", res);
  
      if (res.error) {
        console.log("Error uploading profile image:", res.error);
        console.error("Response details:", res);
      } else {
        console.log("Profile image uploaded successfully:", res);
      }
    } catch (error) {
      // console.error("Error in addProfilePics:", error.message);
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

  const requestPermissions = async () => {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
    if (!mediaPermission.granted || !cameraPermission.granted) {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and media library permissions to upload a profile picture.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };
  
  // Function to pick an image or take a photo
  const pickImage = async () => {
    try {
      console.log("pickImage function called");
  
      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
      }
  
      // Prompt user for image selection option
      Alert.alert(
        "Upload Profile Picture",
        "Choose an option to upload an image",
        [
          {
            text: "Take Photo",
            onPress: async () => {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
              });
  
              if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                await handleImageSelection(imageUri);
              } else {
                console.log("Camera selection was canceled or no assets found");
              }
            },
          },
          {
            text: "Choose from Library",
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
              });
  
              if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                await handleImageSelection(imageUri);
              } else {
                console.log("Image selection was canceled or no assets found");
              }
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } catch (error) {
      console.error("Error in pickImage:", error.message);
    }
  };
  
  // Helper function to handle image selection and upload
  const handleImageSelection = async (imageUri) => {
    try {
      console.log("Image selected, URI:", imageUri);
  
      // Get image file info including size
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      const imageSizeInBytes = imageInfo.size;
      const imageSizeInKB = (imageSizeInBytes / 1024).toFixed(2); // Convert to KB
      const imageSizeInMB = (imageSizeInBytes / (1024 * 1024)).toFixed(2); // Convert to MB
  
      console.log(`Image Size: ${imageSizeInBytes} bytes (${imageSizeInKB} KB, ${imageSizeInMB} MB)`);
  
      setImage(imageUri);
      setErrors(false);
  
      // Call addProfilePics with imageUri
      await addProfilePics(imageUri);
      console.log("Profile picture uploaded successfully.");
    } catch (error) {
      console.error("Error handling image selection:", error.message);
    }
  };

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

  // const handleLocationSelect = (data, details) => {
  //   // const locationName=details?.formatted_address;
  //   // console.log(details.formatted_address);
  //   const { lat, lng } = details.geometry.location;
  //   setLocation({
  //     latitude: parseFloat(lat.toFixed(7)),
  //     longitude: parseFloat(lng.toFixed(7)),
  //     latitudeDelta: 0.05,
  //     longitudeDelta: 0.05,
  //   });
  //   setName(details.formatted_address);
  // };

  // useEffect(() => {
  //   // Enable submit button only if radius, name, latitude, and longitude are set and not default
  //   if (
  //     name &&
  //     location.latitude !== defaultLocation.latitude &&
  //     location.longitude !== defaultLocation.longitude
  //   ) {
  //     setIsSubmitDisabled(false);
  //   } else {
  //     setIsSubmitDisabled(true);
  //   }
  // }, [ name, location]);
  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    setAddress(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: parseFloat(location.coords.latitude.toFixed(7)),
        longitude:parseFloat(location.coords.longitude.toFixed(7)),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setAddress(geocode[0].formattedAddress);
    } catch (error) {
      setErrorMsg("Error fetching location");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

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


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    if (!date) {
      // If no date is selected, set an error message for the date field
      handleError("Please select a valid date", "date");
      return; // Exit the function without setting the date state
    }
    const dt = new Date(date);
    const x = dt.toISOString().split("T");
    const x1 = x[0].split("-");
    console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
    setDate(x1[1] + "/" + x1[2] + "/" + x1[0]);
    handleError(null, "date");
    hideDatePicker();
  };

  // console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const res =   await dispatch(getInstructor());
      // Ensure `res.data.instructor.languages` is a string and parse it
      // console.log('Raw response:', res); // Debugging line
      const languagesString = res.data.data?.languages;
      // console.log("res.profilePic.path :" + res.profilePic.path)
        if (user.data.profilePic.path) {
          const imageUri = user.data.profilePic.path; // Access profile picture path
          if (imageUri) {
            setImage(imageUri); // Set the profile picture
            console.log("Profile image set:", imageUri);
          }
        } else {
          console.log("Profile picture not found in response.");
        }
      if (languagesString && typeof languagesString === 'string') {
        const parsedLanguages = JSON.parse(languagesString);
        console.log('Parsed languages:', parsedLanguages);

        // Check if parsedLanguages is an array
        if (Array.isArray(parsedLanguages)) {
          setLanguages(parsedLanguages);

          const selectedIds = items
            .filter(item => parsedLanguages.map(lang => lang.trim()).includes(item.name.trim()))
            .map(item => item.id);

          console.log('Selected IDs:', selectedIds);
          setSelectedLanguage(selectedIds);
        } else {
          setLanguages([]);
          setSelectedLanguage([]);
        }
  
    } else {
      setLanguages([]);
      setSelectedLanguage([]);
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
    if (user && user.data) {
      setInputs({
        name: user.data.name || "",
        email: user.data.email || "",
        mobileNumber: user.data.phoneNumber || "",
        bio: user.data.bio || "",
        facebook: user.data.facebook || "",
        twitter_x: user.data.twitter_x || "",
        linkedIn: user.data.linkedIn || "",
        instagram: user.data.instagram || "",
      });
      setDate(user.data.dateOfBirth || "");
      // setLanguages(user.instructor.languages || "");

    }
  }, [user]);
  const validate = async () => {
    let isValid = true;

    if (!inputs.name) {
      handleError("Please input name", "name");
      isValid = false;
    }
    if (date === "Select Date") {
      handleError("Please select your date of birth", "date");
      isValid = false;
    }
    if (!inputs.bio) {
      handleError("Please input bio", "bio");
      isValid = false;
    }
    if (selectedLanguage.length === 0) {
      handleError("Please select your languages", "languages");
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
    if (!date || date === "Please select DOB") {
      handleError("Please select your date of birth", "date");
      isValid = false;
    }
    if (!inputs.bio) {
      handleError("Please input bio", "bio");
      isValid = false;
    }
    if (selectedLanguage.length < 2) { 
      handleError("Please select at least 2 languages", "languages");
      isValid = false;
    }
    // if (!image) {
    //   handleError("Please upload your image", "image");
    //   isValid = false;
    // }

    if (!isValid) {
      return;
    }

    try {
      setLoading1(true);
      // console.log("etwefwef" +  String(inputs.location.longitude));
      let formData = {
        dateOfBirth: date,
        // location: address,
        name: inputs.name,
        bio: inputs.bio,
        // longitude: String(location.longitude),
        // latitude: String(location.latitude),
        languages: selectedLanguage, // Assuming selectedLanguage is an array
      };
    
      // Conditionally add social media links
      if (inputs.facebook) {
        formData.facebook = inputs.facebook;
      }
      if (inputs.instagram) {
        formData.instagram = inputs.instagram;
      }
      if (inputs.linkedIn) {
        formData.linkedIn = inputs.linkedIn;
      }
      if (inputs.twitter_x) {
        formData.twitter_x = inputs.twitter_x;
      }
    
      console.log("FormData object as JSON:", formData);
    
      // Send the formData object as JSON in the API request
      const res = await dispatch(updateInstructor(formData))
      console.log(res);

      if (res && res.success) {

        ToastAndroid.show(res.message, ToastAndroid.SHORT);


        const profileRes = await dispatch(getInstructor());
  
        // Extract the required data from the response
        const profileData = profileRes.data.data;
        const profileComplete = profileRes.data.profileComplete; // Adjusted to reflect nested structure
        const qualifications = profileData.qualifications;
        const userName = profileData.name;
      
        console.log('profileComplete : ' + profileComplete);
        console.log('qualifications : ' + qualifications);
        console.log('userName : ' + userName);
      
        // Check if profile is marked as complete
        if (profileComplete > 20) { // Assuming profileComplete is a percentage (adjust the threshold if needed)
          const hasQualificationIn = (type) => {
            return qualifications.some((q) => q.qualificationIn === type);
          };
      
          // Check if HomeTutor qualification exists
          if (hasQualificationIn("HomeTutor")) {
            navigation.navigate("ProfileOverview");
          } else {
            console.log(12);
            setBoldText(userName);
            setShowAlert(true);
            setAlertMessage("Please complete your HomeTutor qualification.");
            setOnAlertOk(() => () => {
              setShowAlert(false);
              navigation.navigate("AddQualification");
            });
          }
          console.log(13);
        } else {
          // Handle case where profile is not complete (based on your logic)
          setShowAlert(true);
          setAlertMessage("Your profile is incomplete. Please update your profile.");
        }
      }      
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
      const msg = error.response?.data?.message;
      ToastAndroid.show(msg || 'An error occurred. Please try again.', ToastAndroid.SHORT);
    } finally {
      setLoading1(false);
    }
  };


 

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return null;
    }
  };
  console.log(address);
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
          />
          <Input
            label="Mobile Number"
            placeholder="Mobile Number"
            value={inputs.mobileNumber}
            isRequired={true}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "facebook")}
            label="Facebook Link"
            placeholder="Facebook Link"
            value={inputs.facebook}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "twitter_x")}
            label="Twitter Link"
            placeholder="Twitter Link"
            value={inputs.twitter_x}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "instagram")}
            label="Instagram Link"
            placeholder="Instragram Link"
            value={inputs.instagram}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "linkedIn")}
            label="LinkedIn Link"
            placeholder="LinkedIn Link"
            value={inputs.linkedIn}
          />

          <Input
            style={{
              textAlignVertical: "top",
              width : 300,
              paddingTop:10,
              paddingBottom:10,
              color:'grey'
              // fontFamily: "Poppins",
            }}
            value={inputs.bio}
            onChangeText={(text) => handleOnchange(text, "bio")}
            onFocus={() => handleError(null, "bio")}
            label="Bio"
            placeholder="Enter Your Bio"
            multiline
            numberOfLines={5}
            error={errors.bio}
            isRequired={true}
          />
          <Text style={styles.label}>
            Date Of Birth <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              errors.date ? styles.errorBorder : styles.defaultBorder
            ]}
            onPress={() => {
              showDatePicker();
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: date ? 'black' : 'gray',
               
                fontFamily: 'Poppins', fontSize: 14,
                color: date ? 'black' : 'gray',
                marginLeft:0,
                marginTop:10,
                fontFamily: 'Poppins',
              }}
            >
              {date || 'Please select DOB'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
            {errors.date ? (
         <Text style={styles.errorText}>Please select DOB</Text>
            ) : null}
          <Text style={styles.label}>
          Select your Languages <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View
        style={[
          styles.multiSelectContainer,
          errors.languages ? styles.errorBorder : styles.defaultBorder,
        ]}
      >
          <MultiSelect
        hideTags
        items={items}
        uniqueKey="id"
        onSelectedItemsChange={(newSelectedItems) => {
          setSelectedLanguage(newSelectedItems);
          setErrors({
            languages: newSelectedItems.length < 1,
          });
      
        }}
        
        selectedItems={selectedLanguage}
        selectText="Select Your Language"
        searchInputPlaceholderText="Search Items..."
        altFontFamily="Poppins"
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: '#000', fontFamily: 'Poppins', paddingHorizontal: 0 }}
        submitButtonColor="#000"
        submitButtonText=""
        hideSubmitButton
        styleInputGroup={styles.styleInputGroup}
        styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
        styleDropdownMenu={styles.styleDropdownMenu}
        styleMainWrapper={styles.styleMainWrapper}
        flatListProps={{
          renderItem: ({ item }) => {
            const isSelected = selectedLanguage.includes(item.id);
            return (
              <TouchableOpacity
                style={[
                  { padding: 10, margin: 2, borderRadius: 10 },
                  { backgroundColor: isSelected ? '#EEEEEE' : '#fff' }
                ]}
                onPress={() => {
                  const newSelectedItems = isSelected
                    ? selectedLanguage.filter(id => id !== item.id)
                    : [...selectedLanguage, item.id];
                  setSelectedLanguage(newSelectedItems);
                   // Update error state
                   setErrors({
                    languages: newSelectedItems.length < 1,
                  });
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[
                    styles.itemText,
                    { color: isSelected ? COLORS.primary : '#000', fontFamily: 'Poppins' }
                  ]}>
                    {item.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color="#000" />
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        }}
      />
          </View>

          {errors.languages && (
        <Text style={styles.errorText}>Please select at least one or two languages</Text>
      )}
      <View style={styles.tabsContainer}>
        {selectedLanguage.map(itemId => {
          const item = items.find(i => i.id === itemId);
          if (!item) return null;
          return (
            <View key={item.id} style={styles.tab}>
              <Text style={styles.tabText}>{item.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const updatedItems = selectedLanguage.filter(id => id !== itemId);
                  setSelectedLanguage(updatedItems);
                   // Update error state
                   setErrors({
                    languages: updatedItems.length < 1,
                  });
                }}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
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
                    source={require("../../assets/camera.png")}
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
        {/* <View style={styles.stepContainer}> */}
        {/* <View style={styles.autocompleteContainer}> */}
        {/* <Text style={styles.label}>Location</Text> */}
        {/* <GooglePlacesAutocomplete
          placeholder="Search by location"
          onPress={handleLocationSelect}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          fetchDetails={true}
          textInputProps={{
            style: {
              borderColor:  "gray",
              borderWidth: 1,
              height: 50,
              borderRadius: 10,
              paddingHorizontal: 10,
              width: "100%",
            },
          }}
          styles={{
            container: { flex: 0 },
            listView: { zIndex: 1000 },
          }}
        /> */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity onPress={getLocation}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : address && location ? (
          <View style={{marginTop:10}}>
          <Input
            // onChangeText={(text) => handleOnchange(text, "location")}
            label="Location"
            placeholder="Enter Location"
            value={address}
            isRequired={true}
          />
          </View>
        ) : null}

        {/* </View> */}

        {/* {location && (
          <View>
            <MapView style={styles.map} region={location} apiKey={GOOGLE_MAPS_APIKEY}>
              <Marker coordinate={location} />
            </MapView>
          </View>
        )} */}

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
        {/* </View> */}
        {/* <Button
          title={
            loading ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={styles.indicator}
              />
            ) : (
              "Next"
            )
          }
          onPress={validate}
        /> */}
      </ScrollView>
    );
  };
  console.log(location);
  // const renderStep2 = () => {
  //   return (
  //     <View style={styles.stepContainer}>
  //       <View style={styles.autocompleteContainer}>
  //         {/* <Text style={styles.label}>Location</Text> */}
  //         {/* <GooglePlacesAutocomplete
  //         placeholder="Search by location"
  //         onPress={handleLocationSelect}
  //         query={{
  //           key: GOOGLE_MAPS_APIKEY,
  //           language: "en",
  //         }}
  //         fetchDetails={true}
  //         textInputProps={{
  //           style: {
  //             borderColor:  "gray",
  //             borderWidth: 1,
  //             height: 50,
  //             borderRadius: 10,
  //             paddingHorizontal: 10,
  //             width: "100%",
  //           },
  //         }}
  //         styles={{
  //           container: { flex: 0 },
  //           listView: { zIndex: 1000 },
  //         }}
  //       /> */}
  //         <Input
  //           onChangeText={(text) => handleOnchange(text, "location")}
  //           label="Location"
  //           placeholder="Enter Location"
  //           value={address}
  //         />
  //       </View>

  //       {location && (
  //         <View>
  //           <MapView style={styles.map} region={location}>
  //             <Marker coordinate={location} />
  //           </MapView>
  //         </View>
  //       )}

  //       <Button
  //         title={
  //           loading1 ? (
  //             <ActivityIndicator
  //               size="small"
  //               color="#ffffff"
  //               style={styles.indicator}
  //             />
  //           ) : (
  //             "Submit"
  //           )
  //         }
  //         onPress={handleSubmit}
  //       />
  //     </View>
  //   );
  // };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header
          title={"Edit Profile"}
          icon={icons.back}
        />
      </View>
      {/* <View style={{paddingHorizontal:20}}>
      <View style={styles.progressContainer}>
        
        {[...Array(totalSteps)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              index < currentStep ? styles.progressBarActive : null,
            ]}
          />
        ))}
      </View>
      </View> */}
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

export default EditProfile;
