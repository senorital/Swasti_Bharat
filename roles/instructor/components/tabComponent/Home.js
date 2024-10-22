import React, { useRef, useEffect, useState ,useCallback} from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  BackHandler,
  Alert,
  Platform,
  Button,
  ActivityIndicator,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import NotificationCard from "../../components/notificationCard/notifyCard";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import * as Location from "expo-location";
import { getInstructor } from "../../../../redux/actions/auth/auth";
// import { getYogaStudio } from "../../action/yogaStudio/yogaStudio";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import CarouselItem from "../../components/carousel/CarouselItem";
// import { getTherapist } from "../../action/therapist/therapist";
import { getTutor } from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "expo-linear-gradient";
import { COLORS,  icons } from "../../../../components/constants";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Foundation } from '@expo/vector-icons';
import { getServiceNotification } from "../../../../redux/actions/instructor/notification/notification";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
// import { GET_SERVICE_NOTIFICATION } from "../../constants/actionTypes";
import CustomAlertModal from "../../../../components/CustomAlert/CustomAlert";
import { useFocusEffect } from '@react-navigation/native';
// import AddQualification from "../qualification/AddQuaification";
import EditProfile from "../../../../profile/myprofile/EditProfile";
import { getKYC,getBankDetails } from "../../../../redux/actions/auth/auth";
import { ScreenWidth } from "react-native-elements/dist/helpers";
const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  // const userRole = useSelector((state) => state.auth.instructorData);
  console.log("userRole" + user);
  // const studio = useSelector((state) => state.studio.yogaStudio);
  const bankVerification = useSelector((state) => state.auth.bankVerification);
  const bottomSheetModalRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;
  const cardWidth = (windowWidth - 60) / 2; // Adjust margin and padding
  const cardHeight = cardWidth * (174 / 164); // Maintain aspect ratio
  const [authToken, setAuthToken] = useState(null);
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [therapistTerm, setTherapistTerm] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Combined loading state
  const [showAadhaarNotification, setShowAadhaarNotification] = useState(false);
  const [showBankNotification, setShowBankNotification] = useState(false);


  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [therapist, setTherapist] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [studioTerm, setStudioTerm] = useState(false);
  const [loader, setLoader] = useState(false);
  // const { notifications, unViewedNotification } = useSelector((state) => state.notification);
      const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const snapPoints = ["40%", "90%"];
  const [aadhaarData, setAadhaarData] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [data, setData] = useState([]);
  const [tutor, setTutor] = useState([]);

  const cardsData = [
  
    {
      content: "Home Tutor",
      subContent: "Yoga classes",
      backgroundColor: "rgba(254, 243, 242, 1)",
      borderColor: "#f7bbb9",
      imageSource: icons.tutor,
      // navigateTo: "HomeTutor", this is for home tutor registration
      navigateTo: "FirstHTutorScreen",
    },
    {
      content: "Influencer",
      // subContent: "Therapist",
      subContent: "Coming Soon ....",
      backgroundColor: "rgba(254, 246, 238, 1)",
      borderColor: "#fccfa1",
      imageSource: icons.instructor,
      // navigateTo: "FirstTherapistScreen",
      navigateTo: "ComingSoonInfluencer",
    },
    {
      content: "Yoga Studio",
      // subContent: "Purchase Medicines",
      subContent: "Coming Soon ....",
      backgroundColor: "rgba(254, 243, 242, 1)",
      borderColor: "#f7bbb9",
      imageSource: icons.studio,

      navigateTo: "ComingSoonStudio",
    },

    {
      content: "Therapist",
      // subContent: "yoga influencer",
      subContent: "Coming Soon .....",
      backgroundColor: "rgba(249, 245, 255, 1)",
      borderColor: "lightblue",
      imageSource: icons.theraphy,
      navigateTo: "ComingSoonTherapist",
    },
  ];





 

  const fetchAuthToken = async () => {
    try {
      console.log("Fetching auth token...");

      const token = await AsyncStorage.getItem("authToken");
      console.log("Token :" + token)
      if (token !== null) {
        setAuthToken(token);
      } else {
        console.log("No auth token found");
      }
    } catch (error) {
      console.error("Failed to fetch the auth token:", error);
    }
    
  };

