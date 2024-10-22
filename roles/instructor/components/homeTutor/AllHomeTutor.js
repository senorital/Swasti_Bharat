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
  publishHomeTutor,
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

  const handlePublishPress = async (id, isPublish) => {
    try {
      const res = await dispatch(
        publishHomeTutor({ id, isPublish: isPublish })
      );
      if (res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        fetchData(); 
      }
    } catch (error) {
      console.error("Error approve item:", error);
      const msg = error.response.data.message;
      ToastAndroid.show(msg, ToastAndroid.SHORT);

    }
  };

  const showPublishAlert = (id, isPublish) => {
    Alert.alert(
      "Confirm for Publish",
      "Are you sure you want to send this item for publish?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Send",
          onPress: () => handlePublishPress(id, isPublish),
        },
      ],
      { cancelable: false }
    );
  };
  const showAlert = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDelete(id),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteHomeTutor(id));
      console.log("Tutor ID :" + id);
  
      if (res && res.success) {
        // Show a toast message using ToastAndroid
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        fetchData(); 
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      const msg = error.res?.data?.message || "An error occurred. Please try again.";
      
      // Show error message using ToastAndroid
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };
  
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


  
  const renderTutors = (tutors, tab) => {
    if (tutors.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      );
    }
    const flattenedTutors = [];
    tutors.forEach((tutor) => {
      if (tutor.serviceAreas && tutor.serviceAreas.length > 0 && tutor.timeSlotes && tutor.timeSlotes.length > 0) {
        tutor.serviceAreas.forEach((area) => {
          tutor.timeSlotes.forEach((slot) => {
            flattenedTutors.push({ ...tutor, currentArea: area, currentSlot: slot });
          });
        });
      } else if (tutor.serviceAreas && tutor.serviceAreas.length > 0) {
        tutor.serviceAreas.forEach((area) => {
          flattenedTutors.push({ ...tutor, currentArea: area, currentSlot: null });
        });
      } else if (tutor.timeSlotes && tutor.timeSlotes.length > 0) {
        tutor.timeSlotes.forEach((slot) => {
          flattenedTutors.push({ ...tutor, currentArea: null, currentSlot: slot });
        });
      } else {
        flattenedTutors.push(tutor);
      }
    });

    return flattenedTutors.map((tutor, index) => {
      const tutorImage =
        tutor.images && tutor.images.length > 0
          ? tutor.images[0].path
          : null;
  

          
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
                    : require("../../../../assets/get-screen/tutor1.jpg")
                }
                style={styles.tutorImage}
              />
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.dateText}>
                {(tutor.isGroupSO ? "Group" : "") +
                  (tutor.isGroupSO && tutor.isPrivateSO ? " & " : "") +
                  (tutor.isPrivateSO ? "Individual" : "")}
              </Text>
              <Text style={styles.text1}>
                {tutor.currentArea ? tutor.currentArea.locationName : "No Area"}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
              {tutor.currentSlot && tutor.currentSlot.time ? (
  <TouchableOpacity style={{ marginRight: 10 }}>
    <Text style={styles.timeslot}>
      {tutor.currentSlot.time}
    </Text>
  </TouchableOpacity>
) : null}
                {tutor.privateSessionPrice_Day && (
                  <TouchableOpacity style={{ marginRight: 10 }}>
                    <Text style={styles.price}>
                      ₹ {tutor.privateSessionPrice_Day}
                    </Text>
                  </TouchableOpacity>
                )}
               
                {tab === 1 && (
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => showPublishAlert(tutor.id, true)}
                  >
                    <Text style={styles.detailsButton}>
                      {tutor.isPublish ? "Published" : "Publish"}
                    </Text>
                  </TouchableOpacity>
                )}
               
              </View>
            </View>

            <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => showAlert(tutor.id)}
                >
                  <Image
                    source={icons.deletes}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    });
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
        </View>
      ) : (
        <View style={{ marginHorizontal: 14 }}>
          <HomeTutorStatusTab
            selectionMode={1}
            option1="Approved"
            option2="Review"
            option3="Draft"
            onSelectSwitch={onSelectSwitch}
          />
          <ScrollView>
            <View style={{ marginTop: 10 }}>
              {bookingTab === 1 && renderTutors(approvedTutors, 1)}
              {bookingTab === 2 && renderTutors(reviewTutors, 2)}
              {bookingTab === 3 && renderTutors(draftTutors, 3)}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={() => navigation.navigate('HomeTutor')}>
            <View style={styles.newcard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.text, { color: COLORS.primary, fontFamily: 'Poppins_Medium', fontSize: 14 }]}>
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
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "PoppinsSemiBold",
  },
  timeslot: {
    fontFamily: 'Poppins',
    backgroundColor: COLORS.light_orange,
    color: COLORS.timeslottext,
    fontSize: 10,
    padding: 6,
    borderRadius: 10
  },

  price: {
    fontFamily: 'Poppins',
    backgroundColor: COLORS.lightgreen,
    color: COLORS.pricetext,
    fontSize: 10,
    padding: 6,
    borderRadius: 10
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
