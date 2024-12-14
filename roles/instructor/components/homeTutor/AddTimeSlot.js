import React, { useState,useEffect,useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  BackHandler,Platform,
  ToastAndroid,Modal,FlatList
} from "react-native";
import Toast from "react-native-toast-message";
import { Calendar } from "react-native-calendars";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../../../components/header/Header";
import Button from "../../../../components/button/Button";
import { addTimeSlot, addTutorLocation, addTutorPrice, getServiceArea } from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import DatePicker from 'react-native-date-picker';
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { startGeofencingAsync } from "expo-location";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "../../../../profile/apiKey";
import MapView, { Marker, Circle } from "react-native-maps";
import { getPrice } from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import CustomTimePickerWithClock from "../../../../components/customPicker/CustomTimePicker";
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

const classmodeType=[
  {key:'Online',value:'Online'},
  {key:'Offline',value:'Offline'}
]
const distances = [
  { id: 1, label: "1 km", value: 1000 },
  { id: 2, label: "3 km", value: 3000 },
  { id: 3, label: "5 km", value: 5000 },
  { id: 4, label: "10 km", value: 10000 },
];

const CustomHeader = () => (
  <View style={{ backgroundColor: "red", padding: 20 }}>
    <Text style={{ color: "#3498db", fontSize: 18 }}>Pick a Date</Text>
  </View>
);
const defaultLocation = {
  latitude: 28.6139, // Latitude for New Delhi
  longitude: 77.2090, // Longitude for New Delhi
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
const themeColor = "#3498db"; // Replace with your desired theme color

const AddTimeSlot = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const today1 = new Date();
 
  const todayDateString = today1.toISOString().split("T")[0];

  const { id } = route.params;
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [mode, setMode] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceType,setServiceType]=useState('');
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [serviceAreaLocations, setServiceAreaLocations] = useState([]);
  const [selectedServiceAreas, setSelectedServiceAreas] = useState([]); // Array to store selected service areas
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [location, setLocation] = useState(defaultLocation);
  const autocompleteRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showAddPriceModal, setShowAddPriceModal] = useState(false);

  const [radius, setRadius] = useState(null);
  const [name, setName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [PriceData, setPriceData] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState(null); // Store the selected package ID
  const [selectedDuration, setSelectedDuration] = useState(""); // Store the selected package duration
  const [priceType,setpriceType]=useState('');
  const [packageType,setpackageType]=useState('');
  const [private_PricePerDayPerRerson, setprivate_PricePerDayPerRerson] = useState("");
  const [group_PricePerDayPerRerson, setgroup_PricePerDayPerRerson] = useState("");

  
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


  const showDatePicker = () => setDatePickerVisibility(true);

  const hideDatePicker = () => {
    setShowStartTimePicker(false); // Close the modal
  };
  const handleConfirm = (time) => {
    // Get the current time
    const currentTime = new Date();
    const adjustedTime = new Date(currentTime);
    adjustedTime.setHours(time.getHours(), time.getMinutes(), 0, 0);  
    setShowStartTimePicker(false);
  
    if (startDate && startDate.toDateString() === currentTime.toDateString()) {
      if (adjustedTime < currentTime) {
        alert("Please select a future time.");
        return; // Stop further execution if time is in the past
      }
    }
  
    // If everything is okay, set the start time
    setStartTime(adjustedTime);
  };
  
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
       
        ToastAndroid.show("Failed to fetch price.",ToastAndroid.SHORT)
      }
    } catch (error) {
     
      ToastAndroid.show("Failed to fetch price.",ToastAndroid.SHORT)

    }
  };

  const fetchServiceAreas = async (id) => {
    try {
      const res = await dispatch(getServiceArea(id)); // Call fetchServiceAreas with id
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
    // Call both functions when the component mounts or `id` changes
    fetchServiceAreas(id);
    fetchPrice(id);
  }, [id]);


  useEffect(() => {
    if (startDate) {
    }
  }, [startDate]);
  