const fetchdatas = async () => {
  try {
    console.log("Fetching datas...");

    setErrorMsg('');

    // Fetch data
    const res1 = await dispatch(getKYC());
    const res = await dispatch(getBankDetails());

    // Initialize flags
    let aadhaarExists = false;
    let bankExists = false;

    // Check and set Aadhaar data
    if (res1.success && res1.data) {
      setAadhaarData(res1.data.aadharNumber);
      console.log(res1.data.aadharNumber);
      aadhaarExists = true;
    } else {
      setAadhaarData(null);
    }

    // Check and set Bank data
    if (res.success && res.data && res.data.length > 0) {
      console.log(res.data[0].bankName);
      setBankData(res.data[0].bankName);
      bankExists = true;
    } else {
      setBankData(null);
    }

    // Set visibility flags based on data existence
    console.log(aadhaarExists)
    console.log(bankExists)

    setAadhaarCardVisible(aadhaarExists);
    setBankCardVisible(bankExists);

  } catch (error) {
    console.error("Error fetching data:", error);
    setErrorMsg("Failed to fetch data");
    setAadhaarData(null);
    setBankData(null);
  }
};

const [aadhaarCardVisible, setAadhaarCardVisible] = useState(false);
const [bankCardVisible, setBankCardVisible] = useState(false);



  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...");

      const res = await dispatch(getServiceNotification());
      console.log(res.success)
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setErrorMsg("Failed to fetch notifications");
    }
   
  };

  const getLocation = async () => {
    
    setErrorMsg(null);
    setAddress(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setAddress(geocode[0]);
    } catch (error) {
      setErrorMsg("Error fetching location");
      console.error(error);
    }
   
  };

  const fetchData = async () => {
    try {
      // setLoading(true);
      console.log("Fetching data...");

      const res = await dispatch(getInstructor());
      console.log("PofileComplete :" + res.data.profileComplete)
      const profileComp = res.data.profileComplete;
      console.log("Instructor1234 :" + res.data.data.qualifications)
      console.log("ProfileComplete :" + res.data.profileComplete)
      setProfileComplete(profileComp);
      // Fetch KYC details
   

     console.log("qre : " +res.data.data.qualifications)
      setQualification(res.data.data.qualifications);
      console.log("terms : " +res.data.data.homeTutorTermAccepted)

      setTermsAndConditions(res.data.data.homeTutorTermAccepted);
    //   setTherapistTerm(res.data.instructor.therapistTermAccepted);
      // setStudioTerm(res.data.instructor.yogaStudioTermAccepted);
    } catch (error) {
      console.error("Error fetching data123:", error);
      const msg = error.res?.data?.data.message;
   
    }
    // finally {
    //   setLoading(false);
    // }
  };
  // const handleKYCResponse = async () => {
  //   try {
  //     const { data } = await getKYC(); // API call
  
  //     const hasValidData = Array.isArray(data) && data.length > 0;
  //     console.log("KYC Response Length: " + (hasValidData));
  
  //     setShowAadhaarNotification(!hasValidData);
  //   } catch (error) {
  //     console.error("Error fetching KYC details:", error);
  //     setShowAadhaarNotification(true);
  //   }
  // };
  // const fetchBankDetails = async () => {
  //   try {
  //     const bankResponse = await getBankDetails(); // API call
  
  //     // Log the entire response for debugging
  //     console.log("Bank Details Response: ", bankResponse);
  
  //     // Ensure bankResponse and its properties exist
  //     const { data } = bankResponse;
  
  //     const hasValidData = Array.isArray(data) && data.length > 0;
  
  //     setShowBankNotification(!hasValidData);
  
  //     // Log the notification state right after setting it
  //     console.log("Bank Notification State: ", !hasValidData);
  //   } catch (error) {
  //     console.error("Error fetching bank details:", error);
  //     setShowBankNotification(true);
  //   }
  // };
  
  const fetchTutors = async () => {
    try {
      // setLoading(true);
      console.log("Fetching tutors...");

      const res = await dispatch(getTutor());
    
      setTutor(res.data);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data234:", error);
      const msg = error.response.data.message;
    } 
    
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
  
      // Run all async operations in parallel
      const fetchTasks = Promise.all([
        fetchAuthToken(),
        fetchNotifications(),
        getLocation(),
        fetchData(),
        fetchdatas(),
        fetchTutors(),
        // getLocation()
      ]);
  
      // Ensure a minimum loading time of 1 second
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));
  
      // Wait for both the fetch tasks and the minimum loading time to complete
      await Promise.all([fetchTasks, minLoadingTime]);
  
      setLoading(false);
    };
  
    loadData();
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
       
  
        // Run all async operations in parallel
        const fetchTasks = Promise.all([
          fetchAuthToken(),
          getLocation(),
          fetchData(),
          fetchTutors(),
        ]);
  
        // Ensure a minimum loading time of 1 second
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));
  
        // Wait for both the fetch tasks and the minimum loading time to complete
        await Promise.all([fetchTasks, minLoadingTime]);
  
        setLoading(false);
      };
  
      loadData();
    }, [dispatch])
  );

  useEffect(() => {
    const backAction = () => {
      setIsModalVisible(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleConfirm = () => {
    BackHandler.exitApp();
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

 

  useEffect(() => {
    return () => {
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current.close();
      }
    };
  }, []);

  const handleHomeTutorPress = (tutorId) => {
    navigation.navigate("ShowHomeTutor", { id: tutorId });
  };
 
  const approvedTutors = data ? data.filter(
    (tutor) => tutor.approvalStatusByAdmin === "Approved"
  ) : [];
  
  const reviewTutors = data ? data.filter(
    (tutor) => tutor.approvalStatusByAdmin === "Pending"
  ) : [];
  
  const draftTutors = data ? data.filter(
    (tutor) => tutor.approvalStatusByAdmin === null
  ) : [];
    const combinedTutors = [...reviewTutors, ...draftTutors];

    const renderTutors = (tutors, tab) => {
      // console.log("tutor.length :" + tutor.length)
      if (tutor.length === 0) {
       const card = "Home Tutor";
        return (
          <TouchableWithoutFeedback
          key={0}
          onPress={() => {
            const hasQualificationIn = (type) => {
              return qualification.some(
                (q) => q.qualificationIn === type
              );
            };
              
           
            if (
              termsAndConditions === true &&
              card === "Home Tutor" &&
              tutor.length === 0 && hasQualificationIn("HomeTutor")
            ) {
              navigation.navigate("HomeTutor");
            } else {

              if (card === "Home Tutor") {
                
                if (termsAndConditions === true) {
                  console.log(1);
                  console.log(profileComplete);
                  navigation.navigate(
                    (hasQualificationIn("HomeTutor") && profileComplete > 30)

                      ? "AllHomeTutor"
                      : "AddQualification",
                      console.log(2),

                  );
                } else {
                 
                   if(termsAndConditions === true){
                    console.log(3),

                  Toast.show({
                    type: "info",
                    // text1: "Qualification Needed",
                    text2:
                      "Please Complete your profile.",
                    visibilityTime: 3000,
                    autoHide: true,
                  });
                  navigation.navigate(EditProfile);
             
              } else {
                console.log(4),

                navigation.navigate("FirstHTutorScreen");

              }
            }
              }
             
              else {
                navigation.navigate("FirstHTutorScreen");
              }
            }
          }}
        >
          
                <View style={{ marginLeft: 17,marginBottom:10 }}>
            <View style={[styles.cardContainer,{padding:12,flexDirection:'column',justifyContent:'center',alignItems:'center',borderStyle:'dashed',borderColor:COLORS.black,borderWidth:1}]}>
            <AntDesign name="plussquare" size={27} color={COLORS.primary} />

             <Text style={[styles.text,{fontSize:13,margin:12,textAlign:'center'}]}>Start Listing your classes what you providing as a Home tutor</Text>
             </View>
             </View>
             </TouchableWithoutFeedback>
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
          <View style={{ marginLeft: 17,marginBottom:10 }}  key={index}>
          <TouchableWithoutFeedback
            onPress={() => handleHomeTutorPress(tutor.id)}
            style={{ marginRight: 10 }}
            
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
                <Text style={{ fontFamily: "Poppins", fontSize: 12, width: 180 }}numberOfLines={1}ellipsizeMode="tail"
                   >
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
               
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          </View>
        );
      });
    };


    
    const renderSessions = (tutors, tab) => {
      if (tutors.length === 0) {
        return (
          <View style={{ marginLeft: 17 }}>
          <View style={{flexDirection:'row'}}>
          <ShimmerPlaceholder style={{width:290,height:120,borderRadius:10,marginRight:15}}/>
          <ShimmerPlaceholder style={{width:290,height:120,borderRadius:10}}/>
             </View>     
             </View>
        );
      }
      return tutors.map((tutor, index) => {
        const tutorImage =
          tutor.images && tutor.images.length > 0
            ? tutor.images[0].path
            : null;
        return (
          <View style={{ marginLeft: 17 }} key={index}> 
            <View style={styles.sessionCard}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      tutorImage
                        ? { uri: tutorImage }
                        : require("../../../../assets/get-screen/tutor1.jpg")
                    }
                    style={styles.image}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.sessionTypeContainer}>
                    <Text style={styles.sessionTypeText}>Pallavi</Text>
                    {/* <FontAwesome6
                      name="location-arrow"
                      size={20}
                      color="black"
                      style={styles.locationIcon}
                    /> */}
                  <MaterialIcons name="assistant-direction" size={30} color={COLORS.directions} style={{justifyContent:'center',marginTop:10}} />
                  </View>
                  <Text style={[styles.addressText,{marginTop:-5}]}>
                    68 Ashoka road, New Delhi
                  </Text>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={{flexDirection:'row'}}>
              <Ionicons name="calendar-outline" size={20} color="black" style={{padding:10,backgroundColor:COLORS.icon_background,borderRadius:10,borderColor:COLORS.notifyicon,borderWidth:1}} />
             
              <View style={[styles.detailsContainer,{marginLeft:10}]}>
                  <View style={styles.sessionTypeContainer}>
                    <Text style={[styles.sessionTypeText,{fontSize:13,fontFamily:'Poppins-Medium'}]}>Thursday, 16 July 2024</Text>
                    {/* <FontAwesome6
                      name="angle-right"
                      size={20}
                      color="black"
                      style={styles.locationIcon}
                    /> */}
                    <Image source={icons.arrow_right} style={{height:20,width:20,marginTop:12}}></Image>
                  </View>
                  <Text style={[styles.addressText,{fontFamily:'Poppins-Light'}]}>
                   10:00 AM to 11:00 AM
                  </Text>
                </View>
           </View>
           </View>
           </View>

        );
      });
    };
    
 
      
 
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}   showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
            {loading  ? (
              <>
              <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >

                    <View>
                      <ShimmerPlaceholder style={styles.text} />
                      <ShimmerPlaceholder
                        style={[styles.shimmerText, { marginVertical: 10 }]}
                      />
                      <ShimmerPlaceholder style={styles.text} />
                    </View>
                    <ShimmerPlaceholder style={styles.shimmerButton} />
                  </View>
                  <View style={{ marginTop: 15 }}>
                    <ShimmerPlaceholder
                      style={{ borderRadius: 10, height: 120, width: wp(90) }}
                    />
                  </View>
                  <View style={{ marginTop: 15 }}>
                    <ShimmerPlaceholder
                      style={{ borderRadius: 10, height: 130, width: wp(90) }}
                    />
                  </View>
                  <View style={{ marginVertical: 10 }}>
                  <ShimmerPlaceholder style={[styles.text,{marginVertical:10}]} />
                    <View style={{flexDirection:'row' }}>
                      <ShimmerPlaceholder
                        style={{ borderRadius: 10, height: 120, width: 290 }}
                      />
                      <ShimmerPlaceholder style={{   borderRadius: 10, height: 120, width: 290 
                        ,marginLeft:17}}
                      />
                    </View>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                  <ShimmerPlaceholder style={[styles.text,{marginVertical:10}]} />
                    <View style={{flexDirection:'row' }}>
                      <ShimmerPlaceholder
                        style={{ borderRadius: 10, height: 120, width: 290 }}
                      />
                      <ShimmerPlaceholder style={{  marginLeft:17, borderRadius: 10, height: 120, width: 290 
                        }}
                      />
                    </View>
                    </View>
                </View>
              </>
            ) : 
            (
              <>
        <View style={styles.topHeader}>
                  <View style={{ width: "90%" }}>
                    <Text
                      style={[styles.text, { fontSize: RFPercentage(2.5), lineHeight: 32,fontFamily: "Poppins-SemiBold" }]}
                    >
                     
                      {user.data && (
                        
                        <Text style={{ fontFamily: "Poppins-SemiBold" }}>
                         {/* { console.log("user.data.name :" + user.name)} */}
                         Hi,&nbsp;
                         
                          {user.data.name}


                        </Text>
                      )}
                      {/* {console.log("Location :" + user.data.location)} */}
                       &nbsp;!
                    </Text>
                   
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#0000ff" />
                      </View>
                    ) : errorMsg ? (
                     
                      <View style={styles.errorContainer}>
                        
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
        {/* {user.data.location !== 'null' && user.data.location !== undefined 
          ? user.data.location 
          : 'Location is not enabled. Please enable it.'} */}
          Location is not enabled. Please refresh it.
      </Text>
      <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
        <Ionicons name="refresh" size={20} color="black" />
      </TouchableOpacity>  
                      </View>
                    ) : address ? (
                      <View style={styles.addressContainer}>
                        <Text style={styles.addressText}  numberOfLines={1} ellipsizeMode="tail">
                          {address.name ? address.name + ", " : ""}
                          {address.street ? address.street + ", " : ""}
                          {address.city ? address.city + ", " : ""}
                          {address.region ? address.region + ", " : ""}
                          {address.postalCode ? address.postalCode : ""}
                        </Text>
                        <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
        <Ionicons name="refresh" size={20} color="black" />
      </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={{ marginTop: 10}}>
                  {/* <CarouselItem /> */}
                </View>
                <View style={styles.subContainer}>
                <Text style={styles.title}>List yourself as</Text>
                <View style={styles.cardContainers}>
                
                  {cardsData.map((card, index) => (
                    <View key={index}>
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.card,
                        {
                          width: 50,
                          backgroundColor: COLORS.primary,
                          alignItems:'center',
                          padding:7,
                          justifyContent:'center',
                          marginHorizontal: wp(4),
                          // marginHorizontal: 15,

                        },
                      ]}

                      onPress={() => {
                        const hasQualificationIn = (type) => {
                          return qualification.some(
                            (q) => q.qualificationIn === type
                          );
                        };
                         console.log("Length : " + tutor.length)
                         console.log("cardcontent : " + card.content)
                         console.log("hasQualificationIn : " + hasQualificationIn)
                         
                       
                        if (
                          termsAndConditions === true &&
                          card.content === "Home Tutor" &&
                          tutor.length === 0 && hasQualificationIn("HomeTutor")
                        ) {
                          navigation.navigate("HomeTutor");
                        } else {

                          if (card.content === "Home Tutor") {
                            
                            if (termsAndConditions === true) {
                              console.log(1);
                              console.log(profileComplete);
                              navigation.navigate(
                                (hasQualificationIn("HomeTutor") && profileComplete > 30)

                                  ? "AllHomeTutor"
                                  : "AddQualification",
                                  console.log(2),

                              );
                            } else {
                             
                               if(termsAndConditions === true){
                                console.log(3),

                              Toast.show({
                                type: "info",
                                // text1: "Qualification Needed",
                                text2:
                                  "Please Complete your profile.",
                                visibilityTime: 3000,
                                autoHide: true,
                              });
                              navigation.navigate(EditProfile);
                         
                          } else {
                            console.log(4),

                            navigation.navigate(card.navigateTo);
 
                          }
                        }
                          }
                         
                          else {
                            navigation.navigate(card.navigateTo);
                          }
                        }
                      }}
                      
                    >
                      {/* <View
                        style={[
                          styles.imageContainer
                        ]}
                      > */}
                        <Image
                          style={{ width: 35, height: 35,resizeMode:'contain' }}
                          source={card.imageSource}
                        />
                        
                    
                      {/* </View> */}
                     
                    </TouchableOpacity>
                    <Text style={styles.cardtext}>{card.content}</Text>
                    </View>
                    
                  ))}
                  
                </View>
                </View>
                {profileComplete !== 100 && (

                <View style={{marginVertical:10}}>
        <NotificationCard  
       title='Complete your profile !'
       text='Complete your profile today and start enjoying all the benefits of our community!'
       icon={<Ionicons name="information-circle" size={18} color="#6BBBFF" />}
       color1='#E3F1FE'
       color2='#FFFFFF'
       progress={profileComplete}
       isProfileCompletion={true}
       borderColor='#6BBBFF'
       navigateTo='EditProfile'
        />
    </View>
       )}
    <View>
    {!aadhaarCardVisible || profileComplete == 30 && (
        <View style={{ marginVertical: 2 }}>
          <NotificationCard
            title="Please complete your Aadhaar Verification Details!"
            text="Complete your profile today and start enjoying all the benefits of our community!"
            icon={<Foundation name="alert" size={18} color="#FF403F" />}
            color1="#FFEEEE"
            color2="#FFFFFF"
            progress={profileComplete}
            isProfileCompletion={false}
            borderColor="#FF403F"
            navigateTo="AadharVerification"
          />
        </View>
      )}
       {!bankCardVisible || profileComplete == 30 && (
        <View style={{ marginVertical: 10 }}>
          <NotificationCard
            title="Please complete your Bank Details!"
            text="Complete your profile today and start enjoying all the benefits of our community!"
            icon={<Ionicons name="checkmark-circle" size={18} color="#55CB97" />}
            color1="#D5FFED"
            color2="#FFFFFF"
            progress={profileComplete}
            isProfileCompletion={false}
            borderColor="#55CB97"
            navigateTo="BankVerification"
          />
        </View>
      )}
    </View>
    <Text style={[styles.title,{marginHorizontal:20,marginTop:10,marginBottom:10}]}>Your Classes Listings</Text>
    <ScrollView horizontal>{renderTutors(combinedTutors, 1)}</ScrollView>
              </>
            )}

       
          {/* <Text style={[styles.title,{marginHorizontal:20,marginTop:15,marginBottom:10}]}>Your Upcoming Sessions</Text>
          <ScrollView horizontal>{renderSessions(combinedTutors, 1)}</ScrollView> */}

          

           </View>
           </ScrollView>
         
           <CustomAlertModal
        visible={isModalVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image :{
  width:45,
  height : 45,
  borderRadius:50
  },
  cardtext : {
    fontFamily: "Poppins-Medium",
    // fontSize:10,
    fontSize: RFPercentage(1.6),
    lineHeight:30,
    textAlign:'center'
    
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hr: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    opacity: 0.1,
    marginTop: 50,
 
    // width:'100%'
    
  },
  subContainer : {
  backgroundColor: COLORS.white,
  marginHorizontal:17,
  borderRadius:10,
  marginTop:10,padding:10,
  borderColor: "#f7f2f2",
  borderWidth: 1,
  shadowColor:'#000',
  shadowOffset:2
  },
  topHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  title :{
  fontFamily:'Poppins-Medium',
  fontSize:16,
  marginBottom:5,
  textAlign:'left'
  },
  text: {
    fontFamily: "Poppins",
  },
  cardContainers: {
    justifyContent: 'center', 
    marginTop:10,
    marginHorizontal: 10,
    flexDirection:'row'
  },
  card: {
    borderRadius: 10,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontFamily: "Poppins",
    fontSize: hp(2.2),
    fontWeight: "500",
    marginBottom: 10,
  },

  addButtonText: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  studioCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  leftContent: {
    marginRight: 20,
  },
  studioImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  rightContent: {
    flex: 1,
  },
  studioName: {
    fontFamily: "Poppins",
    fontSize: hp(2),
    fontWeight: "500",
    marginBottom: 5,
  },
  studioAddress: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  icon :{
  width : 30,
  height: 30,
  justifyContent:'space-between'  
  },
  arrowIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  refreshButton: {
    // padding: 5,
  },
  addressText: {
    fontSize: 12,
    fontFamily: "Poppins",
    flex: 1,
    marginRight: 10,
    color: 'black',
  },
  tutorImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  locationText: {
    color: "#00f",
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  errorText: {
    color: "#f00",
  },
  retryText: {
    color: "#00f",
    textDecorationLine: "underline",
  },
  addressContainer: {
    // paddingRight: 10,
    // lineHeight: 20,
    textAlign: "justify",
    flexDirection: "row",
  },
  shimmerButton: {
    width: wp(15),
    height: hp(8),
    borderRadius: 10,
  },
  shimmerText: {
    width: wp(70),
    height: hp(2),
  },
  dateText: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-SemiBold",
    textAlign:'left'
  },
  cardContainer: {
    flexDirection: "row",
    // marginVertical: 10,
    // elevation:2,
    shadowColor: '#000',
    shadowOffset: 1,
    padding: 10,
    width:290,
    // height:120,
    marginHorizontal:0,
    borderColor: "#f7f2f2",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  leftContainer: {
    marginRight: 5,
  },
  rightContainer: {
    marginLeft: 8,
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
    fontFamily: "Poppins-Medium",
    backgroundColor: COLORS.primary
  },
  sessionCard: {
    // flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width:290,
    borderColor: "#f7f2f2",
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  
  },
  imageContainer: {
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    // justifyContent: 'center',
  },
  tutorImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure the text and icon are vertically aligned
   alignContent:'center'

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTypeText: {
    fontSize: 16,
    fontFamily:'Poppins-Medium',
    color: 'black',
  },
  locationIcon: {
    marginLeft: 5,
  },
  separator: {
    position: "relative",
    width: "100%",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    opacity: 0.1,
    marginVertical:10
  },
  dateTimeContainer: {
    // padding: 16,
//  flex: 1

  },
  timeText: {
    
    fontSize: 14,
    fontFamily:'Poppins'
   },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
  },

});

