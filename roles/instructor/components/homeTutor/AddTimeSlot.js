import React, { useState,useEffect } from "react";
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
  BackHandler,
  ToastAndroid
} from "react-native";
import Toast from "react-native-toast-message";
import { Calendar } from "react-native-calendars";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../../../components/header/Header";
import Button from "../../../../components/button/Button";
import { addTimeSlot, getServiceArea } from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import DatePicker from 'react-native-date-picker';
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { startGeofencingAsync } from "expo-location";

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

const serviceAreaLocation=[
  {key:'Badarpur Border',value:'Badarpur Border'},
]

const AddTimeSlot = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const today1 = new Date();

  const todayDateString = today1.toISOString().split("T")[0];

  const { id } = route.params;
  console.log("ID :" + id)
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceType,setServiceType]=useState('');
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [serviceAreaLocations, setServiceAreaLocations] = useState([]);
  const [serviceAreaLocation, setServiceAreaLocation] = useState(""); // Track selected service area
  const [selectedServiceAreas, setSelectedServiceAreas] = useState([]); // Array to store selected service areas
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
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

  const handleStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime; // Use the new time or the previous time if canceled
    setShowStartTimePicker(false);

    setStartTime(currentTime);
  
    // if (duration) {
    //   generateTimeSlots(currentTime, duration);
    // }
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

  // const generateTimeSlots = (startTime, duration) => {
  //   const slots = [];
  //   const start = new Date(startTime);
    
  //   for (let i = 0; i < 24 * 60; i += duration) {
  //     const end = new Date(start.getTime() + duration * 60000);
  //     slots.push({ start: new Date(start), end });
  //     start.setMinutes(start.getMinutes() + duration);
  //   }
    
  //   setTimeSlots(slots);
  // };
  useEffect(() => {
    // Fetch service areas when the component mounts
    fetchServiceAreas(id); // Pass id into fetchServiceAreas
  }, [id]);

  const handleEndTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  // const createTimeSlots = () => {
  //   if (!startTime || !endTime || !duration) {
  //     // Toast.show({
  //     //   type: "error",
  //     //   text1: "Please select start time, end time, and duration.",
  //     //   visibilityTime: 2000,
  //     //   autoHide: true,
  //     // });

  //     ToastAndroid.show("Please select start time, end time, and duration.",ToastAndroid.SHORT)
  //     return;
  //   }

  //   let start = new Date(startTime);
  //   const end = new Date(endTime);
  //   const slots = [];
  //   const durationInMinutes = parseInt(duration, 10);

  //   while (start < end) {
  //     const endSlot = new Date(start.getTime() + durationInMinutes * 60000);
  //     if (endSlot <= end) {
  //       slots.push({ start: new Date(start), end: endSlot });
  //     }
  //     start = endSlot;
  //   }

  //   setTimeSlots(slots);
  // };

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
        console.log('handleSubmit started');
        console.log('Selected Slot:', selectedSlot);
        
        // Check if a time slot has been selected
      

        setLoading(true);
        console.log('Loading set to true');

        // Ensure a service area is selected
      
        
        // Ensure all required inputs are filled
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
                  key : selectedLocation.key,
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
            id : id,
        };

        // Log the payload for testing
        console.log("Payload to be sent:", payload);

        const res = await dispatch(addTimeSlot(payload));
        console.log('Response from addTimeSlot:', res);


        if (res.success) {
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
          console.log('Success message:', res.message);
          navigation.goBack();
      } else {
          // Check for specific error message
          if (res.message === "Please select appropriate date!") {
              ToastAndroid.show("Please select appropriate date and time.", ToastAndroid.SHORT);
          } else {
              console.log('Error response received:', res.message);
              ToastAndroid.show(res.message, ToastAndroid.SHORT);
          }
      }
    } catch (error) {
        // If an error occurs during the process, show an error message
        ToastAndroid.show(error.message || "Something went wrong.", ToastAndroid.SHORT);
        console.error('Error in handleSubmit:', error);
    } finally {
        console.log('Setting loading to false');
        setLoading(false);
    }
};

  const formatTime = (time) => {
    if (!time) return "";
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const theme = {
    calendarBackground: COLORS.white,
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
    setSelectedSlot(index);
  };


 // Helper function to get the start of the current week (Monday)
 const getWeekStartDate = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = (day >= 1 ? day - 1 : 6) * 24 * 60 * 60 * 1000;
  return new Date(date.getTime() - diff).toISOString().split("T")[0];
};

// Helper function to get dates of the current week (Monday to Sunday)
const getWeekDates = () => {
  const startOfWeek = new Date(getWeekStartDate());
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  });
};

const weekDates = getWeekDates();

const handleTabPress = (date) => {
  setSelectedDates((prevSelectedDates) => {
    if (prevSelectedDates.includes(date)) {
      // Remove date if it's already selected
      return prevSelectedDates.filter((d) => d !== date);
    } else {
      // Add date if it's not selected
      return [...prevSelectedDates, date];
    }
  });
};

const handleDurationChange = (selectedDuration) => {
  setDuration(selectedDuration);

  // // Generate slots if start time is already set
  // if (startTime) {
  //   generateTimeSlots(startTime, selectedDuration);
  // }
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


  // console.log(selectedSlots);
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
        {/* <View style={{ width: "100%" }}> */}
          {/* <Calendar
            theme={theme}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            minDate={minDate}
            maxDate={maxDate}
          />
        </View> */}

     {/* <View style={styles.tabContainer}>
          {weekDates.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.tab,
                selectedDates.includes(day.date) && styles.selectedTab
              ]}
              onPress={() => handleTabPress(day.date)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedDates.includes(day.date) && styles.selectedTabText
                ]}
              >
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        <View style={{ paddingHorizontal: 15 }}>
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
          {/* <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
             Service Area Location
            </Text>
            <SelectList
              setSelected={handleServiceTypeChange}
              data={serviceAreaLocation}
              save="value"
              placeholder="Select Service Area Location"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View> */}

          
          {/* <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
             Start Date
            </Text>
            {/* <TextInput
             style={styles.timePickerButton}
                value={numberOfPeople}
                onChangeText={setNumberOfPeople}
                placeholder="Enter number of people"
                keyboardType="numeric"
              /> */}
               {/* <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setOpen(true)} // Open date picker when button is pressed
      >
        <Text style={styles.buttonText}>
          {date ? date.toLocaleDateString() : 'Enter Start Date'}
        </Text>
      </TouchableOpacity> */}
      {/* <DatePicker
        modal
        open={open}
        date={date}
        mode="date" // Specify date mode
        onConfirm={(selectedDate) => {
          setOpen(false);
          setDate(selectedDate); // Update the selected date
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
          </View> */} 

<View style={{ marginTop: 10 }}>
        <Text style={styles.label}>
          Start Date
        </Text>
        <TouchableOpacity
          style={[styles.timePickerButton,{width:SCREEN_WIDTH/2.2}]}
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
          mode="date" // Date mode for picking date
          onConfirm={(selectedDate) => {
            setOpenEnd(false);
            setEndDate(selectedDate); // Set selected End Date
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
          {/* <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
              End Time
            </Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {endTime ? formatTime(endTime) : "Select End Time"}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime || new Date()}
                mode="time"
                display="default"
                onChange={handleEndTimeChange}
              />
            )}
          </View> */}
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
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
});
