import React, { useRef, useEffect, useState ,useCallback} from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
  Image,NativeModules,
  Dimensions,
  BackHandler,
  Alert,
  Platform,
  Button,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { BottomSheetModal, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Avatar } from "react-native-elements";
import DenyLocation from "../../../../auth/login/DenyLocation";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import NotificationCard from "../../components/notificationCard/notifyCard";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import * as Location from "expo-location";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import CustomAlertModal from "../../../../components/CustomAlert/CustomAlert";
import { useFocusEffect } from '@react-navigation/native';
import EditProfile from "../../../../profile/myprofile/EditProfile";
import { getKYC,getBankDetails } from "../../../../redux/actions/auth/auth";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { setLocationAddress,clearLocationAddress } from "../../../../redux/actions/instructor/locationActions/locationActions";
import HomeTutorBooking from "../booking/HomeTutorBooking";
import { backgroundUpload } from "react-native-compressor";
import NetInfo from "@react-native-community/netinfo";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true); // Network status
  const [isFetching, setIsFetching] = useState(false); // Fetching status
  const [isOffline, setIsOffline] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const cardWidth = (windowWidth - 60) / 2; // Adjust margin and padding
  const cardHeight = cardWidth * (174 / 164); // Maintain aspect ratio
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState([]);

  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [therapistTerm, setTherapistTerm] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Combined loading state
  const [showAadhaarNotification, setShowAadhaarNotification] = useState(false);
  const [showBankNotification, setShowBankNotification] = useState(false);
  const { ExitApp } = NativeModules;
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [qualification, setQualification] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [bio, setbio] = useState('');
  const [qualifications, setQualifications] = useState([]);

  const [aadhaarData, setAadhaarData] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [data, setData] = useState([]);
  const [tutor, setTutor] = useState([]);
  const [aadhaarCardVisible, setAadhaarCardVisible] = useState(false);
  const [bankCardVisible, setBankCardVisible] = useState(false);
  const cardsData = [
  
    {
      content: "Home Tutor",
      subContent: "Yoga classes",
      backgroundColor: "rgba(254, 243, 242, 1)",
      borderColor: "#f7bbb9",
      imageSource: icons.tutor,
      navigateTo: "FirstHTutorScreen",
    },
    {
      content: "Classes",
      subContent: "Coming Soon ....",
      backgroundColor: "rgba(254, 246, 238, 1)",
      borderColor: "#fccfa1",
      imageSource: icons.instructor,
      navigateTo: "HomeTutorBooking",
    },
  ];


  const fetchAuthToken = async () => {
    try {

      const token = await AsyncStorage.getItem("authToken");
      if (token !== null) {
        setAuthToken(token);
        console.log("Token :"+token)
      } else {
      }
    } catch (error) {
      console.error("Failed to fetch the auth token:", error);
    }
    
  };