export default Home;
 // function handlePresentModal() {
  //   bottomSheetModalRef.current?.present();
  // }

  // const handleStudioSelection = (studioId) => {
  //   if (bottomSheetModalRef.current) {
  //     bottomSheetModalRef.current.close();
  //   }
  //   navigation.navigate("YogaStudioScreen", { id: studioId });
  // };

  // const handleNewBusiness = () => {
  //   if (bottomSheetModalRef.current) {
  //     bottomSheetModalRef.current.close();
  //   }
  //   navigation.navigate("YStudioForm");
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await dispatch(getTherapist());
  //       // console.log(res)
  //       setTherapist(res.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       const msg = error.response.data.message;
  //       if (msg === "Please complete your profile!") {
  //         console.log("Navigating to ProfileOverview");
  //         setTimeout(() => {
  //           navigation.navigate("ProfileOverview");
  //         }, 3000);
  //       } else {
  //         Toast.show({
  //           type: "error",
  //           text1: msg || "An error occurred. Please try again.",
  //           visibilityTime: 2000,
  //           autoHide: true,
  //         });
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch]);

 // useEffect(() => {
  //   if (studio && studio.data) {
  //     setData(studio.data);
  //   }
  // }, [studio]);
//  console.log("USER DATA : " + user.data.name)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoader(true);
  //       const res = await dispatch(getInstructor());
  //       console.log(res.data);
  //       setQualification(res.data.qualifications);
  //       setTermsAndConditions(res.data.homeTutorTermAccepted);
  //       setTherapistTerm(res.data.therapistTermAccepted);
  //       setStudioTerm(res.data.yogaStudioTermAccepted);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       const msg = error.response?.data?.message;
  //       const statusCode = error.response?.status;
  //       console.log(statusCode);
  //       // if (msg === "Please complete your profile!") {
  //       //   // console.log("Navigating to ProfileOverview");
  //       //   // setTimeout(() => {
  //       //   //   navigation.navigate("ProfileOverview");
  //       //   // }, 3000);
  //       // } else {
  //       //   Toast.show({
  //       //     type: "error",
  //       //     text1: msg || "An error occurred. Please try again.",
  //       //     visibilityTime: 2000,
  //       //     autoHide: true,
  //       //   });
  //       // }
  //     } finally {
  //       setLoader(false);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch, navigation]);



  // console.log("therapist", address);
  // console.log(location)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await dispatch(getYogaStudio());
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       const msg = error.response.data.message;
  //       if (msg === "Please complete your profile!") {
  //         console.log("Navigating to ProfileOverview");
  //         setTimeout(() => {
  //           navigation.navigate("ProfileOverview");
  //         }, 3000);
  //       } else {
  //         Toast.show({
  //           type: "error",
  //           text1: msg || "An error occurred. Please try again.",
  //           visibilityTime: 2000,
  //           autoHide: true,
  //         });
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [dispatch]);
    {/* <Text style={[styles.title,{marginHorizontal:20,marginTop:10}]}>Your Upcoming Sessions</Text> */}
           {/* <Text style={[styles.title,{marginHorizontal:20,marginTop:10}]}>Your Upcoming Sessions</Text> */}

        {/* </ScrollView> */}

        {/* <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Business</Text>
            {data.map((studio, index) => (
              <TouchableOpacity
                key={index}
                style={styles.studioCard}
                onPress={() => handleStudioSelection(studio.id)}
              >
                <View style={styles.leftContent}>
                  <Image
                    source={require("../../assets/home/menu.png")}
                    style={styles.studioImage}
                  />
                </View>
                <View style={styles.rightContent}>
                  <Text style={styles.studioName}>{studio.businessName}</Text>
                  <Text style={styles.studioAddress}>
                    {studio.street_colony}
                  </Text>
                  <FontAwesome
                    name="angle-right"
                    size={24}
                    color="black"
                    style={styles.arrowIcon}
                  />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleNewBusiness}
            >
              <Text style={styles.addButtonText}>Add New Business</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal> */}
