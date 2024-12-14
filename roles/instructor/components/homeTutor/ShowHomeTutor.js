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
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
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
import { SCREEN_WIDTH, WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { windowWidth } from "../../../../utils/Dimensions";
const ShowHomeTutor = ({ navigation, route }) => {
  const { id,status } = route.params;
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [prices, setPrices] = useState([]);

  const [yogaFor, setYogaFor] = useState([]);
  const [totalImages, setTotalImages] = useState(0); // Add this line

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getTutorById(id));
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
    {
      id: 4,
      color: "#ffe9d3",
      image: require("../../../../assets/home/offer.png"),
      text: "Add Price",
      navigateTo: "AddTutorPrice",
    },
  ];
    
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
    <View style={styles.carouselItem} key={item.id}>
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
      key={item.id}
      onPress={() => navigation.navigate(item.navigateTo, { id: id })}
    >
      <View style={[styles.circle, { backgroundColor: item.color }]}>
        <Image source={item.image} style={styles.studioImage} />
      </View>
      <Text style={styles.imgText}>{item.text}</Text>
    </TouchableOpacity>
  );

  const renderTimeSlot = ({ item }) => (
    <View style={styles.timeSlotContainer} key={item.id}>
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
      const res = await dispatch(deleteTutorLocation(id));
      if (res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        fetchData();
      }
    } catch (error) {
      const msg = error.res?.data?.message;
      ToastAndroid.show(msg, ToastAndroid.SHORT);

    }
  };
  
  
  const handleSlotDelete = async (id) => {
    try {
      const res = await dispatch(deleteTutorSlot(id));
    
  
      if (res && res.success) {
        ToastAndroid.show(res?.message, ToastAndroid.SHORT);

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
    
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
          <StatusBar backgroundColor={COLORS.primary} style="light" />
          <View style={{ paddingTop: 20 }}>
              <Header
                title={"Your Profile"}
                icon={icons.back}
              />
            </View>
            {loading ? (
         <ScrollView style={styles.shimmerWrapper}>
         <ShimmerPlaceholder style={styles.headerShimmer} />
         <ShimmerPlaceholder style={styles.imageShimmer} />
         <ShimmerPlaceholder style={styles.textShimmer} />
         <ShimmerPlaceholder style={styles.shimmerContainer} />
         <ShimmerPlaceholder style={styles.shimmerContainer} />
         <ShimmerPlaceholder style={styles.shimmerContainer} />
         <ShimmerPlaceholder style={styles.shimmerContainer} />

       </ScrollView>
       
      ) : (
            <ScrollView>
              <View>
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
                  <View>
                    <FlatList
                      data={gridData}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={4}
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
  <Text style={[styles.headingText,{marginBottom:10}]}>Service Areas (Locations)</Text>
  <View>
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
            <Ionicons name="location-outline" size={16} color="black" style={{ marginRight:5,marginTop:3 }} />
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
                      <View>
                      
                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          
                          {languages.map((lang, index) => (
                              <View style={styles.timeSlotContainer}  key={lang.id}>
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
                      <View>
                      
                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {specializations.map((spec, index) => (
                       <View style={styles.timeSlotContainer}  key={spec.id}>
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
                      style={{marginLeft:-20}}
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
                      <View>
                        <View style={styles.timeSlotContainer}>
                          <Text style={styles.timeSlotText}>
                            {(data.isGroupSO ? "Group" : "") +
                              (data.isGroupSO && data.isPrivateSO
                                ? " & "
                                : "") +
                              (data.isPrivateSO ? "Individual" : "")}
                          </Text>
                        </View>
                        
                        
                   
                       
                        
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
<View style={styles.innerView}>
{data.hTPrices && data.hTPrices.length > 0 && (
  <View>
    <Text style={[styles.headingText, { marginBottom: 10 }]}>Prices</Text>
    <View>
      {data.hTPrices.map((price) => (
        <View
          key={price.id}
          style={{
            marginBottom: 15,
            padding: 10,
            borderWidth: 1,
            width:windowWidth/1.2,
            borderColor: "#ddd",
            borderRadius: 5,
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Price Name */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
            <Text style={styles.timeSlotText}>{price.priceName}</Text>
          </View>

          {/* Private Price (Conditional) */}
          {price.private_PricePerDayPerRerson !== null && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
              <Text style={styles.timeSlotText}>Private Price Per Person :  ₹{price.private_PricePerDayPerRerson}</Text>
            </View>
          )}

        {price.private_totalPricePerPerson !== null && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
              <Text style={styles.timeSlotText}>Total Private Price :  ₹{price.private_totalPricePerPerson}</Text>
            </View>
          )}

          {/* Group Price (Conditional) */}
          {price.group_PricePerDayPerRerson !== null && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
              <Text style={styles.timeSlotText}>Group Price Per Person  :  ₹{price.group_PricePerDayPerRerson}</Text>
            </View>
          )}

       {price.group_totalPricePerPerson !== null && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
              <Text style={styles.timeSlotText}>Total Group Price  :  ₹{price.group_totalPricePerPerson}</Text>
            </View>
          )}

          {/* Duration Type */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.timeSlotText}>Duration Type:</Text>
            <Text style={styles.timeSlotText}>{price.durationType}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
)}

</View>



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
                       <View style={styles.timeSlotContainer}  key={item.id}>
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
            )}
          </View>
        </GestureHandlerRootView>
      
    </>
  );
};

const styles = StyleSheet.create({
  shimmerWrapper: {
    paddingHorizontal: 20,
  },
  headerShimmer: {
    height: 30,
    width: "100%",
    marginBottom: 20,
    borderRadius: 5,
  },
  textShimmer: {
    height: 20,
    width: "100%",
    height:65,
    marginBottom: 15,
    borderRadius: 8,
  },
  imageShimmer: {
    height: 120,
    width: "100%",
    marginBottom: 20,
    borderRadius: 10,
  },
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
 shimmerContainer: {
  height: 20,
  width: "100%",
  height:80,
  marginBottom: 20,
  borderRadius: 8,
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
    marginHorizontal:20
 
  },
  itemContainer: {
    alignItems: "center",
    margin: 0,
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
    width: 80,
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
    marginVertical:0
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
    paddingVertical: 15,
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
