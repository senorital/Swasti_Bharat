import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  BackHandler,Image,ToastAndroid,TextInput,TouchableHighlight
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, Circle } from "react-native-maps";
import Toast from "react-native-toast-message";
import MultiSelect from "react-native-multiple-select";
import { SelectList } from "react-native-dropdown-select-list";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

import CheckBox from "react-native-check-box";
import { GOOGLE_MAPS_APIKEY } from "../../../../profile/apiKey/index";
import Header from "../../../../components/header/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import DatePicker from 'react-native-date-picker';

import {
  addHomeTutor,
  addTutorLocation,
  getTutorQualification,addTutorPhoto,addTimeSlot,
  addTutorPrice,
  getPrice,
  getTutorById
} from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import * as ImagePicker from "expo-image-picker";
import {  getServiceArea ,getYogaForCategory} from "../../../../redux/actions/instructor/homeTutor/homeTutor";
// import { getYogaForCategory } from "../../../../redux/api/instructor/";
import CustomTimePickerWithClock from "../../../../components/customPicker/CustomTimePicker";
const defaultLocation = {
  latitude: 28.6139, // Latitude for New Delhi
  longitude: 77.2090, // Longitude for New Delhi
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};



const distances = [
  { id: 1, label: "1 km", value: 1000 },
  { id: 2, label: "3 km", value: 3000 },
  { id: 3, label: "5 km", value: 5000 },
  { id: 4, label: "10 km", value: 10000 },
];

const durationOptions = [
  { key: "15", value: "15" },
  { key: "20", value: "20" },
  { key: "25", value: "25" },
  { key: "30", value: "30" },
  { key: "35", value: "35" },
  { key: "40", value: "40" },
  { key: "45", value: "45" },
  { key: "50", value: "50" },
  { key: "55", value: "55" },
  { key: "60", value: "60" },
  { key: "65", value: "65" },
  { key: "70", value: "70" },
  { key: "75", value: "75" },
  { key: "80", value: "80" },
];

const serviceTypeItems=[
  {key:'Private',value:'Private'},
  {key:'Group',value:'Group'}
]

const specialisationItems = [
  { id: "1", name: "Hatha Yoga" },
  { id: "2", name: "Vinyasa Yoga" },
  { id: "3", name: "Ashtanga Yoga" },
  { id: "4", name: "Bikram Yoga" },
  { id: "5", name: "Kundalini Yoga" },
  { id: "6", name: "Iyengar Yoga" },
  { id: "7", name: "Yin Yoga" },
  { id: "8", name: "Restorative Yoga" },
  { id: "9", name: "Power Yoga" },
  { id: "10", name: "Yoga Therapy" },
];

const serviceItems = [
  { id: "1", name: "Group Class" },
  { id: "2", name: "Individual Class" },
];

const priceTypeItems = [
  { key: "1", value: "Subscription Price" },
  { key: "2", value: "Freemium Price" },
  { key: "3", value: "Fixed Price" },
  { key: "4", value: "Dynamic Price" },
];

const packageTypeItems = [
  { key: "1", value: "monthly 25" },
  { key: "2", value: "weekly 6" },
  { key: "3", value: "monthly 30" },
  { key: "4", value: "weekly 7" },
  { key: "5", value: "daily" },
];


const language = [
  { id: '1', name: 'English' },
  { id: '2', name: 'Spanish' },
  { id: '3', name: 'French' },
  { id: '4', name: 'German' },
  { id: '5', name: 'Hindi' },
  { id: '6', name: 'Bengali' },
  { id: '7', name: 'Telugu' },
  { id: '8', name: 'Marathi' },
  { id: '9', name: 'Tamil' },
  { id: '10', name: 'Urdu' },
  { id: '11', name: 'Gujarati' },
  { id: '12', name: 'Malayalam' },
  { id: '13', name: 'Kannada' },
  { id: '14', name: 'Odia' },
  { id: '15', name: 'Punjabi' },
  { id: '16', name: 'Assamese' },
  { id: '17', name: 'Maithili' },
  { id: '18', name: 'Sanskrit' },
  { id: '19', name: 'Konkani' },
  { id: '20', name: 'Nepali' },
  { id: '21', name: 'Manipuri' },
  { id: '22', name: 'Sindhi' },
  { id: '23', name: 'Dogri' },
  { id: '24', name: 'Kashmiri' },
  { id: '25', name: 'Bodo' },
];

const classmodeType=[
  {key:'Online',value:'Online'},
  {key:'Offline',value:'Offline'}
]