const handleLocationSelect = (data, details) => {
  // const locationName=details?.formatted_address;
  const { lat, lng } = details.geometry.location;
  setLocation({
    latitude: parseFloat(lat.toFixed(7)),
    longitude: parseFloat(lng.toFixed(7)),
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  setName(details.formatted_address);
  autocompleteRef.current?.setAddressText(details.formatted_address);

};

    const handleServiceTypeChange = (value) => {
      setServiceType(value);
      if (value === "Private") {
        setNumberOfPeople("1");
      } else {
        setNumberOfPeople("");
      }
    };

  const handleSubmit = async () => {
    try {
        
      

        setLoading(true);
       if (!startTime || !duration || !serviceType || !startDate || !endDate || !numberOfPeople || !mode) {
            ToastAndroid.show("Please fill all the fields.", ToastAndroid.SHORT);
          
            setLoading(false);
            return;
        }
        
        // Format selected time slots
        const formattedStartTime = formatTime(startTime); // Assuming `selectedSlot.start` is the time you want to format

        

      if (selectedServiceAreas.length === 0) {
        ToastAndroid.show("Please select at least one service area.", ToastAndroid.SHORT);
        setLoading(false);
        return;
    }

    let newServiceArea = {};
        selectedServiceAreas.forEach(val => {
            const selectedLocation = serviceAreaLocations.find(location => location.value === val);
            if (selectedLocation) {
                newServiceArea = {
                  key : selectedLocation.key,
                    locationName: selectedLocation.value,
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    radius: 3,  // Default radius value can be adjusted
                    unit: 'm'   // Default unit
                };
            }
        });

      
        const serviceAreaId = newServiceArea.key;
        const classMode = (mode === 'Online') ? true : false;
     
          const maxSeats = serviceType === "Group" ? 10 : 1;
          const availableSeat = serviceType === "Private" ? 1 : maxSeats - parseInt(numberOfPeople, 10);
          if (availableSeat < 0) {
          ToastAndroid.show("Invalid number of people for selected service type.", ToastAndroid.SHORT);
            setSubmitting(false);
            return;
          }

          if (!selectedPriceId) {
            ToastAndroid.show("Please select a price.", ToastAndroid.SHORT);
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
      

        const payload = {
            startTime: formattedStartTime,
            startDate: new Date(startDate).toISOString().split("T")[0],
            endDate: calculatedEndDate.toISOString().split("T")[0], // Use dynamically calculated endDate
            timeDurationInMin: parseInt(duration, 10),
            serviceType,
            serviceAreaId,
            availableSeat: availableSeat.toString(),
            id : id,
            isOnline : classMode,
            priceId: selectedPriceId, // Include selectedPriceId

        };
         console.log("payload :"+  JSON.stringify(payload))

        const res = await dispatch(addTimeSlot(payload));


        if (res.success) {
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
          navigation.goBack();
      } else {
          // Check for specific error message
          if (res.message === "Please select appropriate date!") {
              ToastAndroid.show("Please select appropriate date and time.", ToastAndroid.SHORT);
          } else {
              ToastAndroid.show(res.message, ToastAndroid.SHORT);
          }
        
      }

    }
    catch (error) {
        // If an error occurs during the process, show an error message
        ToastAndroid.show(error.message || "Something went wrong.", ToastAndroid.SHORT);
        console.error('Error in handleSubmit:', error);
    } finally {
        setLoading(false);
    }
  
};  

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

const handlepackageType = (value) => {
  setpackageType(value);
 
};

const handlepriceType = (value) => {
  setpriceType(value);
 
};

  const formatTime = (time) => {
    if (!time) return "";
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
 

  const handleClassMode = (selected) => {
  setMode(selected);  
    // // Generate slots if start time is already set
    // if (startTime) {
    //   generateTimeSlots(startTime, selectedDuration);
    // }
  };


const handleDurationChange = (selectedDuration) => {
  setDuration(selectedDuration);

  // // Generate slots if start time is already set
  // if (startTime) {
  //   generateTimeSlots(startTime, selectedDuration);
  // }
};

const handleSelection = (val) => {

  const isAlreadySelected = selectedServiceAreas.includes(val);
  
  if (isAlreadySelected) {
      // If it is already selected, remove it from the array
      setSelectedServiceAreas(selectedServiceAreas.filter(area => area !== val));
  } else {
      // If not selected, add to the array
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

const handleSelectDistance = (value) => {
  setRadius(value);
};

const handleAddLocationPress = () => setShowAddLocationModal(true);
const handleAddPricePress = () => setShowAddPriceModal(true);


const handlePriceAdd = async () => {
  try {

    setLoading(true);

    // Validate inputs
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
    switch (packageType) {
        case "monthly 25":
            multiplier = 25;
            break;
        case "monthly 30":
            multiplier = 30;
            break;
        case "weekly 7":
            multiplier = 7;
            break;
        case "weekly 6":
            multiplier = 6;
            break;
        case "daily":
            multiplier = 1;
            break;
        default:
            ToastAndroid.show("Invalid Package Type", ToastAndroid.SHORT);
            return;
    }

    const privateTotal = private_PricePerDayPerRerson
        ? parseFloat(private_PricePerDayPerRerson) * multiplier
        : 0;

    const groupTotal = parseFloat(group_PricePerDayPerRerson) * multiplier;


    // Prepare price data for dispatch
    const priceData = {
        id: id,
        priceName: priceType,
        durationType: packageType,
        private_PricePerDayPerRerson: private_PricePerDayPerRerson,
        group_PricePerDayPerRerson: group_PricePerDayPerRerson,
        group_totalPricePerPerson: groupTotal.toFixed(2),
        private_totalPricePerPerson: privateTotal.toFixed(2),
    };


    // Dispatch addTutorPrice action
    const response = await dispatch(addTutorPrice(priceData));
    ToastAndroid.show(response.message, ToastAndroid.SHORT);
  

} catch (error) {
    // Handle any errors that occur
    const errorMessage =
        error?.response?.data?.message || error.message || "Something went wrong.";
    console.error('Error in handleSubmit:', errorMessage);
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
} finally {
    setLoading(false);
}

setShowAddPriceModal(false);

};

const handleLocationAdd = async () => {
  setLoading(true);
  if (!name) {
    Toast.show({
      type: "error",
      text1: "Service area is required",
      visibilityTime: 2000,
      autoHide: true,
    });
    setSubmitting(false);
    return;
  }

  if (!radius) {
    Toast.show({
      type: "error",
      text1: "Distance is required",
      visibilityTime: 2000,
      autoHide: true,
    });
    setSubmitting(false);
    return;
  }
  const locationData = {
    id: id,
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    locationName: name,
    radius: String(radius),
    unit: "km",
  };
  dispatch(addTutorLocation(locationData))
    .then((res) => {
      ToastAndroid.show(res.message,ToastAndroid.SHORT)
      fetchServiceAreas(id);
    })
    .catch((error) => {
      console.error("Error adding tutor location:", error);
      ToastAndroid.show('An error occurred. Please try again.',ToastAndroid.SHORT)

    });
  setLoading(false);
  setShowAddLocationModal(false);
};

const handleSelectionprice = (selectedKey) => {
  setSelectedPriceId(selectedKey); // Save selected package ID
  const selectedPackage = PriceData.find((item) => item.key === selectedKey);
  if (selectedPackage) {
    setSelectedDuration(selectedPackage.duration); // Save selected package duration
  }
};

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <StatusBar backgroundColor={COLORS.primary} style="light" />
          <View style={{ paddingTop: 20 }}>
        <Header
          title={"Add Time Slot"}
          icon={icons.back}
        />
      </View>

   
       <ScrollView>

        <View style={{ paddingHorizontal: 15 }}>
        <View style={{ marginTop: 10 }}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.label}>
             Service Area Location
            </Text>
            <TouchableOpacity onPress={handleAddLocationPress} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Location</Text>
          </TouchableOpacity>
          </View>
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
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.label}>
             Pacakge Type
            </Text>
            <TouchableOpacity onPress={handleAddPricePress} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Price</Text>
          </TouchableOpacity>
          </View>
            <SelectList
            setSelected={handleSelectionprice}
           data={PriceData}
              save="key"
        
              placeholder="Select Package Type"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>
        
       

        {/* Modal for Adding Location */}
        <Modal visible={showAddLocationModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Location</Text>
              <View style={styles.autocompleteContainer}>
              <GooglePlacesAutocomplete
           ref={autocompleteRef}

          placeholder="Search by location"
          onPress={handleLocationSelect}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          fetchDetails={true}
          textInputProps={{
            style: {
              borderColor:  "#000",
              borderWidth: 1,
              height: 40,
              borderRadius: 5,
              paddingHorizontal: 10,
              width: "100%",
            },
          }}
          styles={{
            container: { flex: 0 },
            listView: { 
              position: 'absolute', 
              top: 45, 
              zIndex: 10, 
              elevation: 10 // For Android
            },
          }}
        />
        </View>
             
              <View>
              {location && (
        <View style={styles.mapWrapper}>
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
      <View style={{alignContent:'center'}}>
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
      </View>
        </View>
        <View style={{ flexDirection: 'row',marginTop:20 }}>
  <TouchableOpacity
    onPress={handleLocationAdd}
    style={{
      backgroundColor: COLORS.directions,
      padding: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      height:40,
      width:'49%'
    }}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <Text style={{ color: '#fff',fontFamily:'Poppins',fontSize:13 }}>Add Location</Text>
    )}
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setShowAddLocationModal(false)}
    style={{
      padding: 5,
      borderRadius: 5,
      borderColor:COLORS.directions,
      borderWidth:1,
      alignItems: 'center',
      justifyContent: 'center',
      width:'49%',
      height:40,
    }}
  >
    <Text style={{ color: COLORS.primary,fontFamily:'Poppins',fontSize:13  }}>Cancel</Text>
  </TouchableOpacity>
</View>
              </View>
            </View>
          
        </Modal>

       {/* Modal for Adding Price */}

       <Modal visible={showAddPriceModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Price</Text>
             
              <View style={{}}>
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
          

      
         
        </View>
        
        
        <View style={{ flexDirection: 'row',marginTop:20 }}>
  <TouchableOpacity
    onPress={handlePriceAdd}
    style={{
      backgroundColor: COLORS.directions,
      padding: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      height:40,
      width:'49%'
    }}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <Text style={{ color: '#fff',fontFamily:'Poppins',fontSize:13 }}>Add Price</Text>
    )}
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setShowAddPriceModal(false)}
    style={{
      padding: 5,
      borderRadius: 5,
      borderColor:COLORS.directions,
      borderWidth:1,
      alignItems: 'center',
      justifyContent: 'center',
      width:'49%',
      height:40,
    }}
  >
    <Text style={{ color: COLORS.primary,fontFamily:'Poppins',fontSize:13  }}>Cancel</Text>
  </TouchableOpacity>
</View>
              </View>
            </View>
          
        </Modal>



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
          style={[styles.timePickerButton,{width:SCREEN_WIDTH/2.2}]}
          onPress={() => setOpenStart(true)} // Open Start Date Picker
        >
          <Text style={{margin:0,padding:0}}>
            {startDate ? startDate.toLocaleDateString() : 'Enter Start Date'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openStart}
          date={startDate}
          mode="date"
          minimumDate={new Date()}
          onConfirm={(selectedDate) => {
            const dateOnlyString = selectedDate.toISOString().split('T')[0];
            const dateOnly = new Date(dateOnlyString); // Recreate date as 'YYYY-MM-DD' without time zone influence
        
       
            setOpenStart(false);
            setStartDate(new Date(dateOnly)); // Set selected Start Date
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
            {/* <View style={{ marginTop: 10,marginLeft:10 }}>
        <Text style={styles.label}>
          End Date
        </Text>
        <TouchableOpacity
          style={[styles.timePickerButton,{width:SCREEN_WIDTH/2.2}]}
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
            const dateOnlyString = selectedDate.toISOString().split('T')[0];
            const dateOnly = new Date(dateOnlyString); // Recreate date as 'YYYY-MM-DD' without time zone influence
        
            setOpenEnd(false);
            setEndDate(new Date(dateOnly)); // Set selected End Date
          }}
          onCancel={() => {
            setOpenEnd(false);
          }}
        
        />
      </View> */}
          </View>
     
         
          {/* <View style={{ marginTop: 10 }}>
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
              
              <DateTimePickerModal
              isVisible={showStartTimePicker} // This controls the visibility
              mode="time" // Time picker mode
              onConfirm={handleConfirm} // Handle confirm action
              onCancel={hideDatePicker} // Handle cancel action
              textColor="red" // Customize text color
              customStyles={{
                content: {
                  backgroundColor: 'red', // Modal background color
                  borderRadius: 10, // Rounded corners for the modal
                },
                datePicker: {
                  backgroundColor: 'green', // Picker background color
                },
                dateText: {
                  color: 'white', // Text color for the date/time values inside the picker
                },
              }}
            />
              
            )}
          </View> */}
            <View style={{ marginTop: 10 }}>
      <Text style={styles.label}>Start Time</Text>

      {/* Button to show CustomTimePicker */}
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShowStartTimePicker(true)} // Show the custom time picker
      >
        <Text style={styles.timePickerText}>
          {startTime ? formatTime(startTime) : 'Select Start Time'}
        </Text>
      </TouchableOpacity>

      {/* CustomTimePicker for time selection */}
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
              loading ? (
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
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTimeSlot;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapWrapper: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  autocompleteContainer: {
    position: 'relative', 
    zIndex: 10, // Ensure it's above other content
    elevation: 10, // For Android
  
  },
  distanceButton: {
    padding: 8,
    height: 35,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: "center",
    alignContent:'center',
    textAlign:'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginTop:10
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10,
    // backgroundColor: COLORS.grey,
    borderRadius: 5,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: COLORS.primary,
  },
  label:{
    fontFamily: "Poppins-Medium", fontSize: 14,color:COLORS.primary
  },
  tabText: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "100%",
    fontFamily: "Poppins",
  },
  timePickerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginBottom:10,
    fontFamily:'Poppins'
    // marginVertical: 5,
  },
  timePickerText: {
    color: "#333",
    fontSize: 14,
    fontFamily:'Poppins'
  },
  dropdown: {
    marginVertical: 0,
  },
  // timeSlotList: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   justifyContent: "space-between",
  //   // marginVertical: 20,
  // },
  // timeSlotItem: {
  //   width: "30%",
  //   marginVertical: 5,
  //   paddingVertical: 10,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   borderRadius: 5,
  // },
  distanceButtonText: {
    color: "#000",
    fontSize: 13,
    fontFamily: "Poppins",
  },
  selectedDistanceButtonText: {
    color: "#fff",
  },
  unselectedDistanceButtonText: {
    color: "#000",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: 14,
    marginBottom: 5,
  },
  addButton: {
    padding: 4,
    // backgroundColor: '#',
    borderRadius: 5,
    marginLeft: 10,
   
  },
  addButtonText: {
    // color: '#fff',

    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    // width: "100%",
  },
  modalTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedDistanceButton: {
    backgroundColor: "rgba(102, 42, 178, 1)",
    borderColor: "rgba(102, 42, 178, 1)",
  },
  unselectedDistanceButton: {
    backgroundColor: "#fff",
    borderColor: "lightgray",
  },
 
});
