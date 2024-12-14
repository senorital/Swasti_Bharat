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
  BackHandler,ToastAndroid,Alert,Modal,Linking,Platform,CheckBox,TouchableWithoutFeedback,TextInput
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MultiSelect from "react-native-multiple-select";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchImageLibrary } from 'react-native-image-picker';
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import * as Location from "expo-location";
import { getInstructor, updateInstructor,addProfilePic } from "../../redux/actions/auth/auth";
import { COLORS, icons } from "../../components/constants";
import CustomAlertModal from "../../components/CustomAlert/CustomAlertModal";
import * as FileSystem from 'expo-file-system';
import CustomDatePicker from "../../components/customDatePicker/CustomDatePicker";
import { number } from "yup";
// import { getUser } from "../../redux/actions/auth/auth";

const defaultLocation = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const EditProfile = ({ navigation }) => {
  const totalSteps = 2;
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth.user);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    facebook: "",
    twitter_x: "",
    linkedIn: "",
    instagram: "",
    bio: "",
    totalExperienceInYears : "",
    dob:""
  });
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("Select Date");
  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState(defaultLocation);
  const [name, setName] = useState("");
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
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [totalExperienceInYears, setTotalExperienceInYears] = useState('');
  const [experienceFirst, setExperienceFirst] = useState(false); // Track if Experience was entered first
  const [user, setUser] = useState(null);
  const [showItems, setShowItems] = useState(false); // To toggle visibility of items
  const [selectedText, setSelectedText] = useState(''); // To track selected language text



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
  
      if (!imageUri) {
        throw new Error("No image URI provided");
      }
  
  
      const formData = new FormData();
      
      formData.append("profileImage", {
        uri: imageUri,
        name: `image.jpg`,
        type: "image/jpeg",
      });
  
  
      const res = await dispatch(addProfilePic(formData));
  
  
      if (res.error) {
          console.error("Response details:", res);
      } else {
      }
    } catch (error) {
      // console.error("Error in addProfilePics:", error.message);
    }
  };
  