const HomeTutor = ({ navigation }) => {
  const totalSteps = 5;
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(defaultLocation);
  const [radius, setRadius] = useState(null);
  const [selectedSpecialisations, setSelectedSpecialisations] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [tutorId, setTutorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [certification, setCertification] = useState("");
  const [name, setName] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [yogaFor,setYogaFor]=useState([]);
  const [tutorName,setTutorName]=useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [serviceType,setServiceType]=useState('');
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState("");
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [yogaItems, setYogaItems] = useState([]);
  const [mode, setMode] = useState(null);
  const [priceType,setpriceType]=useState('');
  const [packageType,setpackageType]=useState('');
  const [private_PricePerDayPerRerson, setprivate_PricePerDayPerRerson] = useState("");
  const [group_PricePerDayPerRerson, setgroup_PricePerDayPerRerson] = useState("");
  const [isPrivateSo, setIsPrivateSo] = useState(false);
  const [isGroupSo, setIsGroupSo] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(""); // Store the selected package duration
  const [selectedPriceId, setSelectedPriceId] = useState(null); // Store the selected package ID

  const [validationMessage, setValidationMessage] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const handleSelectDistance = (value) => {
    setRadius(value);
  };
  // const [numberOfPeople, setNumberOfPeople] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [serviceAreaLocations, setServiceAreaLocations] = useState([]);
  const [PriceData, setPriceData] = useState([]);

  const [serviceAreaLocation, setServiceAreaLocation] = useState(""); // Track selected service area
  const [selectedServiceAreas, setSelectedServiceAreas] = useState([]); // Array to store selected service areas
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingImages, setLoadingImages] = useState([]);
  const [images, setImages] = useState([]); // The array of selected images
  const [canSubmit, setCanSubmit] = useState(false); // State to control when submit is allowed

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [personalPrice, setPersonalPrice] = useState(null); // State for personal price
  const [groupPrice, setGroupPrice] = useState(null); // State for group price

  const formatTime = (time) => {
    if (!time) return "";
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const theme = {
    calendarBackground: "#DDDDDD",
    textSectionTitleColor: COLORS.primary,
    selectedDayTextColor: "white",
    dayTextColor: "black",
    textDisabledColor: "gray",
    dotColor: "orange",
    arrowColor: "black",
    monthTextColor: "black",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    todayTextColor: "black",
    textDayFontSize: 16,
  };

  const handleSlotSelect = (index) => {
    setSelectedSlots((prevSelectedSlots) => {
      if (prevSelectedSlots.includes(index)) {
        return prevSelectedSlots.filter((slot) => slot !== index);
      } else {
        return [...prevSelectedSlots, index];
      }
    });
  };

  const hideDatePicker = () => {
    setShowStartTimePicker(false); // Close the modal
  };
  const handleConfirm = (time) => {
    // Get the current time
    const currentTime = new Date();
    const adjustedTime = new Date(currentTime);
    adjustedTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  
  
    setShowStartTimePicker(false);
  
    // Check if startDate exists, and if it's today's date
    if (startDate && startDate.toDateString() === currentTime.toDateString()) {
      // Compare the selected time (adjustedTime) with the current time (currentTime)
      if (adjustedTime < currentTime) {
        alert("Please select a future time.");
        return; // Stop further execution if time is in the past
      }
    }
  
   setStartTime(adjustedTime);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Yoga categories
        const yogaResponse = await dispatch(getYogaForCategory());
  
        if (yogaResponse.success) {
          setYogaItems(yogaResponse.data); // Update state with fetched yoga data
        } else {
          console.error("Failed to fetch yoga categories:", yogaResponse.message);
        }
  
    
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
  
    fetchData();
  }, [dispatch, tutorId]); // Ensure tutorId is added as a dependency if it's dynamic
  

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(getInstructor());
        setBio(res.data.data.bio);
        setTutorName(res.data.data.name);
        const qualificationRes = await dispatch(
          getTutorQualification("HomeTutor")
        );
        setCertification(qualificationRes.data[0].documentOriginalName);
      } catch (error) {
        console.error("Error fetching data:", error);
        const msg =
          error.res?.data?.message ||
          "An error occurred. Please try again.";
          ToastAndroid.show(msg,ToastAndroid.SHORT);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);



  const specialisationIdToName = specialisationItems.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});



  const serviceIdToName = serviceItems.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  const languageIdToName = language.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  
  const yogaForIdToName = yogaItems.reduce((acc, item) => {
    acc[item.id] = item.yogaFor;
    return acc;
  }, {});


  const handleLocationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    const isInIndia = details.formatted_address.includes("India");

     if (isInIndia) {
    setLocation({
      latitude: parseFloat(lat.toFixed(7)),
      longitude: parseFloat(lng.toFixed(7)),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setName(details.formatted_address);
    setValidationMessage("");
  } else {
    setValidationMessage("Please select a location within India.");
    setLocation(defaultLocation);
    setName("");
  }
  };
  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {/* Progress Bar */}
        {[...Array(totalSteps)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              index < step ? styles.progressBarActive : null,
            ]}
          />
        ))}
      </View>
    );
  };

  const stepThreeValidationSchema = Yup.object().shape({
    images: Yup.array()
      .of(
        Yup.object().shape({
          uri: Yup.string().required("Image is required"),
        })
      )
      .min(1, "At least one image is required")
      .max(3, "You can upload up to 3 images"),
  });
  
  const stepFourValidationSchema = Yup.object().shape({
    // Your validation for Step 4
  });

  const stepFiveValidationSchema = Yup.object().shape({
    // Your validation for Step 4
  });

  const stepOneValidationSchema = Yup.object().shape({
    // certification: Yup.string().required("Certification is required"),
    bio: Yup.string().required("Bio is required"),
    specialisations: Yup.array().min(
      1,
      "At least one specialisation is required"
    ),

  
     
    isPrivateSO: Yup.boolean(),
    isGroupSO: Yup.boolean(),
 
    // services: Yup.array().min(1, "At least one service offer is required"),
    language: Yup.array().min(1, "At least one language is required"),
    yogaFor:Yup.array().min(1, "At least one select field is required"),
  });


  useEffect(() => {
    if (
      radius &&
      name &&
      location.latitude !== defaultLocation.latitude &&
      location.longitude !== defaultLocation.longitude
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [radius, name, location]);

  const stepTwoValidationSchema = Yup.object().shape({
   
  });


  // const pickImage = async (setFieldValue) => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsMultipleSelection: true,
  //     selectionLimit: 3,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

 
  // };


  // const handleRemoveImage = (index, values, setFieldValue) => {
  //   const newImages = [
  //     ...values.images.slice(0, index),
  //     ...values.images.slice(index + 1),
  //   ];
  //   setFieldValue("images", newImages);
  // };

  const pickImage = async (setFieldValue) => {
    // Allow only 3 images to be selected
    if (images.length >= 3) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3 - images.length, // Select remaining photos
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets;
      
      // Update images state with newly selected images
      setImages((prevImages) => [...prevImages, ...newImages]);
      setFieldValue('images', [...images, ...newImages]);

      // Set loading state for each newly added image
      setLoadingImages((prevLoading) => [
        ...prevLoading,
        ...newImages.map(() => true), // Mark all new images as loading
      ]);
    }
  };

  const handleImageLoad = (index) => {
    // Once an image has loaded, set its loading state to false
    setLoadingImages((prevLoading) => {
      const newLoadingState = [...prevLoading];
      newLoadingState[index] = false;
      return newLoadingState;
    });

    // Check if all images have finished loading
    if (!loadingImages.includes(true)) {
      setCanSubmit(true); // Enable the submit button once all images are loaded
    }
  };

  const handleRemoveImage = (index, values, setFieldValue) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    setFieldValue('images', updatedImages);

    // Remove the loading state for the removed image
    const updatedLoadingImages = [...loadingImages];
    updatedLoadingImages.splice(index, 1);
    setLoadingImages(updatedLoadingImages);
  };
 
  const handleClassMode = (selected) => {
    setMode(selected);  
    };




  const handleStartTimeChange = (event, selectedTime) => {
    const currentTime = new Date();
    setShowStartTimePicker(false);  

    if (startDate && startDate.toDateString() === currentTime.toDateString() && selectedTime < currentTime) {
      alert("Please select a future time.");
      return;
    }
    setStartTime(selectedTime);
    
  };

  
 
  const handleServiceTypeChange = (value) => {
    setServiceType(value);
    if (value === "Private") {
      setNumberOfPeople("1");
    } else {
      setNumberOfPeople("");
    }
  };
  const handleSelection = (val) => {
    fetchServiceAreas(tutorId)
    const isAlreadySelected = selectedServiceAreas.includes(val);
    
    if (isAlreadySelected) {
        setSelectedServiceAreas(selectedServiceAreas.filter(area => area !== val));
    } else {
        setSelectedServiceAreas([...selectedServiceAreas, val]);
    }
  
    // Find the corresponding location details
    const selectedLocation = serviceAreaLocations.find(location => location.value === val);
    
    if (selectedLocation) {
        setSelectedLocationDetails(selectedLocation); // Update state with the selected location details
    } else {
        setSelectedLocationDetails(null); // Clear if not found
    }
  };

  const handleDurationChange = (selectedDuration) => {
    setDuration(selectedDuration);

  };

  const handleSelectionprice = (selectedKey) => {
    setSelectedPriceId(selectedKey); // Save selected package ID
    const selectedPackage = PriceData.find((item) => item.key === selectedKey);
    if (selectedPackage) {
      setSelectedDuration(selectedPackage.duration); // Save selected package duration
      console.log("selectedDuration :" + selectedDuration)
    }
  };

  const fetchServiceAreas = async (tutorId) => {
    try {

      const res = await dispatch(getServiceArea(tutorId)); 
      if (res.success) {
        const formattedLocations = res.data.map((item) => ({
            key: item.id, // Set the ID as the key
            value: item.locationName, // Set the location name as the dropdown value
            latitude: item.latitude, // Include latitude
            longitude: item.longitude, // Include longitude
            pincode: item.pincode, // Include pincode if necessary
            radius: item.radius, // Include radius
            unit: item.unit, // Include unit
            createdAt: item.createdAt, // Include createdAt timestamp
            updatedAt: item.updatedAt, // Include updatedAt timestamp
            deletedAt: item.deletedAt // Include deletedAt if necessary
        }));
        setServiceAreaLocations(formattedLocations); // Update the dropdown data
    } else {
        Toast.show({
          type: "error",
          text1: "Failed to fetch service areas.",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch service areas.",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  
  useEffect(() => {
    if (step === 5) {
  
      const fetchData = async () => {
        try {
          await fetchServiceAreas(tutorId);
            await fetchPrice(tutorId);
        } catch (error) {
          console.error("Error in fetching data: ", error);
        }
      };
  
      fetchData();
    }
  }, [tutorId, step]);

  useEffect(() => {
    if (step === 4) {
      const fetchData = async () => {
        try {
          const response = await dispatch(getTutorById(tutorId)); // Fetch tutor data

          if (response && response.success) {
            const tutorData = response?.data;

            // Set isPersonalPrice based on isPrivateSO
            setPersonalPrice(!!tutorData.isPrivateSO);

            // Set isGroupPrice based on isGroupSO
            setGroupPrice(!!tutorData.isGroupSO);
           
          }
        } catch (error) {
          console.error("Error in fetching data: ", error);
        }
      };

      fetchData();
    }
  }, [tutorId, step]);
  
  const fetchPrice = async (tutorId) => {
    try {
      const res = await dispatch(getPrice(tutorId)); // Replace getPrice with your actual Redux action or API call
  
      if (res.success) {
        const formattedPriceData = res.data.map((item) => ({
          key: item.id, 
          value: item.durationType, 
          duration: item.durationType, 
        }));
        setPriceData(formattedPriceData);    
         } else {
        Toast.show({
          type: "error",
          text1: "Failed to fetch price.",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch price.",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };
  

  const handlepriceType = (value) => {
    setpriceType(value);
   
  };

  const handlepackageType = (value) => {
    setpackageType(value);
   
  };

  const renderStepFour = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
  }) => {
   
   
    return (
      // Pass id into fetchServiceAreas
    <View style={[styles.stepContainer]}>
        <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
             Price Type
            </Text>
            <SelectList
            setSelected={handlepriceType}
           data={priceTypeItems}
              save="value"
              placeholder="Select Price Type"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
             Package Type
            </Text>
            <SelectList
            setSelected={handlepackageType}
           data={packageTypeItems}
              save="value"
              placeholder="Select Package Type"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          {personalPrice && (      
          
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
                Private Price Per Person Per Day
              </Text>
              <TextInput
                   style={styles.timePickerButton}
                value={private_PricePerDayPerRerson}
                onChangeText={setprivate_PricePerDayPerRerson}
                placeholder="Enter Private Price Per day per person"
                keyboardType="numeric"
              />
            </View>

)}
              {groupPrice && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
                Group Price Per Person Per Day
              </Text>
              <TextInput
                   style={styles.timePickerButton}
                value={group_PricePerDayPerRerson}
                onChangeText={setgroup_PricePerDayPerRerson}
                placeholder="Enter Group price per day per person"
                keyboardType="numeric"
              />
            </View>
               )}
           
         <View style={{}}>
          <Button
            title={
              isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Add Price"
              )
            }
            onPress={handleSubmit}
          />
          </View>  

    </View>
    );
  };

  const renderStepFive = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
  }) => {
   
   
    return (
      // Pass id into fetchServiceAreas
    <View style={[styles.stepContainer]}>
      <ScrollView style={{ }} showsVerticalScrollIndicator={false}>
        <View style={{ }}>
           
            <SelectList
            setSelected={handleSelection}
           data={serviceAreaLocations}
              save="value"
              placeholder="Select Service Area Location"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          <View style={{ }}>
          <Text style={styles.label}>
              Select Package type
            </Text>
            <SelectList
        setSelected={handleSelectionprice} // Handle selection
        data={PriceData} // Pass formatted price data
        save="key" // Save the key (ID) of the selected item
        placeholder="Select Package Type"
        boxStyles={styles.dropdown} // Dropdown styling
        fontFamily="Poppins" // Font style
      />
         </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Class Mode
            </Text>
            <SelectList
              setSelected={handleClassMode}
              data={classmodeType}
              save="value"
              placeholder="Select Class Mode"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Class Type
            </Text>
            <SelectList
              setSelected={handleServiceTypeChange}
              data={serviceTypeItems}
              save="value"
              placeholder="Select Class Type"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          {serviceType === "Group" && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
                Number of People
              </Text>
              <TextInput
                   style={styles.timePickerButton}
                value={numberOfPeople}
                onChangeText={setNumberOfPeople}
                placeholder="Enter number of people"
                keyboardType="numeric"
              />
            </View>
          )}
         <View style={{flexDirection:'row'}}>
        

<View style={{ marginTop: 10 }}>
        <Text style={styles.label}>
          Start Date
        </Text>
        <TouchableOpacity
          style={[styles.timePickerButton,{width:SCREEN_WIDTH/1.130}]}
          onPress={() => setOpenStart(true)} // Open Start Date Picker
        >
          <Text style={styles.buttonText}>
            {startDate ? startDate.toLocaleDateString() : 'Enter Start Date'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openStart}
          date={startDate}
          // minimumDate={new Date()}
          mode="date" // Date mode for picking date
          onConfirm={(selectedDate) => {
            setOpenStart(false);
            setStartDate(selectedDate); // Set selected Start Date
          }}
          onCancel={() => {
            setOpenStart(false);
          }}
        />
      </View>

         
            {/* <View style={{ marginTop: 10,marginLeft:10 }}> */}
        {/* <Text style={styles.label}>
          End Date
        </Text> */}
        {/* <TouchableOpacity
          style={[styles.timePickerButton,{width:SCREEN_WIDTH/2.3}]}
          onPress={() => setOpenEnd(true)} // Open End Date Picker
        >
          <Text style={styles.buttonText}>
            {endDate ? endDate.toLocaleDateString() : 'Enter End Date'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openEnd}
          date={endDate}
          mode="date" 
          minimumDate={startDate || new Date()}

          onConfirm={(selectedDate) => {
            setOpenEnd(false);
            setEndDate(selectedDate); 
          }}
          onCancel={() => {
            setOpenEnd(false);
          }}
        /> */}
      {/* </View> */}
          </View>
     
         
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Start Time
            </Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {startTime ? formatTime(startTime) : "Select Start Time"}
              </Text>
            </TouchableOpacity>
            <CustomTimePickerWithClock
        isVisible={showStartTimePicker}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        selectedTime={startTime}
      />
          </View>
        
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Duration (minutes)
            </Text>
            <SelectList
          setSelected={handleDurationChange}  // Handle duration change
          data={durationOptions}
              save="value"
              placeholder="Select Duration (minutes)"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>
          

       

          <Button
            title={
              isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Create Time Slots"
              )
            }
            onPress={handleSubmit}
          />
          
         </ScrollView>

    </View>
    );
  };


  const renderStepTwo = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
  }) => (
    <View style={[styles.stepContainer]}>
      <View style={[styles.autocompleteContainer]}>
        <Text style={styles.label}>Location</Text>
        <GooglePlacesAutocomplete
  placeholder="Search by location"
  onPress={handleLocationSelect}
  query={{
    key: GOOGLE_MAPS_APIKEY,
    language: "en",
  }}
  fetchDetails={true}
  renderRow={(rowData) => {
    const { description } = rowData;
    return (
      <View style={styles.row}>
        <Ionicons name="location-outline" size={15} color="#000" style={{width:20,height:20,marginLeft:5}} />
        <Text style={{fontFamily:'Poppins',fontSize:12}} ellipsizeMode="1">{description}</Text>
      </View>
    );
  }}
  textInputProps={{
    value: name, // Bind the current value to the state
    onChangeText: (text) => setName(text), // Update the state when text changes
    placeholderTextColor: "#999",
    style: {
      fontFamily: "Poppins", // Apply Poppins font to text input
      borderColor: COLORS.background,
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: COLORS.background,
      paddingHorizontal: 10,
      width: "100%",
      marginTop: 5,
      fontSize: 13,
      paddingVertical: 5,
    },
  }}
  renderLeftButton={() => null} // No left button needed
  renderRightButton={() =>
    name ? ( // Conditionally render the clear button if there is text
      <TouchableHighlight
        style={{position: "absolute",
          right: 10,
          top: 12,
          zIndex: 10,}}
        onPress={() => setName("")} // Clear the input text when pressed
      >
        <Ionicons name="close-circle" size={20}  />
      </TouchableHighlight>
    ) : null
  }
  styles={{
    container: { flex: 0 },
    listView: { zIndex: 1000 },
    poweredContainer: {
      display: "none", 
    },
    powered: {
      display: "none", 
    },
  }}
/>

           {validationMessage ? (
          <Text style={{fontFamily:'Poppins',fontSize:12,marginTop:5,color:'red'}}>{validationMessage}</Text>
        ) : null}
      </View>

      {touched.location && errors.location && (
        <Text style={styles.error}>{errors.location}</Text>
      )}

      {location && (
        <View>
          <MapView style={styles.map} region={location}>
            <Marker coordinate={location} />
            <Circle
              center={location}
              radius={radius}
              fillColor="rgba(135,206,250,0.5)"
              strokeColor="rgba(135,206,250,1)"
            />
          </MapView>
        </View>
      )}
      <FlatList
        data={distances}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.distanceButton,
              item.value === radius
                ? styles.selectedDistanceButton
                : styles.unselectedDistanceButton,
            ]}
            onPress={() => handleSelectDistance(item.value)}
          >
            <Text
              style={[
                styles.distanceButtonText,
                item.value === radius
                  ? styles.selectedDistanceButtonText
                  : styles.unselectedDistanceButtonText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.distanceList}
      />
<View style={{flex: 1}}>
<Button
        title={
          isSubmitting ? (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={styles.indicator}
            />
          ) : (
            "Next"
          )
        }
        onPress={handleSubmit}

      />
      </View>
    </View>
  );


  const renderStepThree = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    setFieldValue,
    errors,
    touched,
    isSubmitting,
  }) => (
    // <View style={styles.stepContainer}>
    //   <View style={styles.autocompleteContainer}>
    //     <Text style={styles.label}>Add Tutor Photos</Text>
    //     <Text style={styles.fontSize}>* Maximum 3 photos can be selected</Text>
  
    //     <View>
    //       <TouchableOpacity
    //         activeOpacity={0.8}
    //         onPress={() => pickImage(setFieldValue)}
    //         style={styles.cameraContainer}
    //       >
    //         <View style={styles.cameraButton}>
    //           <Image
    //             style={styles.cameraImage}
    //             source={require("../../../../assets/camera.png")}
    //           />
    //           <Text style={styles.cameraText}>Add Photo</Text>
    //         </View>
    //       </TouchableOpacity>
    //       {errors.images && touched.images && (
    //         <Text style={styles.errorText}>{errors.images}</Text>
    //       )}
    //     </View>
    //     <View
    //       style={{ width: wp(90), marginTop: 10, marginRight: 10 }}
    //     >
    //       <FlatList
    //         data={values.images}
    //         horizontal={true}
    //         keyExtractor={(item, index) => index.toString()}
    //         renderItem={({ item, index }) => (
    //           <TouchableOpacity
    //             onPress={() =>
    //               handleRemoveImage(index, values, setFieldValue)
    //             }
    //           >
    //             <Image
    //               source={{ uri: item.uri }}
    //               style={{
    //                 width: wp(40),
    //                 height: hp(20),
    //                 borderRadius: 5,
    //                 marginHorizontal: 5,
    //               }}
    //             />
    //           </TouchableOpacity>
    //         )}
    //       />
    //     </View>
    //   </View>
  
    //   <Button
    //     title={
    //       isSubmitting ? (
    //         <ActivityIndicator
    //           size="small"
    //           color="#ffffff"
    //           style={styles.indicator}
    //         />
    //       ) : (
    //         "Next"
    //       )
    //     }
    //     onPress={handleSubmit}
    //   />
    // </View>
    <View style={styles.stepContainer}>
      <View style={styles.autocompleteContainer}>
        <Text style={styles.label}>Add Tutor Photos</Text>
        <Text style={styles.fontSize}>* Maximum 3 photos can be selected</Text>

        <View>
          {images.length < 3 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => pickImage(setFieldValue)}
              style={styles.cameraContainer}
            >
              <View style={styles.cameraButton}>
                <Image
                  style={styles.cameraImage}
                  source={require("../../../../assets/camera.png")}
                />
                <Text style={styles.cameraText}>Add Photo</Text>
              </View>
            </TouchableOpacity>
          )}
          {errors.images && touched.images && (
            <Text style={styles.errorText}>{errors.images}</Text>
          )}
        </View>

        <View style={{ width: wp(90), marginTop: 10, marginRight: 10 }}>
          <FlatList
            data={images}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={() => handleRemoveImage(index, values, setFieldValue)}
                  style={styles.deleteIconContainer}
                >
                  <Image
          source={require("../../../../assets/icons/delete.png")}
          style={{width:20,height:20}}
        />
                </TouchableOpacity>
                {loadingImages[index] && (
                  <ActivityIndicator
                    size="small"
                    color="#000000"
                    style={styles.loadingIndicator}
                  />
                )}
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: wp(40),
                    height: hp(20),
                    borderRadius: 5,
                    marginHorizontal: 5,
                  }}
                  onLoad={() => handleImageLoad(index)}
                />
              </View>
            )}
          />
        </View>
      </View>

      <Button
        title={
          isSubmitting ? (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={styles.indicator}
            />
          ) : (
            "Next"
          )
        }
        onPress={canSubmit ? handleSubmit : null}
        disabled={!canSubmit} // Disable the button until all images are loaded
      />
    </View>
  );

  const renderStepOne = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
    
  }) => {

    return (
      
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.stepContainer}>
        
        {/* <Input
          label="Certification / Qualification"
          value={values.certification}
          // onChangeText={handleChange("certification")}
          // onBlur={handleBlur("certification")}
          placeholder="Enter your certification"
          error={touched.certification && errors.certification}
          isRequired={true}
        />
        <Input
          onChangeText={handleChange("bio")}
          onBlur={handleBlur("bio")}
          value={values.bio}
          multiline={true}
          numberOfLines={4}
          isRequired={true}
          label="Instructor Bio"
          placeholder="Instructor Bio"
          error={touched.bio && errors.bio}
          style={{ textAlignVertical: "top", padding: 12 }}
        /> */}
<Text style={[styles.label, { marginTop: 10 }]}>
  Giving Yoga Sessions For <Text style={{ color: "red" }}>*</Text>
</Text>
<MultiSelect
  hideTags
  items={yogaItems}
  uniqueKey="id"
  onSelectedItemsChange={(val) => {
    setYogaFor(val);
    setFieldValue("yogaFor", val);
  }}
  selectedItems={yogaFor}
  selectText="Select Your Yoga Sessions For"
  searchInputPlaceholderText="Search Items..."
  altFontFamily="Poppins"
  tagRemoveIconColor="#CCC"
  tagBorderColor="#CCC"
  tagTextColor="#CCC"
  selectedItemTextColor="#CCC"
  selectedItemIconColor="#CCC"
  itemTextColor="#000"
  displayKey="yogaFor"
  searchInputStyle={{ color: '#000', fontFamily: 'Poppins', paddingHorizontal: 0 }}
  submitButtonColor="#000"
  submitButtonText=""
  hideSubmitButton={true}
  styleInputGroup={styles.styleInputGroup}
  styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
  styleDropdownMenu={styles.styleDropdownMenu}
  styleMainWrapper={styles.styleMainWrapper}
  flatListProps={{
    renderItem: ({ item }) => {
      const isSelected = yogaFor.includes(item.id);
      return (
        <TouchableOpacity
          style={[
            { padding: 10, margin: 2, borderRadius: 10 },
            { backgroundColor: isSelected ? '#EEEEEE' : '#fff' }
          ]}
          onPress={() => {
            const newSelectedItems = isSelected
              ? yogaFor.filter(id => id !== item.id)
              : [...yogaFor, item.id];

         
            setYogaFor(newSelectedItems);
            setFieldValue('yogaFor', newSelectedItems);
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[
              styles.itemText,
              { color: isSelected ? COLORS.primary : '#000', fontFamily: 'Poppins' }
            ]}>
              {item.yogaFor}
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

{/* Selected Yoga For Display */}
<View style={styles.tabsContainer}>
  {yogaFor.map(itemId => {
    const item = yogaItems.find(i => i.id === itemId);
    if (!item) return null;
    return (
      <View key={item.id} style={styles.tab}>
        <Text style={styles.tabText}>{item.yogaFor}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            const updatedItems = yogaFor.filter(id => id !== itemId);
            setYogaFor(updatedItems);
            setFieldValue('yogaFor', updatedItems);
          }}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  })}
</View>
{touched.yogaFor && errors.yogaFor && (
  <Text style={styles.error}>{errors.yogaFor}</Text>
)}


        <Text style={styles.label}>
          Specialisations <Text style={{ color: "red" }}>*</Text>
        </Text>
        <MultiSelect
  hideTags
  items={specialisationItems}
  uniqueKey="id"
  onSelectedItemsChange={(val) => {
    setSelectedSpecialisations(val);
    setFieldValue("specialisations", val);
  }}
  selectedItems={selectedSpecialisations}
  selectText="Select Your Specialisation"
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
  hideSubmitButton={true}
  styleInputGroup={styles.styleInputGroup}
  styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
  styleDropdownMenu={styles.styleDropdownMenu}
  styleMainWrapper={styles.styleMainWrapper}
  flatListProps={{
    renderItem: ({ item }) => {
      const isSelected = selectedSpecialisations.includes(item.id);
      return (
        <TouchableOpacity
          style={[
            { padding: 10, margin: 2, borderRadius: 10 },
            { backgroundColor: isSelected ? '#EEEEEE' : '#fff' }
          ]}
          onPress={() => {
            const newSelectedItems = isSelected
              ? selectedSpecialisations.filter(id => id !== item.id)
              : [...selectedSpecialisations, item.id];
            setSelectedSpecialisations(newSelectedItems);
            setFieldValue('specialisations', newSelectedItems);
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


{/* Selected Specialisations Display */}
<View style={styles.tabsContainer}>
  {selectedSpecialisations.map(itemId => {
    const item = specialisationItems.find(i => i.id === itemId);
    if (!item) return null;
    return (
      <View key={item.id} style={styles.tab}>
        <Text style={styles.tabText}>{item.name}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            const updatedItems = selectedSpecialisations.filter(id => id !== itemId);
            setSelectedSpecialisations(updatedItems);
            setFieldValue('specialisations', updatedItems);
          }}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  })}
</View>
{touched.specialisations && errors.specialisations && (
          <Text style={styles.error}>{errors.specialisations}</Text>
        )}
     
     <Text style={[styles.label, { marginTop: 10 }]}>
          Languages <Text style={{ color: "red" }}>*</Text>
        </Text>
        <MultiSelect
          hideTags
          items={language}
          uniqueKey="id"
          onSelectedItemsChange={(val) => {
            setSelectedLanguage(val);
            setFieldValue("language", val);
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
          hideSubmitButton={true}
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
                    setFieldValue('language', newSelectedItems);
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
       {/* Selected Languages Display */}
     <View style={styles.tabsContainer}>
      {selectedLanguage.map(itemId => {
       const item = language.find(i => i.id === itemId);
       if (!item) return null;
        return (
      <View key={item.id} style={styles.tab}>
        <Text style={styles.tabText}>{item.name}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            const updatedItems = selectedLanguage.filter(id => id !== itemId);
            setSelectedLanguage(updatedItems);
            setFieldValue('language', updatedItems);
          }}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  })}
</View>
        {touched.language && errors.language && (
          <Text style={styles.error}>{errors.language}</Text>
        )}

        <View style={{ paddingVertical: 10 }}>
        <Text style={styles.label}>
          Service You Offered <Text style={{ color: "red" }}>*</Text>
        </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={[styles.switchContainer, { marginRight: 20 }]}>
                  <CheckBox
                    isChecked={values.isPrivateSO}
                    onClick={() => setFieldValue("isPrivateSO", !values.isPrivateSO)}
                    checkBoxColor={COLORS.unchecked} // Color when unchecked
                    checkedCheckBoxColor={COLORS.primary} // Color when checked
                 
                  />
                  <Text style={[{marginLeft:5,color:COLORS.black,fontFamily:'Poppins'}]}>Individual </Text>
                </View>
                <View style={styles.switchContainer}>
                  <CheckBox
                    isChecked={values.isGroupSO}
                    onClick={() =>
                      setFieldValue("isGroupSO", !values.isGroupSO)
                    }
                    checkBoxColor={COLORS.unchecked} // Color when unchecked
                    checkedCheckBoxColor={COLORS.primary} // Color when checked
                 
                  />
                  <Text style={[{marginLeft:5,fontFamily:'Poppins'}]}>Group</Text>
                </View>
              </View>
            </View>

        {/* Conditional rendering of price input fields */}
        {/* {values.isPrivateSO && ( 
          <>
            <View style={{ marginTop: 10 }}>
              <Input
                label="Price per Individual Class"
                value={values.pricePerIndividualClass}
                onChangeText={handleChange("pricePerIndividualClass")}
                onBlur={handleBlur("pricePerIndividualClass")}
                placeholder="Enter price per individual class"
                keyboardType="numeric"
                error={
                  touched.pricePerIndividualClass &&
                  errors.pricePerIndividualClass
                }
              />
            </View>
            <Input
              label="Price per Monthly Individual Class"
              value={values.pricePerMonthlyIndividualClass}
              onChangeText={handleChange("pricePerMonthlyIndividualClass")}
              onBlur={handleBlur("pricePerMonthlyIndividualClass")}
              placeholder="Enter price per monthly individual class"
              keyboardType="numeric"
              error={
                touched.pricePerMonthlyIndividualClass &&
                errors.pricePerMonthlyIndividualClass
              }
            />
          </>
        )} */}
        {/* {values.isGroupSO && ( 
          <>
            <Input
              label="Price per Group Class"
              value={values.pricePerGroupClass}
              onChangeText={handleChange("pricePerGroupClass")}
              onBlur={handleBlur("pricePerGroupClass")}
              placeholder="Enter price per group class"
              keyboardType="numeric"
              error={touched.pricePerGroupClass && errors.pricePerGroupClass}
            />
            <Input
              label="Price per Monthly Group Class"
              value={values.pricePerMonthlyGroupClass}
              onChangeText={handleChange("pricePerMonthlyGroupClass")}
              onBlur={handleBlur("pricePerMonthlyGroupClass")}
              placeholder="Enter price per monthly group class"
              keyboardType="numeric"
              error={
                touched.pricePerMonthlyGroupClass &&
                errors.pricePerMonthlyGroupClass
              }
            />
          </>
        )} */}

       

      
        <View style={styles.buttonContainer}>
        <Button
          title={
             isSubmitting ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={styles.indicator}
              />
            ) : (
              "Next"
            )
          }
          onPress={handleSubmit}
        />
        </View>
      </View>
    </ScrollView>
  )};
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Add Your New Listing"} icon={icons.back} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={{ paddingHorizontal: 20 }}>{renderProgressBar()}</View>
          <Formik
            initialValues={{
            
              certification: certification,
              bio: bio,
              specialisations: selectedSpecialisations,
            
              language: selectedLanguage,
              yogaFor:yogaFor,
              tutorName:tutorName,
              isPrivateSO: false,
              isGroupSO: false,
            }}
            validationSchema={
              
                step === 1 ? stepOneValidationSchema
                  : step === 2 ? stepTwoValidationSchema
                  : step === 3 ? stepThreeValidationSchema
                  : step === 4 ? stepFourValidationSchema       
                   : stepFiveValidationSchema
              }            
            onSubmit={async (values, { setSubmitting }) => {
              
              if (step === 1) {
                // Submit Step 1 data
              

        if (!values.isPrivateSO && !values.isGroupSO) {
        ToastAndroid.show("Please select at least one service offered.", ToastAndroid.SHORT);
    
       
        return;
      }
    
 
  

     const specialisations = values.specialisations.map(
                  (id) => specialisationIdToName[id]
                );


             
                const languages = values.language.map(
                  (id) => languageIdToName[id]
                );
                const yogaFor = values.yogaFor.map(
                  (id) => yogaForIdToName[id]
                );

                const tutorData = {
                  instructorBio: values.bio,
                  language: languages,
                  isPrivateSO:values.isPrivateSO,
                  isGroupSO:values.isGroupSO,
                  specilization: specialisations,
                  yogaFor:yogaFor,
                  homeTutorName:values.tutorName
                };

                await dispatch(addHomeTutor(tutorData))
                  .then(async (response) => {
                    if (response.success) {
                      const newTutorId = response.data.homeTutorId;
                      setTutorId(newTutorId); // Set the newly created tutor's ID
                      ToastAndroid.show(response.message, ToastAndroid.SHORT);
            
                    
                    }
                    setStep(2);
                    setSubmitting(false);
 
                  })
                  .catch((error) => {
                    console.error("Error adding home tutor:", error);
                    setSubmitting(false);
                  });
              }  else if (step === 2)  {
                // Submit Step 2 data
                if (!name) {
                 
                  ToastAndroid.show("Service area is required", ToastAndroid.SHORT);

                  return;
                }
            
                if (!radius) {
                  ToastAndroid.show("Distance is required", ToastAndroid.SHORT);

                  return;
                }
                const locationData = {
                  id: tutorId,
                  latitude: String(location.latitude),
                  longitude: String(location.longitude),
                  locationName: name,
                  radius: String(radius),
                  unit: "km",
                };
               await dispatch(addTutorLocation(locationData))
                  .then((response) => {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);

                    setStep(3);
                    setSubmitting(false);
                  })
                  .catch((error) => {
                    console.error("Error adding tutor location:", error);
                
                    ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);

                    setSubmitting(false);
                  });
              }else if (step === 3) {
              
                const formData = new FormData();
                formData.append("id", tutorId);
        
                values.images.forEach((img, index) => {
                  formData.append("hTutorImages", {
                    uri: img.uri,
                    name: `image_${index}.jpg`,
                    type: "image/jpeg",
                  });
                });
        
               await dispatch(addTutorPhoto(formData, tutorId)).then((response) => {

               ToastAndroid.show("Home Tutor Images Added Successfully",ToastAndroid.SHORT)
                  setStep(4);
              
              
                  })
                  .catch((error) => {
                    console.error("Error adding tutor photo:", error);
                
                    ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);


                    setSubmitting(false);
                  });
            
            } else if (step === 4) {
              // Submit Step 2 data
              if (!packageType) {
                ToastAndroid.show("Package Type is required", ToastAndroid.SHORT);
                return;
              }
            
              if (!priceType) {
                ToastAndroid.show("Price Type is required", ToastAndroid.SHORT);
                return;
              }
            
              // Calculate total prices based on duration type
              let multiplier = 1; // Default multiplier
              if (packageType === "monthly 25") {
                multiplier = 25;
              } else if (packageType === "monthly 30") {
                multiplier = 30;
              } else if (packageType === "weekly 7") {
                multiplier = 7; // Assuming weekly refers to 7 days
              } else if (packageType === "weekly 6") {
                multiplier = 6; // Assuming weekly refers to 7 days
              } else if (packageType === "daily") {
                multiplier = 1;
              }
             
              const privateTotal = private_PricePerDayPerRerson
                ? parseFloat(private_PricePerDayPerRerson) * multiplier
                : 0;
            
                const groupTotal = parseFloat(group_PricePerDayPerRerson) * multiplier;

            
             
              const priceData = {
                id: tutorId,
                priceName: priceType,
                durationType: packageType,
                private_PricePerDayPerRerson: private_PricePerDayPerRerson ? private_PricePerDayPerRerson : "0",
                group_PricePerDayPerRerson: group_PricePerDayPerRerson ? group_PricePerDayPerRerson: "0",
                group_totalPricePerPerson: group_PricePerDayPerRerson  ? groupTotal.toFixed(2) : "0", 
                private_totalPricePerPerson: private_PricePerDayPerRerson ?  privateTotal.toFixed(2) :"0",
              };
            console.log("priceData :"+ JSON.stringify(priceData))
            
              await dispatch(addTutorPrice(priceData))
                .then((response) => {
                  ToastAndroid.show(response.message, ToastAndroid.SHORT);
            
                  setStep(5);
                  setSubmitting(false);
                })
                .catch((error) => {
                  const errorMessage =
                    error?.response?.data?.message || "An error occurred. Please try again.";
                  console.error("Error adding tutor price:", errorMessage);
                  ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
                  setSubmitting(false);
                });
            
           
              }else if (step === 5) {
                const id = tutorId;
              
                // Checking if all required fields are filled
                if (!startTime || !duration || !serviceType || !startDate || !numberOfPeople) {
                  ToastAndroid.show("Please fill all the fields.", ToastAndroid.SHORT);
                  console.log("Error: Missing fields.");
                  setLoading(false);
                  return;
                }
              
                const formattedStartTime = formatTime(startTime);
                console.log("Formatted Start Time: ", formattedStartTime);
              
                // Checking if any service areas are selected
                if (selectedServiceAreas.length === 0) {
                  ToastAndroid.show("Please select at least one service area.", ToastAndroid.SHORT);
                  console.log("Error: No service areas selected.");
                  setLoading(false);
                  return;
                }
              
                let newServiceArea = {};
                selectedServiceAreas.forEach((val) => {
                  const selectedLocation = serviceAreaLocations.find((location) => location.value === val);
                  if (selectedLocation) {
                    newServiceArea = {
                      key: selectedLocation.key,
                      locationName: selectedLocation.value,
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      radius: 1000, // Default radius or dynamically calculated
                      unit: "km",
                      pincode: selectedLocation.pincode || null, // Use dynamic pincode if available
                      deletedAt: null,
                      homeTutorId: tutorId,
                    };
                  }
                });
                const serviceAreaId = newServiceArea.key;
                console.log("Selected Service Area ID: ", serviceAreaId);
              
                const classMode = mode === "Online";
                console.log("Class Mode (Online): ", classMode);
              
                try {
                  // Check available seats based on service type
                  const maxSeats = serviceType === "Group" ? 10 : 1;
                  const availableSeat = serviceType === "Private" ? 1 : maxSeats - parseInt(numberOfPeople, 10);
                  console.log("Available Seats: ", availableSeat);
              
                  if (availableSeat < 0) {
                    ToastAndroid.show("Invalid number of people for selected service type.", ToastAndroid.SHORT);
                    console.log("Error: Invalid number of people.");
                    setSubmitting(false);
                    return;
                  }
              
                  // Checking if price ID is selected
                  if (!selectedPriceId) {
                    ToastAndroid.show("Please select a price.", ToastAndroid.SHORT);
                    console.log("Error: No price selected.");
                    setLoading(false);
                    return;
                  }
              
                  // Calculate the endDate based on the selected duration
                  let calculatedEndDate = endDate;
              
                  if (selectedDuration) {
                    const [period, days] = selectedDuration.split(" "); // Extract period (e.g., "monthly", "weekly") and number of days
                    const numberOfDays = parseInt(days, 10); // Convert the number of days to integer
                    console.log(`Parsed Duration - Period: ${period}, Days: ${numberOfDays}`);
              
                    if (!isNaN(numberOfDays)) {
                      // If the duration is valid (has number of days)
                      calculatedEndDate = new Date(startDate); // Start date
                      calculatedEndDate.setDate(calculatedEndDate.getDate() + numberOfDays); // Add the number of days
                      console.log("Calculated End Date: ", calculatedEndDate);
                    } else {
                      // If the duration is invalid (e.g., cannot parse the number of days)
                      calculatedEndDate = endDate; // Keep the original endDate
                      console.log("Error: Invalid duration format.");
                    }
                  }
              
                  // Construct the payload dynamically
                  const payload = {
                    id: tutorId,
                    startTime: formattedStartTime,
                    startDate: startDate.toISOString().split("T")[0], // Format start date to string (YYYY-MM-DD)
                    endDate: calculatedEndDate.toISOString().split("T")[0], // Use dynamically calculated endDate
                    timeDurationInMin: parseInt(duration, 10),
                    serviceType,
                    serviceAreaId: serviceAreaId,
                    availableSeat: availableSeat.toString(),
                    isOnline: classMode,
                    priceId: selectedPriceId, // Include selectedPriceId
                  };
              
                  console.log("Payload being sent to API: ", payload);
              
                  // Dispatching API call
                  const res = await dispatch(addTimeSlot(payload));
              
                  if (res.success) {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    console.log("Success: ", res.message);
                    setSubmitting(false);
                    navigation.navigate("Home");
                  } else {
                    const errorMessage =
                      res.message === "Please select appropriate date!"
                        ? "Please select appropriate date and time."
                        : res.message;
                    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
                    console.log("Error: ", errorMessage);
                    setSubmitting(false);
                  }
                } catch (error) {
                  // Check if error response structure contains message
                  const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
                  console.error("Error adding tutor timeslot:", errorMessage);
                  ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
                  setSubmitting(false);
                }
              }
          }
        }
            
    
          
            
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              isSubmitting,
            }) => (
              <View style={{ flex: 1 }}>
                     {step === 1
                  ? renderStepOne({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      isSubmitting,
                    })
                  : step === 2
                  ? renderStepTwo({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isSubmitting,
                    })
                  : step === 3
                  ? renderStepThree({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                      values,
                      errors,
                      touched,
                      isSubmitting,
                    })
                    : step === 4
                    ? renderStepFour({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        values,
                        errors,
                        touched,
                        isSubmitting,
                      })
                  : renderStepFive({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isSubmitting,
 
                    })}
              </View>
            )}
          </Formik>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
  
flex:1,justifyContent:'flex-end'

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
  styleInputGroup: {
    borderWidth: 0, // Remove underline from input group
    borderBottomWidth : 0,
    paddingVertical:10,
   marginLeft:0,
  //  padding:8,
   paddingHorizontal :0
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepContainer: {
    padding: 20,
    flex:1
  },
 
  deleteIconContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -15,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
    // marginBottom:4,
    color:COLORS.primary
  },
  fontSize :{
    fontSize: hp(1.9),  
    fontFamily: "Poppins",
    color:'red'
  },
  input: {
    // borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    fontFamily: "Poppins",
    color: "#000",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  autocompleteContainer: {
    zIndex: 1,
    width: "100%",
    marginVertical: 10,
  },
  styleDropdownMenuSubsection: {
    borderWidth: 0, // Remove underline from dropdown menu subsection
    borderBottomWidth : 0,
    paddingVertical:10,
    paddingHorizontal:0
  },
  styleMainWrapper: {
    borderWidth: 1,
    borderColor: COLORS.icon_background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical:0
  },
  row: {
    flexDirection: "row",
    // alignItems: "flex-start",
    // paddingVertical: 2,
    // marginLeft:-5
    // paddingHorizontal: 5,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius:8,
    marginVertical: 20,
  },
  distanceButton: {
    padding: 10,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selectedDistanceButton: {
    backgroundColor: "rgba(102, 42, 178, 1)",
    borderColor: "rgba(102, 42, 178, 1)",
  },
  unselectedDistanceButton: {
    backgroundColor: "#fff",
    borderColor: "lightgray",
  },
  distanceButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  selectedDistanceButtonText: {
    color: "#fff",
  },
  unselectedDistanceButtonText: {
    color: "#000",
  },
  distanceList: {
    paddingHorizontal: 0,
    justifyContent: "space-between",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  progressBar: {
    backgroundColor: "#ccc",
    height: 3,
    flex: 1,
    width:50,
    marginHorizontal: 8,
    borderRadius: 5,
  },
  progressBarActive: {
    backgroundColor: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop:10
  },
  cameraContainer: {
    width: wp(90),
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle :'dashed',
    marginTop: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  cameraImage: {
    width: 30,
    height: 30,
  },
  cameraText: {
    fontSize: hp(2),
    fontFamily: "Poppins_Medium",
    textAlign: "center",
    marginTop:12,
    color:COLORS.primary
  },
  timePickerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    fontFamily:'Poppins',
    marginVertical: 5,
  },
  timePickerText: {
    color: "#333",
    fontSize: 16,
  },
  dropdown: {
    marginVertical: 5,
  },
  timeSlotList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  timeSlotItem: {
    width: "30%",
    marginVertical: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  selectedSlot: {
    backgroundColor: "rgba(102, 42, 178, 1)",
  },
  unselectedSlot: {
    backgroundColor: "#fff",
    borderColor: "gray",
    borderWidth: 1,
  },
  selectedSlotText: {
    color: "white",
  },
  unselectedSlotText: {
    color: "black",
  },
});

export default HomeTutor;
