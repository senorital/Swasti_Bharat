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
  BackHandler,Image,ToastAndroid
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
  getTutorQualification,addTutorPhoto,addTimeSlot
} from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import * as ImagePicker from "expo-image-picker";
import {  getServiceArea } from "../../../../redux/actions/instructor/homeTutor/homeTutor";

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

const yogaItems = [
  { id: "1", name: "Yoga For Parents" },
  { id: "2", name: "Yoga For Children" },
  { id: "3", name: "Yoga For Pregnant Woman" },
];

const HomeTutor = ({ navigation }) => {
  const totalSteps = 4;
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
  const [selectedSlots, setSelectedSlots] = useState([]);
  const handleSelectDistance = (value) => {
    setRadius(value);
  };
  // const [numberOfPeople, setNumberOfPeople] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [serviceAreaLocations, setServiceAreaLocations] = useState([]);
  const [serviceAreaLocation, setServiceAreaLocation] = useState(""); // Track selected service area
  const [selectedServiceAreas, setSelectedServiceAreas] = useState([]); // Array to store selected service areas
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
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
        // console.log(res.data.qualifications);
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

  // useEffect(() => {
  //   // Fetch service areas when the component mounts
  //   fetchServiceAreas(tutorId); // Pass id into fetchServiceAreas
  // }, [tutorId]);

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
    acc[item.id] = item.name;
    return acc;
  }, {});


  const handleLocationSelect = (data, details) => {
    // const locationName=details?.formatted_address;
    console.log(details.formatted_address);
    const { lat, lng } = details.geometry.location;
    setLocation({
      latitude: parseFloat(lat.toFixed(7)),
      longitude: parseFloat(lng.toFixed(7)),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setName(details.formatted_address);
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

  console.log(location);

  useEffect(() => {
    // Enable submit button only if radius, name, latitude, and longitude are set and not default
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


  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets);
    if (!result.cancelled) {
      setFieldValue("images", result.assets);
    }
  };

  const handleRemoveImage = (index, values, setFieldValue) => {
    const newImages = [
      ...values.images.slice(0, index),
      ...values.images.slice(index + 1),
    ];
    setFieldValue("images", newImages);
  };

 
  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "rgba(102, 42, 178, 1)",
      customTextStyle: {
        color: "orange",
      },
    },
  };

  const today = new Date();
  const nextSixDays = new Date();
  nextSixDays.setDate(today.getDate() + 2);

  const minDate = today.toISOString().split("T")[0];
  const maxDate = nextSixDays.toISOString().split("T")[0];

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleStartTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  
  const createTimeSlots = () => {
    if (!startTime || !endTime || !duration) {
     
      ToastAndroid.show("Please select start time, end time, and duration.", ToastAndroid.SHORT);

      return;
    }

    let start = new Date(startTime);
    const end = new Date(endTime);
    const slots = [];
    const durationInMinutes = parseInt(duration, 10);

    while (start < end) {
      const endSlot = new Date(start.getTime() + durationInMinutes * 60000);
      if (endSlot <= end) {
        slots.push({ start: new Date(start), end: endSlot });
      }
      start = endSlot;
    }

    setTimeSlots(slots);
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
    console.log('Selected Value:', val); // Log the selected value
  
    // Check if the service area is already selected
    const isAlreadySelected = selectedServiceAreas.includes(val);
    
    if (isAlreadySelected) {
        // If it is already selected, remove it from the array
        setSelectedServiceAreas(selectedServiceAreas.filter(area => area !== val));
        console.log('Removed Service Area:', val);
    } else {
        // If not selected, add to the array
        setSelectedServiceAreas([...selectedServiceAreas, val]);
        console.log('Added Service Area:', val);
    }
  
    // Find the corresponding location details
    const selectedLocation = serviceAreaLocations.find(location => location.value === val);
    
    if (selectedLocation) {
        console.log('Selected Location:', selectedLocation); // Log the selected location
        // You might want to update the selected location details as well
        setSelectedLocationDetails(selectedLocation); // Update state with the selected location details
    } else {
        console.log('Location not found for:', val);
        setSelectedLocationDetails(null); // Clear if not found
    }
  };

  const handleDurationChange = (selectedDuration) => {
    setDuration(selectedDuration);
  
    // // Generate slots if start time is already set
    // if (startTime) {
    //   generateTimeSlots(startTime, selectedDuration);
    // }
  };

 
  console.log("TUTORDID :" + tutorId)
  const fetchServiceAreas = async (tutorId) => {
    try {

      const res = await dispatch(getServiceArea(tutorId)); 
      console.log("response service area:" + res)
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

  

  const renderStepFour = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
  }) => (
    fetchServiceAreas(tutorId), // Pass id into fetchServiceAreas

    <View style={[styles.stepContainer]}>
      <View style={{ }}>
        <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
             Service Area Location
            </Text>
            <SelectList
            setSelected={handleSelection}
           data={serviceAreaLocations}
              save="value"
              placeholder="Select Service Area Location"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Service Type
            </Text>
            <SelectList
              setSelected={handleServiceTypeChange}
              data={serviceTypeItems}
              save="value"
              placeholder="Select Service Type"
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
          style={[styles.timePickerButton,{width:SCREEN_WIDTH/2.3}]}
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

          {/* <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
             End Date
            </Text>
            <TextInput
                   style={styles.timePickerButton}
                value={numberOfPeople}
                onChangeText={setNumberOfPeople}
                placeholder="Enter number of people"
                keyboardType="numeric"
              />
          </View> */}
            <View style={{ marginTop: 10,marginLeft:10 }}>
        <Text style={styles.label}>
          End Date
        </Text>
        <TouchableOpacity
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
          onConfirm={(selectedDate) => {
            setOpenEnd(false);
            setEndDate(selectedDate); 
          }}
          onCancel={() => {
            setOpenEnd(false);
          }}
        />
      </View>
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
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime || new Date()}
                mode="time"
                display="default"
                onChange={handleStartTimeChange}
              />
            )}
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
          

          {timeSlots.length > 0 && (
  <View style={styles.timeSlotList}>
    {timeSlots.map((slot, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.timeSlotItem,
          selectedSlot === index ? styles.selectedSlot : styles.unselectedSlot,
        ]}
        onPress={() => handleSlotSelect(index)}
      >
        <Text
          style={
            selectedSlot === index
              ? styles.selectedSlotText
              : styles.unselectedSlotText
          }
        >
          {`${formatTime(slot.start)} - ${formatTime(slot.end)}`}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}

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
         </View>

    </View>
  );



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
          textInputProps={{
            style: {
              borderColor: touched.location && errors.location ? "red" : "#000",
              borderWidth: 1,
              height: 40,
              borderRadius: 5,
              paddingHorizontal: 10,
              width: "100%",
            },
          }}
          styles={{
            container: { flex: 0 },
            listView: { zIndex: 1000 },
          }}
        />
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
    <View style={styles.stepContainer}>
      <View style={styles.autocompleteContainer}>
        <Text style={styles.label}>Add Tutor Photos</Text>
        <Text style={styles.fontSize}>* Maximum 3 photos can be selected</Text>
  
        <View>
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
          {errors.images && touched.images && (
            <Text style={styles.errorText}>{errors.images}</Text>
          )}
        </View>
        <View
          style={{ width: wp(90), marginTop: 10, marginRight: 10 }}
        >
          <FlatList
            data={values.images}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  handleRemoveImage(index, values, setFieldValue)
                }
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: wp(40),
                    height: hp(20),
                    borderRadius: 5,
                    marginHorizontal: 5,
                  }}
                />
              </TouchableOpacity>
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
        onPress={handleSubmit}
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
    console.log('Rendering Step One. isSubmitting:', isSubmitting);

    return (
      
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.stepContainer}>
        
        <Input
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
        />
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
        {values.isPrivateSO && ( // '2' for 'Private Session'
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
        )}
        {values.isGroupSO && ( // '1' for 'Group Classes'
          <>
            {/* <View style={{marginTop:10}}> */}
            <Input
              label="Price per Group Class"
              value={values.pricePerGroupClass}
              onChangeText={handleChange("pricePerGroupClass")}
              onBlur={handleBlur("pricePerGroupClass")}
              placeholder="Enter price per group class"
              keyboardType="numeric"
              error={touched.pricePerGroupClass && errors.pricePerGroupClass}
            />
            {/* </View> */}
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
     {/* Selected Yoga For Display */}
<View style={styles.tabsContainer}>
  {yogaFor.map(itemId => {
    const item = yogaItems.find(i => i.id === itemId);
    if (!item) return null;
    return (
      <View key={item.id} style={styles.tab}>
        <Text style={styles.tabText}>{item.name}</Text>
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
              // services: selectedServices,
              pricePerIndividualClass: "",
              pricePerMonthlyIndividualClass: "",
              pricePerGroupClass: "",
              pricePerMonthlyGroupClass: "",
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
                  : stepFourValidationSchema
              }            
            onSubmit={async (values, { setSubmitting }) => {
              
              if (step === 1) {
                // Submit Step 1 data
              

        if (!values.isPrivateSO && !values.isGroupSO) {
        ToastAndroid.show("Please select at least one service offered.", ToastAndroid.SHORT);
    
       
        return;
      }
       if (values.isPrivateSO && !values.pricePerIndividualClass) {
 
      ToastAndroid.show('Please enter price per individual class.', ToastAndroid.SHORT);

    
      return;
    } 
    if (values.isPrivateSO && !values.pricePerMonthlyIndividualClass) {
      ToastAndroid.show("Please enter price per Monthly", ToastAndroid.SHORT);

    
      return;
    }
    if (values.isGroupSO && !values.pricePerGroupClass) {
     
      ToastAndroid.show("Please enter price per individual class.", ToastAndroid.SHORT);

    
      return;
    } 
    if (values.isGroupSO && !values.pricePerMonthlyGroupClass) {

      ToastAndroid.show("Please enter price per Monthly", ToastAndroid.SHORT);

    
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

                if (
                  values.pricePerIndividualClass !== undefined &&
                  values.pricePerIndividualClass !== ""
                ) {
                  tutorData.privateSessionPrice_Day =
                    values.pricePerIndividualClass;
                }

                if (
                  values.pricePerMonthlyIndividualClass !== undefined &&
                  values.pricePerMonthlyIndividualClass !== ""
                ) {
                  tutorData.privateSessionPrice_Month =
                    values.pricePerMonthlyIndividualClass;
                }

                if (
                  values.pricePerGroupClass !== undefined &&
                  values.pricePerGroupClass !== ""
                ) {
                  tutorData.groupSessionPrice_Day = values.pricePerGroupClass;
                }

                if (
                  values.pricePerMonthlyGroupClass !== undefined &&
                  values.pricePerMonthlyGroupClass !== ""
                ) {
                  tutorData.groupSessionPrice_Month =
                    values.pricePerMonthlyGroupClass;
                }
                console.log(tutorData);
                dispatch(addHomeTutor(tutorData))
                  .then((response) => {
                    console.log(response);
                    setTutorId(response.data.homeTutorId); // assuming response.data.id is the new tutor's ID
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);

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
                console.log(locationData);
                dispatch(addTutorLocation(locationData))
                  .then((res) => {
                    console.log(res);
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);

                    setStep(3);
                    setSubmitting(false);
                    // navigation.navigate("Home");
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
        
                console.log("FormData:", formData);
               await dispatch(addTutorPhoto(formData, tutorId)).then((res) => {
        
                if (res) {

                  ToastAndroid.show("Home Tutor Images Added Successfully",ToastAndroid.SHORT)
                  // console.log(res.message)

              } 
                setStep(4);
               setSubmitting(false);
                  })
                  .catch((error) => {
                    const msg = error.res.message;
                    ToastAndroid.show(msg,ToastAndroid.SHORT);

                    setSubmitting(false);
                  });
            
            }else if (step === 4) {
              const id = tutorId;
              if (!startTime || !duration || !serviceType || !startDate || !endDate || !numberOfPeople) {
                ToastAndroid.show("Please fill all the fields.", ToastAndroid.SHORT);
                console.log('Missing required fields: ', {
                    startTime,
                    duration,
                    serviceType,
                    startDate,
                    endDate,
                    numberOfPeople,
                });
                setLoading(false);
                return;
            }
            
            // Format selected time slots
            const formattedStartTime = formatTime(startTime); // Assuming `selectedSlot.start` is the time you want to format
            console.log('Formatted Start Time:', formattedStartTime);
            
            if (selectedServiceAreas.length === 0) {
                ToastAndroid.show("Please select at least one service area.", ToastAndroid.SHORT);
                console.log('No service area selected');
                setLoading(false);
                return;
            }
            
            let newServiceArea = {};
            selectedServiceAreas.forEach(val => {
                const selectedLocation = serviceAreaLocations.find(location => location.value === val);
                if (selectedLocation) {
                    newServiceArea = {
                        key: selectedLocation.key,
                        locationName: selectedLocation.value,
                        latitude: selectedLocation.latitude,
                        longitude: selectedLocation.longitude,
                        radius: 3,  // Default radius value can be adjusted
                        unit: 'm'   // Default unit
                    };
                }
            });
            
            console.log("New Service Area:", newServiceArea);
            
            const serviceAreaId = newServiceArea.key;
            
            // Construct the payload to send
            const payload = {
                startTime: formattedStartTime,
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
                timeDurationInMin: parseInt(duration, 10),
                serviceType,
                serviceAreaId,
                noOfPeople: parseInt(numberOfPeople, 10),
                id: id,
            };
            
            // Log the payload for testing
            console.log("Payload to be sent:", payload);
            
            // API call - dispatching addTimeSlot with the payload
            try {
                const res = await dispatch(addTimeSlot(payload));
                console.log('Response from addTimeSlot:', res);
            
                if (res.success) {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    console.log('Success message:', res.message);
                    setSubmitting(false);
                    navigation.goBack();
                } else {
                    if (res.message === "Please select appropriate date!") {
                        ToastAndroid.show("Please select appropriate date and time.", ToastAndroid.SHORT);
                    } else {
                        console.log('Error response received:', res.message);
                        ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    }
                    setSubmitting(false);
                }
            } catch (error) {
                console.error("Error adding tutor timeslot:", error.message);
                ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);
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
                  : renderStepFour({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
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
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_Medium",
    fontWeight: "600",
    marginBottom:7,
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
  map: {
    width: "100%",
    height: 300,
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
    width:120,
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