const fetchdatas = async () => {
  try {

    setErrorMsg('');

    // Fetch data
    const res1 = await dispatch(getKYC());
    const res = await dispatch(getBankDetails());
     let aadhaarExists = false;
    let bankExists = false;

    // Check and set Aadhaar data
    if (res1?.success && res1?.data) {
      setAadhaarData(res1?.data?.aadharNumber);
      aadhaarExists = true;
      setAadhaarCardVisible(aadhaarExists);

    } else {
      setAadhaarData(null);
      setAadhaarCardVisible('');

    }

    // Check and set Bank data
    if (res?.success && res?.data && res?.data?.length > 0) {
      setBankData(res?.data[0]?.bankName);
      bankExists = true;
      setBankCardVisible(bankExists);

    } else {
      setBankData(null);
      setBankCardVisible('');

    }

 


  } catch (error) {
    // console.error("Error fetching data:", error);
    setErrorMsg("Failed to fetch data");
    setAadhaarData(null);
    setBankData(null);
  }
};





  const fetchNotifications = async () => {
    try {

    const res = await dispatch(getServiceNotification());
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setErrorMsg("Failed to fetch notifications");
    }
   
  };


 

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    dispatch(clearLocationAddress());
  
    try {
      // Request foreground permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Permission to access location was denied.");
        setLoading(false);
  
        // Fetch roles from AsyncStorage
        const roles = await AsyncStorage.getItem('roles');
  
        // Navigate to DenyLocation with roles
        navigation.navigate('DenyLocation', { roles });
        return;
      }
  
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        setErrorMsg("Permission to access location was denied or location services are disabled");
        setLoading(false);
  
        // Fetch roles from AsyncStorage
        const roles = await AsyncStorage.getItem('userRole');
  
        // Navigate to DenyLocation with roles
        navigation.navigate('DenyLocation', { roles });
        return;
      }
  
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
  
      // Reverse geocode to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
  
      if (location) {

        setAddress(geocode[0].formattedAddress);
        dispatch(setLocationAddress(geocode[0].formattedAddress));
      }
  
      dispatch(setLocationAddress(geocode[0].formattedAddress));
    } catch (error) {
  
      // Handle location request errors
      if (error.message === "Location request failed due to unsatisfied device settings") {
        setErrorMsg("Location request failed due to unsatisfied device settings");
  
        // Fetch roles from AsyncStorage
        const roles = await AsyncStorage.getItem('userRole');
  
        // Navigate to DenyLocation with roles
        navigation.navigate('DenyLocation', { roles });
      } else {
        setErrorMsg("Error fetching location");
      }
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const netInfo = await NetInfo.fetch();
  
        if (netInfo.isConnected) {
          // Run all async operations in parallel
          const fetchTasks = Promise.all([
            fetchAuthToken(),
            getLocation(),
            fetchdatas(),
            fetchData(),
            fetchTutors(),
          ]);
          const minLoadingTime = new Promise((resolve) =>
            setTimeout(resolve, 1000)
          );
          await Promise.all([fetchTasks, minLoadingTime]);
  
          setLoading(false);
        } else {
          // Handle offline behavior, e.g., show a message or cached data
          console.log("App is offline. Skipping data fetch.");
          setLoading(false);
        }
      };
  
      loadData();
    }, [dispatch])
  );


  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await dispatch(getInstructor());
      // const profileComp = res?.data?.profileComplete;
      setUser(res?.data);
      console.log("res :"+ res?.data)
      setbio(res?.data?.data?.bio);
      setProfileComplete(res?.data?.profileComplete);
      const qualificationsData = res?.data?.data?.qualifications;
      setQualifications(qualificationsData);

      // Check if qualifications is an array and if its length is 0
      if (Array.isArray(qualificationsData) && qualificationsData.length === 0) {
        // Handle the case where there are no qualifications
      } 

      setQualification(res?.data?.data?.qualifications);

      setTermsAndConditions(res?.data?.data?.homeTutorTermAccepted);
     } catch (error) {
      // console.error("Error fetching data123:", error);
      const msg = error.res?.data?.data.message;
     
    }
    finally {
      setLoading(false);
    }
  };
  
  const fetchTutors = async () => {
    try {
      const response = await dispatch(getTutor());
      console.log("Response:", response);
  
      if (response?.data?.length > 0) {
        setTutor(response?.data); // Set valid data
        setData(response?.data);  // Set valid data
      } else {
        setTutor([]);
        setData([]);  
      }
    } catch (error) {
      // console.error("Error fetching tutors:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      // console.error("Error message:", errorMessage);
      // ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
     }
  };
  

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const locationSuccess = await getLocation();
        if (!locationSuccess) {
          throw new Error("Unable to fetch location");
        }

        await Promise.all([
          fetchAuthToken(),
          fetchNotifications(),
          fetchData(),
          fetchdatas(),
          fetchTutors(),
        ]);
      } catch (err) {
        // ToastAndroid.show("Error loading data: " + err.message, ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadData();

    // Network status listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);

      setIsConnected(state.isConnected);
      if (state.isConnected) {
        
        ToastAndroid.show("Back online. Fetching data...", ToastAndroid.SHORT);
        loadData();
      } else {
        ToastAndroid.show("You are offline", ToastAndroid.SHORT);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  
  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     // setError(null);

  //     try {
  //       // First, attempt to get the location
  //       const locationSuccess = await getLocation();
  //       if (!locationSuccess) {
  //         throw new Error('Unable to fetch location');
  //       }

  //       // Once location is fetched, proceed with other async tasks
  //       await Promise.all([
  //         fetchAuthToken(),
  //         fetchNotifications(),
  //         fetchData(),
  //         fetchdatas(),
  //         fetchTutors(),
  //       ]);
  //     } catch (err) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, []);

  
    


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
    ExitApp.exitApp();  // Calls the native module to fully close the app

  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

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
    const combinedTutors = [...reviewTutors, ...draftTutors,...approvedTutors];

    const renderTutors = (tutors, tab) => {
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
                   navigation.navigate(
                    (hasQualificationIn("HomeTutor") && profileComplete > 30)

                      ? "AllHomeTutor"
                      : "AddQualification",

                  );
                } else {
                 
                   if(termsAndConditions === true){

                  Toast.show({
                    type: "info",
                    text2:
                      "Please Complete your profile.",
                    visibilityTime: 3000,
                    autoHide: true,
                  });
                  navigation.navigate(EditProfile);
             
              } else {

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
          
                <View style={{marginBottom:10,paddingHorizontal:20 }}>
            <View style={[styles.cardContainer,{flexDirection:'column',justifyContent:'center',alignItems:'center',borderStyle:'dashed',borderColor:COLORS.black,borderWidth:1}]}>
            <AntDesign name="plussquare" size={27} color={COLORS.primary} />

             <Text style={[styles.text,{fontSize:13,margin:12,textAlign:'center'}]}>Start Listing your classes what you providing as a Home tutor</Text>
             </View>
             </View>
             </TouchableWithoutFeedback>
              );

      }

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
        

      return uniqueTutors.map((tutor, index) => {
        const tutorImage =
          tutor.images && tutor.images.length > 0
            ? tutor.images[0].path
            : null;
        return (
          <View style={{ marginBottom:10 , marginHorizontal:10}}  key={index}>
          <TouchableWithoutFeedback
            onPress={() => handleHomeTutorPress(tutor.id)}
            style={{ marginRight: 10 }}
            
          >
            <View style={styles.cardContainer}>
            <View style={{ flexDirection: "row",  alignItems: "flex-start" }}>
  {/* Image */}
  <Image
    source={
      tutorImage
        ? { uri: tutorImage }
        : require("../../../../assets/get-screen/bydefault.jpg")
    }
    style={styles.tutorImage}
  />

  {/* Text Content */}
  <View style={{ flex: 1, marginLeft: 10 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={styles.dateText}>
        {tutor.currentSlot ? tutor.currentSlot.serviceType : "No Service Type"}
      </Text>

      <Text
        style={{
          borderColor: COLORS.directions,
          borderRadius: 6,
          borderWidth: 1,
          padding: 3,
          fontFamily: "Poppins-Medium",
          fontSize: 9,
          color: COLORS.directions,
          textAlign: "center",
        }}
      >
        {tutor.approvalStatusByAdmin === "Approved"
          ? "APPROVED"
          : tutor.approvalStatusByAdmin === "Pending"
          ? "REVIEW"
          : "DRAFT"}
      </Text>
    </View>

    {/* Second Row: Location */}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins",
          fontSize: 12,
          flex: 1,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {tutor.currentArea ? tutor.currentArea.locationName : "No Area"}
      </Text>
    </View>

    {/* Third Row: Current Slot and Sunday */}
    {tutor.currentSlot && (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        {tutor.currentSlot.time && (
          <Text
          style={styles.timeslot}
          >
            {tutor.currentSlot.time} -{" "}
            {calculateEndTime(tutor.currentSlot.time, tutor.currentSlot.timeDurationInMin)}
          </Text>
        )}

        {tutor.currentSlot?.startDate && (
          <Text style={styles.price}>
            {formatDate(tutor.currentSlot.startDate)}
          </Text>
        )}
      </View>
    )}
  </View>
</View>


            </View>
          </TouchableWithoutFeedback>
          </View>
        );
      });
    };


    
  
 
   
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>

      <StatusBar backgroundColor={COLORS.primary} style="light"  />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}   showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
         
            {loading || isOffline ? (
              <>
              <View style={{ marginTop: 60, paddingHorizontal: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >

                    <View>
                    {loading ? (
                     <View>
                      <ShimmerPlaceholder style={styles.text} />
                      <ShimmerPlaceholder
                        style={[styles.shimmerText, { marginVertical: 10 }]}
                      />
                      <ShimmerPlaceholder style={styles.text} />
                      </View>
                    ) : (
                  <Text style={[styles.text,{fontFamily: "Poppins-SemiBold",fontSize: RFPercentage(2.5)}]}>
                    Hi, {user?.data?.name || "Guest"}!
                  </Text>
                )}
                    </View>

                    <ShimmerPlaceholder style={styles.shimmerButton} />
                    
                  
                  </View>
                 
                  {/* list yourself as */}
                  {/* <View style={{ marginTop: 15, backgroundColor:'white' }}>
                    <ShimmerPlaceholder
                      style={{ borderRadius: 10, height: 120, width: wp(90) }}
                    />

                  </View> */}

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
                                width: 120,
                                backgroundColor: COLORS.primary,
                                alignItems:'center',
                                padding:10,
                                // justifyContent:'center',
                                marginHorizontal: wp(4),
                              
      
                              },
                            ]}
      
                            onPress={() => {
                              const hasQualificationIn = (type) => {
                                return qualification.some(
                                  (q) => q.qualificationIn === type
                                );
                              };
                              
                              if (
                                termsAndConditions === true &&
                                card.content === "Home Tutor" &&
                                tutor.length === 0 && hasQualificationIn("HomeTutor")
                              ) {
                                navigation.navigate("HomeTutor");
                              } else {
      
                                if (card.content === "Home Tutor") {
                                  
                                  if (termsAndConditions === true) {
                                  
                                    navigation.navigate(
                                      (hasQualificationIn("HomeTutor"))
      
                                        ? "AllHomeTutor"
                                        : "AddQualification",
      
                                    );
                                  } else {
                                   
                                     if(termsAndConditions === true){
      
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
                                style={{ width: 40, height: 40,resizeMode:'contain' }}
                                source={card.imageSource}
                              />
                              
                          
                            {/* </View> */}
                           
                          </TouchableOpacity>
                          <Text style={styles.cardtext}>{card.content}</Text>
                          </View>
                          
                        ))}
                        
                      </View>
                      </View>
                  {/* <View style={{ marginTop: 15, }}>
                    <ShimmerPlaceholder
                      style={{ borderRadius: 10, height: 130, width: wp(90) }}
                    />
                  </View> */}
                  <View style={{ marginVertical: 10 }}>
                  <ShimmerPlaceholder style={[styles.text,{marginVertical:10}]} />
                  <View style={styles.cardContainer}>
                    <View style={{ flexDirection: "row",  alignItems: "flex-start" }}>
  {/* Image */}
  <ShimmerPlaceholder style={styles.tutorImage}/>

  {/* Text Content */}
  <View style={{ flex: 1, marginLeft: 10 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
     <ShimmerPlaceholder />

     
    </View>

    {/* Second Row: Location */}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
      }}
    >
     <ShimmerPlaceholder/>
    </View>   
                   {/* <View style={{backgroundColor:'white',height: 120, width: 290,marginRight:10 }}>
                    <ShimmerPlaceholder 
                      <ShimmerPlaceholder
                        style={{ borderRadius: 10, }}
                      />
                      </View>
                      <View style={{backgroundColor:'white',height: 120, width: 290, }}>
                      <ShimmerPlaceholder
                        style={{ borderRadius: 10, }}
                      />
                      
                      </View> */}
                    {/* </View> */}
                    </View>
                </View>
                </View>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                  <ShimmerPlaceholder style={[styles.text,{marginVertical:10}]} />
                    <View style={{flexDirection:'row'}}>
                    <View style={styles.cardContainer}>
                    <View style={{ flexDirection: "row",  alignItems: "flex-start" }}>
  {/* Image */}
  <ShimmerPlaceholder style={styles.tutorImage}/>

  {/* Text Content */}
  <View style={{ flex: 1, marginLeft: 10 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
     <ShimmerPlaceholder />

     
    </View>

    {/* Second Row: Location */}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
      }}
    >
     <ShimmerPlaceholder/>
    </View>   
                   {/* <View style={{backgroundColor:'white',height: 120, width: 290,marginRight:10 }}>
                    <ShimmerPlaceholder 
                      <ShimmerPlaceholder
                        style={{ borderRadius: 10, }}
                      />
                      </View>
                      <View style={{backgroundColor:'white',height: 120, width: 290, }}>
                      <ShimmerPlaceholder
                        style={{ borderRadius: 10, }}
                      />
                      
                      </View> */}
                    {/* </View> */}
                    </View>
                </View>
                </View>
                </View>
                </View>
                </View>
               </>
            ) : 
            (
              <>
        <View style={styles.topHeader}>
                  <View style={{  }}>
                  <View style={{flexDirection:'row',justifyContent:'space-between', alignItems: 'center'}}>

             <Text style={[styles.text, { fontSize: RFPercentage(2.5),fontFamily: "Poppins-SemiBold", marginBottom:0}]}  >

                      {user.data && (
                        <Text style={{ fontFamily: "Poppins-SemiBold" }}>
                         Hi,&nbsp;
                         
                          {user.data.name}


                        </Text>
                      )} 
                    
                       &nbsp;!
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{justifyContent:'flex-end'}}>
       <Avatar
    rounded
    source={user?.data && user?.data.profilePic && user?.data?.profilePic.path
      ? { uri: user?.data?.profilePic.path }
     : require("../../../../assets/dAvatar.jpg")}
    containerStyle={{ borderColor: 'white', borderWidth: 2 }}
    size={50}
  />
   </TouchableOpacity>
                    </View>
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#0000ff" />
                      </View>
                    ) : errorMsg ? (
                     
                      <View style={styles.errorContainer}>
                       
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                       {address}
      </Text>
      <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
        <Ionicons name="refresh" size={15} color="black" />
      </TouchableOpacity>
                      </View>

                    ) :  address   ? (
                      <View style={styles.addressContainer}>
                        <Text style={styles.addressText}  numberOfLines={1} ellipsizeMode="tail">
                          {address ? address+ ", " : ""}
                         
                        </Text>
                        <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
        <Ionicons name="refresh" size={15} color="black" />
      </TouchableOpacity>     
                      </View> 
                      
                  ) : null}
            
                  </View>
                </View>
                <View style={{ marginTop: 10}}>
                </View>
                <View style={[styles.subContainer,{marginHorizontal:20}]}>
                <Text style={styles.title}>List yourself as</Text>
                <View style={styles.cardContainers}>
                
                  {cardsData.map((card, index) => (
                    <View key={index}>
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.card,
                        {
                          width: 120,
                          backgroundColor: COLORS.primary,
                          alignItems:'center',
                          padding:10,
                          // justifyContent:'center',
                          marginHorizontal: wp(4),
                        

                        },
                      ]}

                      onPress={() => {
                        const hasQualificationIn = (type) => {
                          return qualification.some(
                            (q) => q.qualificationIn === type
                          );
                        };
                        
                        if (
                          termsAndConditions === true &&
                          card.content === "Home Tutor" &&
                          tutor.length === 0 && hasQualificationIn("HomeTutor")
                        ) {
                          navigation.navigate("HomeTutor");
                        } else {

                          if (card.content === "Home Tutor") {
                            
                            if (termsAndConditions === true) {
                            
                              navigation.navigate(
                                (hasQualificationIn("HomeTutor"))

                                  ? "AllHomeTutor"
                                  : "AddQualification",

                              );
                            } else {
                             
                               if(termsAndConditions === true){

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
                          style={{ width: 40, height: 40,resizeMode:'contain' }}
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
                  
  <View style={{ marginVertical: 10 }}>
    <NotificationCard
      title="Complete your profile!"
      text="Complete your profile today and start enjoying all the benefits of our community!"
      icon={<Ionicons name="information-circle" size={18} color="#6BBBFF" />}
      color1="#E3F1FE"
      color2="#FFFFFF"
      progress={profileComplete}
      isProfileCompletion={true}
      borderColor="#6BBBFF"
      navigateTo={
        
        !bio ? 'EditProfile' :
        
        qualifications.length === 0 ? 'AddQualification' :
        !aadhaarCardVisible ? 'AadharVerification' :
        !bankCardVisible ? 'BankVerification' :
        'EditProfile'
      }
    />
  </View>
)}

    <View>
    {!aadhaarCardVisible  && (
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
       {!bankCardVisible  && (
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
  // marginHorizontal:17,
  borderRadius:10,
  marginTop:10,padding:10,
  borderColor: "#f7f2f2",
  borderWidth: 1,
  shadowColor:'#000',
  shadowOffset:2
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title :{
  fontFamily:'Poppins-Medium',
  fontSize:16,
  // marginBottom:5,
  textAlign:'left'
  },
  text: {
    fontFamily: "Poppins",
  },
  cardContainers: {
    // justifyContent: 'left', 
    marginTop:10,
    alignItems:'flex-start',
    marginHorizontal: 10,
    flexDirection:'row',
    justifyContent:'space-between'
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
    // flex: 1,
    marginRight: 10,
    color: 'black',
  },
  tutorImage: {
    width: 100,
    height: 100,
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
    justifyContent: 'space-between',
    width: '80%',
    marginTop:-10
  },
  errorText: {
    color: "#f00",
  },
  retryText: {
    color: "#00f",
    textDecorationLine: "underline",
  },
  addressContainer: {
    alignItems: "center",
    flexDirection:'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop:-10
  },
  shimmerButton: {
    width: wp(12),
    height: hp(6),
    borderRadius: 50,
    borderColor:'white',
    borderWidth:1
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
   
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, 
    padding: 10,
    width: wp('90%'), 
    marginHorizontal: 0,
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
    fontFamily: 'Poppins-Medium',
    backgroundColor: COLORS.light_orange,
    color: COLORS.timeslottext,
    fontSize: 10,
   padding:7,
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




 
