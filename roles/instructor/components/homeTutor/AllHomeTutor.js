import React, { useEffect, useState ,useCallback} from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  Image,
  Alert,ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import BookingTab from "../booking/BookingTab";
import {
  deleteHomeTutor,
  getTutor,
  deleteTutorLocation,
  submitHomeTutor,
} from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomHeader from "../../../../components/CustomHeader/CustomHeader";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "expo-linear-gradient";
import { COLORS, icons } from "../../../../components/constants";
import HomeTutorStatusTab from "./homeTutorStatusTab";
import { useFocusEffect } from '@react-navigation/native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const AllHomeTutor = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [bookingTab, setBookingTab] = useState(1);

  const onSelectSwitch = (value) => {
    setBookingTab(value);
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

  
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getTutor());
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      const msg = error.res.data.message;
      ToastAndroid.show(msg, ToastAndroid.SHORT);

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [dispatch])
  );

  const handleHomeTutorPress = (tutorId, approvalStatus) => {
    navigation.navigate("ShowHomeTutor", { id: tutorId, status: approvalStatus });
  };


  // Filtered data arrays
  const approvedTutors = data.filter(
    (tutor) => tutor.approvalStatusByAdmin === "Approved"
  );
  const reviewTutors = data.filter(
    (tutor) => tutor.approvalStatusByAdmin === "Pending"
  );
  const draftTutors = data.filter(
    (tutor) => tutor.approvalStatusByAdmin === null
  );
  const calculateEndTime = (startTime, durationInMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + durationInMinutes);
    return endDate.toTimeString().slice(0, 5); // Format: HH:MM
  };

  