const pickImage = async () => {
  try {
    const options = {
      mediaType: 'photo', // Only images
      quality: 1, 
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
    } else if (result.errorCode) {
      console.error('Error selecting image:', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const { uri, fileName, type } = result.assets[0]; // Extract image data
      await handleImageSelection(uri);
    }
  } catch (error) {
    console.error('Error in pickImage:', error.message);
  }
};
  

  
  const handleImageSelection = async (imageUri) => {
    try {
  
      // Get image file info including size
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      const imageSizeInBytes = imageInfo.size;
  
  
      setImage(imageUri);
      setErrors(false);
  
      await addProfilePics(imageUri);
    } catch (error) {
      console.error("Error handling image selection:", error.message);
    }
  };

  

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true; 
      }
      return false; 
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  
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
    setInputs((prevState) => {
      const updatedState = { ...prevState, [input]: text };

      if (input === "totalExperienceInYears") {
        setExperienceFirst(true); // Mark experience as filled first
        validateExperience(updatedState.totalExperienceInYears); // Validate experience
      }

      return updatedState;
    });
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

 


  useEffect(() => {
    const fetchData = async () => {
      try {
      const res =   await dispatch(getInstructor()); 
      const exp = res?.data?.data?.totalExperienceInYears;
      setTotalExperienceInYears(exp);
      const languagesString = res?.data?.data?.languages;
      setUser(res?.data)
      console.log("res.data :" + res?.data)
        if (user?.data?.profilePic?.path) {
          const imageUri = user?.data?.profilePic?.path; // Access profile picture path
          if (imageUri) {
            setImage(imageUri); // Set the profile picture
          }
        } else {
        }
        if (languagesString) {
          
          try {
            const parsedLanguages = JSON.parse(languagesString);
        
            // Check if parsedLanguages is a non-empty array
            if (Array.isArray(parsedLanguages) && parsedLanguages.length > 0) {
              setLanguages(parsedLanguages);
        
              // Normalize both parsedLanguages and item names to avoid any trimming issues
              const selectedIds = items
                .filter(item => 
                  parsedLanguages.some(
                    lang => lang.trim().toLowerCase() === item.name.trim().toLowerCase()
                  )
                )
                .map(item => item.id);
        
              setSelectedLanguage(selectedIds);
            } else {
              setLanguages([]);
              setSelectedLanguage([]);
            }
          } catch (error) {
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

 
  }
};

fetchData();
}, [dispatch]);

  useEffect(() => {
    if (user) {
      setInputs({
        name: user?.data?.name || "",
        email: user?.data?.email || "",
        mobileNumber: user?.data?.phoneNumber || "",
        bio: user?.data?.bio || "",
        facebook: user?.data?.facebook || "",
        twitter_x: user?.data?.twitter_x || "",
        linkedIn: user?.data?.linkedIn || "",
        instagram: user?.data?.instagram || "",
        totalExperienceInYears : String(user?.data?.totalExperienceInYears) || ""
      });
      setSelectedDate(user?.data?.dateOfBirth || "");
        }
  }, [user]);
  const validate = async () => {
    let isValid = true;

    if (!inputs.name) {
      handleError("Please input name", "name");
      isValid = false;
    }
    if (selectedDate === "Select Date") {
      handleError("Please select your date of birth", "selectedDate");
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
    if (!selectedDate || selectedDate === "Please select DOB") {
      handleError("Please select your date of birth", "selectedDate");
      isValid = false;
    }
    if (!inputs.bio) {
      handleError("Please input bio", "bio");
      isValid = false;
    }
    if (selectedLanguage.length < 1) { 
      handleError("Please select at least 1 languages", "languages");
      isValid = false;
    }
  

    if (!isValid) {
      return;
    }

    try {
      setLoading1(true);
      let formData = {
        dateOfBirth: selectedDate,
        name: inputs.name,
        bio: inputs.bio,
        totalExperienceInYears : inputs.totalExperienceInYears,
           languages: selectedLanguage, 
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
      if (inputs.totalExperienceInYears) {
        formData.totalExperienceInYears = inputs.totalExperienceInYears;
      }
      if (inputs.twitter_x) {
        formData.twitter_x = inputs.twitter_x;
      }
    
    
      // Send the formData object as JSON in the API request
      const res = await dispatch(updateInstructor(formData))

      if (res && res.success) {

        ToastAndroid.show(res.message, ToastAndroid.SHORT);


        const profileRes = await dispatch(getInstructor());
  
        // Extract the required data from the response
        const profileData = profileRes?.data?.data;
        const profileComplete = profileRes?.data?.profileComplete; // Adjusted to reflect nested structure
        const qualifications = profileData.qualifications;
        const userName = profileData.name;
      
   
      
        // Check if profile is marked as complete
        if (profileComplete > 20) { // Assuming profileComplete is a percentage (adjust the threshold if needed)
          const hasQualificationIn = (type) => {
            return qualifications.some((q) => q.qualificationIn === type);
          };
      
          // Check if HomeTutor qualification exists
          if (hasQualificationIn("HomeTutor")) {
            navigation.navigate("ProfileOverview");
          } else {
            setBoldText(userName);
            setShowAlert(true);
            setAlertMessage("Please complete your HomeTutor qualification.");
            setOnAlertOk(() => () => {
              setShowAlert(false);
              navigation.navigate("AddQualification");
            });
          }
        } else {
          // Handle case where profile is not complete (based on your logic)
          setShowAlert(true);
          setAlertMessage("Your profile is incomplete. Please update your profile.");
        }
      }      
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
      const msg = error.response?.data?.message;
    } finally {
      setLoading1(false);
    }
  };


  // const handleDateSelect = (date) => {
  //   setSelectedDate(date);
  //   validateExperience();


  // };

  const toggleSelection = (id) => {
    const updatedSelection = selectedLanguage.includes(id)
      ? selectedLanguage.filter(item => item !== id)
      : [...selectedLanguage, id];

    setSelectedLanguage(updatedSelection);

    // Update error state
    const isError = updatedSelection.length === 0;
    setErrors({ languages: isError });

    // Update the selected language text
    setSelectedText(updatedSelection.length > 0 ? `${updatedSelection.length} Languages Selected` : '');
  };

  // Toggle visibility of items when "Select Your Languages" is clicked
  const toggleItemsVisibility = () => {
    setShowItems(!showItems);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setErrors((prevErrors) => ({ ...prevErrors, dob: '' })); // Clear DOB error on selection

    // If experience is already filled, validate DOB
    if (inputs.totalExperienceInYears && experienceFirst) {
      validateDOB(date);
    }
  };

  const validateDOB = (dob) => {
    if (inputs.totalExperienceInYears && dob) {
      const age = calculateAge(dob);
      const experienceValue = parseInt(inputs.totalExperienceInYears, 10);

      if (age < 18) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: "You must be at least 18 years old to have experience.",
        }));
      } else if (experienceValue < 2) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: "Experience should be at least 2 years.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: '', // Clear error message if valid
        }));
      }
    }
  };




  const validateExperience = (experience) => {
    if (selectedDate && experience) {
      const age = calculateAge(selectedDate);
      const experienceValue = parseInt(experience, 10);

      if (age < 18) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          totalExperienceInYears: "You must be at least 18 years old to have experience.",
        }));
      } else if (experienceValue < 2) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          totalExperienceInYears: "Experience should be at least 2 years.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          totalExperienceInYears: '', // Clear error message if valid
        }));
      }
    }
  };

  const handleExperienceChange = (text) => {
    setTotalExperienceInYears(text);
    validateExperience();
  };
  
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
              color:'grey',
              fontSize:13,
              fontFamily: "Poppins",
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
            onPress={() => setIsDatePickerVisible(true)}
            >
            <Text
              style={{
                fontSize: 14,
                color: selectedDate ? 'black' : 'gray',
               
                fontFamily: 'Poppins', fontSize: 14,
                color: selectedDate ? 'black' : 'gray',
                marginLeft:0,
                marginTop:10,
                fontFamily: 'Poppins',
              }}
            >
              {selectedDate || 'Please select DOB'}
            </Text>
          </TouchableOpacity>
         
          <CustomDatePicker
        isVisible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onDateSelect={handleDateSelect}
      />
       
            {/* {errors.selectedDate ? (
         <Text style={styles.errorText}>Please select DOB</Text>
            ) : null} */}
            {errors.selectedDate && <Text style={styles.errorText}>{errors.selectedDate}</Text>}
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            <Input
  onChangeText={(text) => handleOnchange(text, "totalExperienceInYears")}
  label="Total Experience in Years"
  placeholder="Total Experience in Years"
  value={inputs.totalExperienceInYears}
  // keyboardType="numeric" 
  
  error={errors.totalExperienceInYears}

