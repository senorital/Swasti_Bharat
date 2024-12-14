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
import { addTutorPrice, getTutorById } from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";





const defaultLocation = {
  latitude: 28.6139, // Latitude for New Delhi
  longitude: 77.2090, // Longitude for New Delhi
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
const themeColor = "#3498db"; // Replace with your desired theme color

const AddTutorPrice = ({ navigation, route }) => {
  const dispatch = useDispatch();
 

  const { id } = route.params;

  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(defaultLocation);
  const autocompleteRef = useRef(null);
  const [private_PricePerDayPerRerson, setprivate_PricePerDayPerRerson] = useState("");
  const [group_PricePerDayPerRerson, setgroup_PricePerDayPerRerson] = useState("");
  const [radius, setRadius] = useState(null);
  const [name, setName] = useState("");
  const [priceType,setpriceType]=useState('');
  const [packageType,setpackageType]=useState('');
  const [personalPrice, setPersonalPrice] = useState(null); // State for personal price
  const [groupPrice, setGroupPrice] = useState(null); // State for group price

 
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
        const response = await dispatch(getTutorById(id)); // Fetch tutor data

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
, [id]);


  const priceTypeItems = [
    { key: "1", value: "Subscription Price" },
    { key: "2", value: "Freemium Price" },
    { key: "3", value: "Fixed Price" },
    { key: "4", value: "Dynamic Price" },
  ];

  const handlepriceType = (value) => {
    setpriceType(value);
   
  };
  
  
  




  const handleSubmit = async () => {
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
            private_PricePerDayPerRerson: private_PricePerDayPerRerson ? private_PricePerDayPerRerson : "0",
            group_PricePerDayPerRerson: group_PricePerDayPerRerson ? group_PricePerDayPerRerson: "0",
            group_totalPricePerPerson: group_PricePerDayPerRerson  ? groupTotal.toFixed(2) : "0", 
            private_totalPricePerPerson: private_PricePerDayPerRerson ?  privateTotal.toFixed(2) :"0",
        };


        // Dispatch addTutorPrice action
        const response = await dispatch(addTutorPrice(priceData));
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        navigation.goBack();

    } catch (error) {
        // Handle any errors that occur
        const errorMessage =
            error?.response?.data?.message || error.message || "Something went wrong.";
        console.error('Error in handleSubmit:', errorMessage);
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    } finally {
        setLoading(false);
    }
};


 

  
  const handlepackageType = (value) => {
    setpackageType(value);
   
  };


  const packageTypeItems = [
    { key: "1", value: "monthly 25" },
    { key: "2", value: "weekly 6" },
    { key: "3", value: "monthly 30" },
    { key: "4", value: "weekly 7" },
    { key: "5", value: "daily" },
  ];

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <StatusBar backgroundColor={COLORS.primary} style="light" />
          <View style={{ paddingTop: 20 }}>
        <Header
          title={"Add Price"}
          icon={icons.back}
        />
      </View>

   
       <ScrollView>

        <View style={{ paddingHorizontal: 15 }}>
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

      
          <Button
            title={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Add Package Price"
              )
            }
            onPress={handleSubmit}
          />
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTutorPrice;

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