const formatDate = (dateString) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};
  const renderTutors = (tutors, tab) => {
    if (tutors.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      );
    }
    // Helper function to remove duplicates by service area and time slot ID
    const removeDuplicatesByAreaAndSlot = (array) => {
      const seen = new Set();
      return array.filter((item) => {
        const uniqueKey = `${item.currentArea?.id || "noArea"}-${item.currentSlot?.id || "noSlot"}`;
        if (seen.has(uniqueKey)) return false;
        seen.add(uniqueKey);
        return true;
      });
    };
  
    // Flatten and filter out duplicates
    const flattenedTutors = tutors.flatMap((tutor) => {
      const serviceAreas = Array.isArray(tutor.serviceAreas) ? tutor.serviceAreas : [];
      const timeSlots = Array.isArray(tutor.timeSlotes) ? tutor.timeSlotes : [];
  
      // Map each service area and matching time slot into a separate entry
      const tutorEntries = [];
      serviceAreas.forEach((area) => {
        const matchingSlots = timeSlots.filter((slot) => slot.serviceAreaId === area.id);
  
        if (matchingSlots.length > 0) {
          // Create entries for each unique service area and matching time slot combination
          matchingSlots.forEach((slot) => {
            tutorEntries.push({ ...tutor, currentArea: area, currentSlot: slot });
          });
        } else {
          // If no matching time slot, add the area without a slot
          tutorEntries.push({ ...tutor, currentArea: area, currentSlot: null });
        }
      });
  
      // Include tutors with only time slots (no service areas)
      if (serviceAreas.length === 0 && timeSlots.length > 0) {
        timeSlots.forEach((slot) => {
          tutorEntries.push({ ...tutor, currentArea: null, currentSlot: slot });
        });
      }
  
      // Include tutors with no service areas or time slots
      if (serviceAreas.length === 0 && timeSlots.length === 0) {
        tutorEntries.push(tutor);
      }
  
      return tutorEntries;
    });
  
    // Remove duplicate entries based on unique service area and time slot ID
    const uniqueTutors = removeDuplicatesByAreaAndSlot(flattenedTutors);
    
    
    
      return (
        <ScrollView>
        {uniqueTutors.map((tutor, index) => {
          const tutorImage =
            tutor.images && tutor.images.length > 0
              ? tutor.images[0].path
              : null;
    
          const locationName = tutor.currentArea?.locationName || '';
    
          return (
            <TouchableOpacity
              onPress={() => handleHomeTutorPress(tutor.id, tutor.approvalStatusByAdmin)}
              style={{ marginRight: 10 }}
              key={index}
            >
              <View style={styles.cardContainer}>
                <View style={styles.leftContainer}>
                  <Image
                    source={
                      tutorImage
                        ? { uri: tutorImage }
                        : require("../../../../assets/get-screen/bydefault.jpg")
                    }
                    style={styles.tutorImage}
                  />
                </View>
                <View style={styles.rightContainer}>
                <Text style={styles.dateText}>
                    {tutor.currentSlot && tutor.currentSlot.serviceType
                        ? tutor.currentSlot.serviceType
                     : "No service type available"}
                       </Text>
                  <Text style={styles.text1} numberOfLines={1} ellipsizeMode="tail">
                    {locationName}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    {/* Display only one time slot per service area */}
                    {tutor.currentSlot && tutor.currentSlot.serviceAreaId === tutor.currentArea.id && (
                      <TouchableOpacity style={{ marginRight: 10 }}>
                        <Text style={styles.timeslot}>
                          {tutor.currentSlot.time} - {calculateEndTime(tutor.currentSlot.time, tutor.currentSlot.timeDurationInMin)}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {tutor.currentSlot?.date && (
                      <TouchableOpacity style={{ marginRight: 10 }}>
                        <Text style={styles.price}>
                          {formatDate(tutor.currentSlot.date)}
                        </Text>
                      </TouchableOpacity>
                    )}
                  
                  </View>
                  
                </View>
               
                {/* <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => showAlert(
                  
                  tutor.currentArea.id)}
                >
                  <Image source={icons.deletes} style={styles.editIcon} />
                </TouchableOpacity> */}
              </View>
              
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      )
  };
    
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <CustomHeader
          title="Your Listings"
          icon={icons.back}
          buttonText="Add New"
          destination="HomeTutor"
        />
      </View>
      {loading ? (
        <View style={{ marginHorizontal: 18, marginVertical: 10 }}>
          <View style={styles.cardContainer1}>
            <ShimmerPlaceholder
              style={[styles.tutorImage, { marginRight: 10 }]}
            />
            <View style={styles.rightContainer}>
              <ShimmerPlaceholder
                style={[styles.text, { marginVertical: 10 }]}
              />
              <ShimmerPlaceholder style={styles.text} />
              <ShimmerPlaceholder style={styles.text} />
            </View>
            
          </View>
            <View style={styles.cardContainer1}>
            <ShimmerPlaceholder
              style={[styles.tutorImage, { marginRight: 10 }]}
            />
            <View style={styles.rightContainer}>
              <ShimmerPlaceholder
                style={[styles.text, { marginVertical: 10 }]}
              />
              <ShimmerPlaceholder style={styles.text} />
              <ShimmerPlaceholder style={styles.text} />
            </View>
            
          </View>
        </View>
      ) : (
        <ScrollView>
        <View style={{ marginHorizontal: 14 }}>
          <HomeTutorStatusTab
            selectionMode={1}
            option1="Approved"
            option2="Review"
            option3="Draft"
            onSelectSwitch={onSelectSwitch}
          />
         
            <View style={{ marginTop: 10 }}>
              {bookingTab === 1 && renderTutors(approvedTutors, 1)}
              {bookingTab === 2 && renderTutors(reviewTutors, 2)}
              {bookingTab === 3 && renderTutors(draftTutors, 3)}
            </View>
        
          <TouchableOpacity onPress={() => navigation.navigate('HomeTutor')}>
            <View style={styles.newcard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.text, { color: COLORS.primary, fontFamily: 'Poppins-Medium', fontSize: 14 }]}>
                  Add New Class Listing
                </Text>
                <AntDesign name="plussquare" size={25} color={COLORS.primary} />
              </View>
              <Text style={styles.cardtext}>
                Why limit your potential? Add more class timings and attract more clients! Earn More Money
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  newcard :{
    marginHorizontal:5,
 justifyContent:'center',
 borderStyle:'dashed',
 borderColor:COLORS.primary,
 borderWidth:1,
 borderRadius:10,
 padding:13
  },
  deleteButton: {
    marginLeft: 'auto', // Pushes the delete icon to the far right
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.primary, // Adjust color as needed
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "row",
    marginVertical: 10,
    // marginHorizontal:12,
    // elevation:2,
    shadowColor: '#000',
    shadowOffset: 1,
    padding: 12,
    borderColor: "#f7f2f2",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  leftContainer: {
    marginRight: 5,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 8,
    marginTop: 3,
    justifyContent: 'space-between',
  },
  historyText: {
    fontSize: 18,
    fontFamily: "Poppins",
  },

  cardtext :{
  fontFamily:'Poppins',
  color:'black',
  fontSize:11,
  flexWrap:'wrap',
  width:250
  },
  dateText: {
    fontSize: 13,
    color: COLORS.black,
    fontFamily: "Poppins-SemiBold",
  },
  timeslot: {
    fontFamily: 'Poppins-Medium',
    backgroundColor: COLORS.light_orange,
    color: COLORS.timeslottext,
    fontSize: 10,
    padding: 6,
    borderRadius: 8
  },

  price: {
    fontFamily: 'Poppins-Medium',
    backgroundColor: COLORS.lightgreen,
    color: COLORS.pricetext,
    fontSize: 10,
    padding: 6,
    borderRadius: 8
  },

  detailsButton: {
    fontSize: 10,
    color: COLORS.white,
    padding: 5,
    borderRadius: 4,
    marginRight: 8,
    textAlign: 'center',
    fontFamily: "Poppins_Medium",
    backgroundColor: COLORS.primary
  },
  deleteButton: {
    fontSize: 14,
    color: "red",
    fontFamily: "Poppins",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tutorImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  deleteButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  deleteButtonIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  text1: {
    fontFamily: "Poppins",
    fontSize: 12,
    // lineHeight: 19,
  },
  cardContainer1: {
    flexDirection: "row",
    alignItems: "center",
    // marginHorizontal: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: 1,
    borderColor: "#f7f2f2",
    borderWidth: 1,
  },
  noDataText: {
    fontFamily: "Poppins_Medium",
    fontSize: 16,
    color: COLORS.gray,
  },
});

export default AllHomeTutor;