/>

          {/* <Text style={styles.label}>
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

      // Update error state
      const isError = newSelectedItems.length === 0;
      setErrors({
        languages: isError,
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
    
        console.log("Rendering item:", item.name, "isSelected:", isSelected); // Log the rendering state of each item
    
        return (
          <TouchableOpacity
            style={[
              { padding: 10, margin: 2, borderRadius: 10 },
              { backgroundColor: isSelected ? '#EEEEEE' : '#fff' }
            ]}
            onPress={() => {
              console.log("Item clicked:", item.name); // Log when an item is clicked
    
              // Toggle selection
              const updatedSelectedItems = isSelected
                ? selectedLanguage.filter(id => id !== item.id)
                : [...selectedLanguage, item.id];
    
              console.log("Updated selected items:", updatedSelectedItems); // Log the updated selection state
    
              setSelectedLanguage(updatedSelectedItems);
    
              // Update error state
              const isError = updatedSelectedItems.length === 0;
              setErrors({
                languages: isError,
              });
    
              console.log("Error state:", isError); // Log the error state
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={[
                  styles.itemText,
                  { color: isSelected ? COLORS.primary : '#000', fontFamily: 'Poppins' }
                ]}
              >
                {item.name}
              </Text>
              {isSelected && <Ionicons name="checkmark" size={20} color="#000" />}
            </View>
          </TouchableOpacity>
        );
      }
    }}
    />

  {errors.languages && (
    <Text style={styles.errorText}>Please select at least one language</Text>
  )}
  </View> */}
 <View>
      <Text style={styles.label}>
        Select your Languages <Text style={{ color: "red" }}>*</Text>
      </Text>

      {/* Touchable TextInput that opens the language selection when clicked */}
      <TouchableOpacity onPress={toggleItemsVisibility}>
        <TextInput
          value={selectedText} // Display number of selected languages
          editable={false} // Make it read-only
          style={styles.textInput}
          placeholder="Select your Language"
          
        />
      </TouchableOpacity>

      {/* Show item list only when `showItems` is true */}
      {showItems && (
        <View
          style={[
            styles.multiSelectContainer,
            errors.languages ? styles.errorBorder : styles.defaultBorder,
          ]}
        >
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemContainer,
                { backgroundColor: selectedLanguage.includes(item.id) ? COLORS.icon_background : '#fff' }, // Change background when selected
              ]}
              onPress={() => toggleSelection(item.id)}
            >
              <View style={styles.itemTextContainer}>
                {/* Align Tick Mark to the Left */}
                {selectedLanguage.includes(item.id) && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={styles.tickIcon} />
                )}
                <Text style={[styles.itemText, { color: selectedLanguage.includes(item.id) ? COLORS.primary : '#000' }]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {errors.languages && (
        <Text style={styles.errorText}>Please select at least one language</Text>
      )}
    </View>


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
              const isError = updatedItems.length === 0;
              setErrors({
                languages: isError,
              });

            }}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      );
    })}
  </View>

  
{/* {errors.totalExperienceInYears && <Text style={styles.errorText}>{errors.totalExperienceInYears}</Text>} */}

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
            onChangeText={(text) => handleOnchange(text, "location")}
            label="Location"
            placeholder="Enter Location"
            value={address}
            isRequired={true}
          />
          </View>
        ) : null}

    

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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
    padding: 8,
    borderRadius:8,
    backgroundColor:'grey',
    borderBottomColor:'#eee',
    borderBottomWidth:1
  },
  itemTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
  },
  itemText: {
    fontSize: 14,
    marginLeft: 10,
    fontFamily:'Poppins'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  multiSelectContainer: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
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
  textInput: {
    // marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    borderColor: COLORS.icon_background,
    borderWidth: 1,
    fontFamily:'Poppins',
    borderRadius: 8,
  },
  label: {
    marginVertical: 5,
    color : COLORS.primary,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
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
    // paddingVertical:0,
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
