import React, { useState, useEffect ,useCallback} from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Alert,ToastAndroid
} from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import Header from "../../../../components/header/Header";
import {
  deleteTutorImage,
  deleteTutorLocation,
  deleteTutorSlot,
  getTutorById,
} from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { COLORS, icons, SIZES } from "../../../../components/constants";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const ShowHomeTutor = ({ navigation, route }) => {
  const { id,status } = route.params;
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [yogaFor, setYogaFor] = useState([]);
  const [totalImages, setTotalImages] = useState(0); // Add this line

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("TutorId :" + id);
      const res = await dispatch(getTutorById(id));
      console.log(res);
      const parsedLanguages = JSON.parse(res.data.language || "[]");
      setLanguages(Array.isArray(parsedLanguages) ? parsedLanguages : []);
      
      const parsedSpecializations = JSON.parse(res.data.specilization || "[]");
      setSpecializations(Array.isArray(parsedSpecializations) ? parsedSpecializations : []);
      
      const parsedYogaFor = JSON.parse(res.data.yogaFor || "[]");
      setYogaFor(Array.isArray(parsedYogaFor) ? parsedYogaFor : []);
      setData(res.data);
      setImages(res.data.images || []);
      setTotalImages(res.data.images.length || 0); // Add this line

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    fetchData();
  }, [dispatch, id]);
  
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [id,status])
  );
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

 

  const gridData = [
    {
      id: 1,
      color: "#fed5d3",
      image: require("../../../../assets/home/slot.png"),
      text: "Add Time Slot",
      navigateTo: "AddTimeSlot",
    },
    {
      id: 2,
      color: "#fff2cd",
      image: require("../../../../assets/home/location.png"),
      text: "Add Service Area Location",
      navigateTo: "AddTLocation",
    },
    {
      id: 3,
      color: "#ffe9d3",
      image: require("../../../../assets/home/photo.png"),
      text: "Add Photo",
      navigateTo: "AddTutorPhoto",
    },
  ];
  // const filteredGridData = gridData;
    
  const banner = [
    { id: 1, image: require("../../../../assets/get-screen/tutor1.jpg") },
 
  ];

  const renderBannerItem = () => (
    <View style={[styles.cameraContainer]}>
     <TouchableOpacity activeOpacity={0.8}   onPress={() => navigation.navigate("AddTutorPhoto", { id })} 
     >
                <View style={styles.cameraButton}>
                  <Image
                    style={styles.cameraImage}
                    source={require("../../../../assets/camera.png")}
                  />
                  <Text style={styles.cameraText}>Add Photo</Text>
                </View>
              </TouchableOpacity>  
              </View>
   
  );

  const renderApiImageItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.path }} style={styles.carouselImage} />
      {totalImages > 1 && ( 
      <TouchableOpacity
        onPress={() => showPhotoAlert(item.id)}
        style={styles.closeImg}
      >
        <Image
          source={require("../../../../assets/icons/delete.png")}
          style={styles.deleteImg}
        />
      </TouchableOpacity>
         )}
    </View>
  );

  const imagesToDisplay = images.length > 0 ? images : banner;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate(item.navigateTo, { id: id })}
    >
      <View style={[styles.circle, { backgroundColor: item.color }]}>
        <Image source={item.image} style={styles.studioImage} />
      </View>
      <Text style={styles.imgText}>{item.text}</Text>
    </TouchableOpacity>
  );

  const renderTimeSlot = ({ item }) => (
    <View style={styles.timeSlotContainer}>
      <Text style={styles.timeSlotText}>{item.time}</Text>
      <TouchableOpacity
        onPress={() => showSlotAlert(item.id)}
        style={styles.deleteIcon}
      >
        <Image
          source={require("../../../../assets/icons/delete.png")}
          style={styles.deleteImg}
        />
      </TouchableOpacity>
    </View>
  );

  const showSlotAlert = (id) => {
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
          onPress: () => handleSlotDelete(id),
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

  const showPhotoAlert = (id) => {
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
          onPress: () => handlePhotoDelete(id),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = async (id) => {
    try {
      console.log("ImageID :" + id);
      const res = await dispatch(deleteTutorLocation(id));
      console.log(res.success);
      if (res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      const msg = error.res.data.message;
      ToastAndroid.show(msg, ToastAndroid.SHORT);

    }
  };
  
  
  const handleSlotDelete = async (id) => {
    try {
      const res = await dispatch(deleteTutorSlot(id));
      console.log("ID: " + id);
      console.log("res:", res);
  
      if (res && res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);

        fetchData();
      } else {
      
        ToastAndroid.show(res?.message || "Failed to delete slot. Please try again.", ToastAndroid.SHORT);

      }
    } catch (error) {
      console.error("Error deleting item:", error);
  
      const msg = error.res?.data?.message || "An error occurred. Please try again.";
      ToastAndroid.show(msg, ToastAndroid.SHORT);

    }
  };
  const editLocation = (longitude, latitude, locationName,id,radius) => {
    // Navigate to the UpdateTLocation page with parameters
    navigation.navigate('UpdateTLocation', {
      id : id,
      longitude: longitude,
      latitude: latitude,
      locationName: locationName,
      radius1 : radius
    });
  };
  const handlePhotoDelete = async (id) => {
    // console.log(id);
    try {
      const res = await dispatch(deleteTutorImage(id));
      console.log(id)
      console.log(res);
      if (res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);

        fetchData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      const msg = error.res.data.message;
      ToastAndroid.show(msg, ToastAndroid.SHORT);

    }
  };
  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
          <StatusBar backgroundColor={COLORS.primary} style="light" />
          <View style={{ paddingTop: 20 }}>
              <Header
                title={"Your Profile"}
                icon={icons.back}
              />
            </View>
            <ScrollView>
              <View style={{ paddingVertical: 0 }}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 0 }}>
                  <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16 }}>
                   {data && data.homeTutorName}
                  </Text>
                </View>
                <View style={styles.bannerContainer}>
                  <FlatList
                    data={imagesToDisplay}
                    renderItem={
                      images.length > 0 ? renderApiImageItem : renderBannerItem
                    }
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.bannerContentContainer}
                  />
                </View>
                <View>
                  <View style={{ paddingVertical: 10}}>
                    <FlatList
                      data={gridData}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={3}
                      contentContainerStyle={styles.contentContainer}
                    />
                  </View>
                  <View
                    style={styles.innerView}
                  >
                   
                      <View>
                      <Text style={styles.headingText}>Bio</Text>

                        <Text style={styles.text}>{data.instructorBio}</Text>
                      </View>
                   
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("UpdateHomeTutor", { id: id })
                      }
                    >
                      <Image
                        source={require("../../../../assets/icons/edit.png")}
                        style={styles.editImg}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* </View> */}
                  <View
  style={{
    backgroundColor: COLORS.white,
    padding: 10,
   
    marginVertical: 15,
    marginHorizontal: 15,
    borderRadius: 10,
  }}
>
<View>
  <Text style={styles.headingText}>Service Areas (Locations)</Text>
  <View style={{ paddingVertical: 10 }}>
    {data.serviceAreas &&
      data.serviceAreas.map((area, index) => (
        <View
          key={area.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
            // alignItems: "center",
            flex:1
          }}
        >
          <View style={{ flexDirection: "row"}}>
            <Ionicons name="location-outline" size={18} color="black" style={{ marginRight: 5 }} />
            <Text style={[styles.text, { flexWrap: 'wrap', width: 270 }]}>{area.locationName}</Text>
          </View>
          
          {data.serviceAreas.length > 1 ? (
            <TouchableOpacity
              onPress={() => showAlert(area.id)}
              style={{ paddingHorizontal: 10 }}
            >
              <Image
                source={require("../../../../assets/icons/delete.png")}
                style={styles.editImg}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => editLocation(area.longitude,area.latitude,area.locationName,area.id,area.radius)}
              style={{ paddingHorizontal: 0}}
            >
              <Image
                source={require("../../../../assets/icons/edit.png")}
                style={styles.editImg}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
  </View>
</View>


</View>
                  <View
                    style={styles.innerView}
                  >
                    <View>
                      <Text style={styles.headingText}>Languages</Text>
                      <View style={{ paddingVertical: 0 }}>
                      
                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          
                          {languages.map((lang, index) => (
                              <View style={styles.timeSlotContainer}>
                            <Text key={index} style={styles.specilizationText}>
                              {lang}
                            </Text>
                            </View>
                          ))}
                          
                        </ScrollView>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("UpdateHomeTutor", { id: id })
                      }
                    >
                      <Image
                        source={require("../../../../assets/icons/edit.png")}
                        style={styles.editImg}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={styles.innerView}
                  >
                    <View>
                      <Text style={styles.headingText}>Specialisation</Text>
                      <View style={{ paddingVertical: 10 }}>
                      
                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {specializations.map((spec, index) => (
                       <View style={styles.timeSlotContainer}>
                      <Text key={index} style={styles.specilizationText}>
                        {spec}
                      </Text>
                        </View>
                    ))}
                  </ScrollView>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("UpdateHomeTutor", { id: id })
                      }
                    >
                      <Image
                        source={require("../../../../assets/icons/edit.png")}
                        style={styles.editImg}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={styles.innerView}
                  >
                    <View>
                      <Text style={styles.headingText}>Session Offered</Text>
                      <View style={{ paddingVertical: 10 }}>
                        <View style={styles.timeSlotContainer}>
                          <Text style={styles.timeSlotText}>
                            {(data.isGroupSO ? "Group" : "") +
                              (data.isGroupSO && data.isPrivateSO
                                ? " & "
                                : "") +
                              (data.isPrivateSO ? "Individual" : "")}
                          </Text>
                        </View>
                        {data && data.privateSessionPrice_Day && (
                          <Text style={{ fontSize: 12, fontFamily: "Poppins" }}>
                            {" "}
                            * Individual Class (Day) - ₹{" "}
                            {data.privateSessionPrice_Day}
                          </Text>
                        )}
                        {data && data.privateSessionPrice_Month && (
                          <Text style={{ fontSize: 12, fontFamily: "Poppins" }}>
                            {" "}
                            * Individual Class (Month) - ₹{" "}
                            {data.privateSessionPrice_Month}
                          </Text>
                        )}
                        {data && data.groupSessionPrice_Day && (
                          <Text style={{ fontSize: 12, fontFamily: "Poppins" }}>
                            {" "}
                            * Group Class (Day) - ₹ {data.groupSessionPrice_Day}
                          </Text>
                        )}
                        {data && data.groupSessionPrice_Month && (
                          <Text style={{ fontSize: 12, fontFamily: "Poppins" }}>
                            {" "}
                            * Group Class (Month) - ₹{" "}
                            {data.groupSessionPrice_Month}
                          </Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("UpdateHomeTutor", { id: id })
                      }
                    >
                      <Image
                        source={require("../../../../assets/icons/edit.png")}
                        style={styles.editImg}
                      />
                    </TouchableOpacity>
                  </View>
                  {data.timeSlotes?.length > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor:COLORS.white,
                        padding:10,
                        marginVertical:15,
                        marginHorizontal:15,
                        borderRadius:10,
                      
                        width : 330
                      }}
                    >
                      <View>
                        <Text style={styles.headingText}>
                          Time Availability
                        </Text>
                        <View style={{ paddingVertical: 10 }}>
                          <FlatList
                            data={data.timeSlotes}
                            renderItem={renderTimeSlot}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            contentContainerStyle={styles.timeSlotList}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  <View
                    style={styles.innerView}
                  >
                    <View>
                      <Text style={styles.headingText}>
                        Giving Yoga Sessions for{" "}
                      </Text>
                      <View style={{ paddingVertical: 10 }}>
                     
                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {yogaFor.map((item, index) => (
                       <View style={styles.timeSlotContainer}>
                      <Text key={index} style={styles.timeSlotText}>
                        {item}
                      </Text>
                      </View>
                    ))}
                  </ScrollView>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("UpdateHomeTutor", { id: id })
                      }
                    >
                      <Image
                        source={require("../../../../assets/icons/edit.png")}
                        style={styles.editImg}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </GestureHandlerRootView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  innerView :{
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor:COLORS.white,
    padding:10,
    marginVertical:15,
    marginHorizontal:15,
    borderRadius:10,
  
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerContainer: {
    // height: 200,
    paddingVertical:10,
    paddingHorizontal: 10,
  },
  bannerContentContainer: {
    paddingHorizontal: 10,
  },

cameraImage: {
  width: 30,
  height: 30,
  alignSelf: "center",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 40,
},
cameraContainer: {
  width: wp(40),
  height: hp(20),
  borderRadius: 10,
  borderWidth: 1,
  borderColor: COLORS.primary,
  marginTop: 10,
  marginBottom:10,
  borderStyle:'dashed',
  backgroundColor: "#fff",
},
cameraText: {
  fontSize: hp(2),
  fontFamily: "Poppins-Medium",
  textAlign: "center",
  marginTop:12,
  color:COLORS.primary
},
  carouselItem: {
    width: 110,
    height: 105,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5, // Added margin to create space between items
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  contentContainer: {
    // alignItems: "spa",
    alignItems:'center',
 
  },
  itemContainer: {
    alignItems: "center",
    margin: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  studioImage: {
    width: 25,
    height: 25,
  },
  imgText: {
    fontFamily: "Poppins",
    fontSize: 10,
    width: 90,
    textAlign: "center",
  },
  horizontalContainer: {
    paddingVertical: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    marginHorizontal: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins",
    marginRight: 15,
  },
  cardImage: {
    width: 50,
    height: 50,
  },
  cardText1: {
    fontSize: 12,
    fontFamily: "Poppins",
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    marginVertical:10
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 12,
    lineHeight: 24,
  },
  editImg: {
    width: 15,
    height: 15,
  },
  description :{
  backgroundColor:COLORS.white,
  marginHorizontal:20,
  borderRadius:10,
  padding:12,
  // width : 330
  },
  timeSlotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "rgba(0, 0, 0, 1)",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    position: "relative",
  },
  timeSlotText: {
    fontFamily: "Poppins",
    fontSize: 12,
    backgroundColor: "#eeedfc",
    borderRadius: 10,
    padding: 8,
  },
  timeSlotList: {
    flexDirection: "column",
  },
  deleteImg: {
    width: 15,
    height: 15,
    // marginLeft: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 3,
  },
  closeImg: {
    position: "absolute",
    top: 0,
    right: 2,
  },
  specilizationText: {
    fontFamily: "Poppins",
    fontSize: 13,
    backgroundColor: "#eeedfc",
    borderRadius: 10,
    padding: 8,
  },
});

export default ShowHomeTutor;
