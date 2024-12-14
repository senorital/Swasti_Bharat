import React, { useEffect,useState} from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  BackHandler,Modal,
  ToastAndroid,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Avatar } from "react-native-elements";
import Header from "../../../../components/header/Header";
import { getBankDetails, getInstructor, getKYC } from "../../../../redux/actions/auth/auth";
import Border from "../../../../components/border/BorderRadius";
import { COLORS, icons } from "../../../../components/constants";
import { FONTS } from "../../../../components/constants/theme";
import {version} from "../../../../package.json";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
// import { CommonActions } from '@react-navigation/native';
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo'; // For network status

const Profile = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [user, setUser] = useState([]);
  const [kyc, setKYC] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [isMounted, setIsMounted] = useState(true); // To avoid setting state after unmount

  const [versionName, setVersionName] = useState('');
  const [versionCode, setVersionCode] = useState('');
  // const user = useSelector((state) => state.auth.user);
  // const kycData = useSelector((state) => state.auth.aadharVerification); // Ensure correct data path
  // const bankData = useSelector((state) => state.auth.bankVerification); // Ensure correct data path
  const navigation = useNavigation(); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const confirmLogout = () => {
    setIsModalVisible(false);
    handleLogout();
  };

  const handleLogout = async () => {
    try {
      // Clear authentication token and set login status to false
      // await AsyncStorage.removeItem('authToken');
      await AsyncStorage.setItem('authToken', '');
      await AsyncStorage.setItem('isLoggedIn', 'false');
      // await AsyncStorage.removeItem('userRole');
      ToastAndroid.show('Logout Successful',ToastAndroid.SHORT)

      // Reset the navigation state and navigate to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
      });
    } catch (error) {
      console.error('Error occurred while logging out:', error);
     
      ToastAndroid.show('Error Logging Out',ToastAndroid.SHORT)

    }
  };

  // Function to check profile completion
  const isProfileIncomplete = () => {
    const requiredFields = ["bio", "dateOfBirth"];
    return requiredFields.some((field) => !user?.data?.[field]);
  };

  // Fetch version info
  const fetchVersion = async () => {
    const fetchedVersionName = await DeviceInfo.getVersion();
    const fetchedVersionCode = await DeviceInfo.getBuildNumber();
    setVersionName(fetchedVersionName);
    setVersionCode(fetchedVersionCode);
  };

  // Fetch data from API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const instructorResponse = await dispatch(getInstructor());
      const kycResponse = await dispatch(getKYC());
      const bankResponse = await dispatch(getBankDetails());
      setUser(instructorResponse?.data);
      setKYC(kycResponse);
      setBankDetails(bankResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
      const msg = error.response?.data?.message || 'An error occurred. Please try again.';
      if (error.response?.status === 401) {
        ToastAndroid.show('Session expired. Logging out...', ToastAndroid.SHORT);
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useFocusEffect hook to reload data when the screen is focused and check network status
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        // Check network connectivity
        const netInfo = await NetInfo.fetch();
        
        if (netInfo.isConnected) {
          // Only fetch data if online
          fetchData();
        } else {
          // Handle offline case
          ToastAndroid.show('You are offline', ToastAndroid.SHORT);
        }
      };

      loadData(); // Fetch data when screen is focused

      // Fetch version info once on component mount
      fetchVersion();

    }, [dispatch])
  );

  useEffect(() => {
    // Cleanup to prevent memory leaks
    return () => {
      setIsMounted(false);
    };
  }, []);
  

  // const isProfileIncomplete = () => {
  //   const requiredFields = ["bio", "dateOfBirth"];
  //   return requiredFields.some((field) => !user?.data?.[field]);
  // };

  useEffect(() => {
    const fetchVersion = async () => {
      const fetchedVersionName = await DeviceInfo.getVersion(); // Get the version name
      const fetchedVersionCode = await DeviceInfo.getBuildNumber(); // Get the version code
      
      setVersionName(fetchedVersionName);
      setVersionCode(fetchedVersionCode);
    };

    fetchVersion(); // Call the function to fetch version info
  }, []); // Empty dependency array to run once when the component mounts
  

  const isKYCIncomplete = () => {
    const requiredFields = ["aadharNumber", "address"];
    return requiredFields.some((field) => !kyc?.data?.[field]);
  };

  const isBankDetailsIncomplete = () => {
    const requiredFields = ["bankName", "IFSCCode","accountNumber"];
    return requiredFields.some((field) => !bankDetails?.data[0]?.[field]);
  };

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



  let isLoggingOut = false; // Flag to prevent multiple logout attempts

  // const handleLogout = async () => {
  //   try {
  
  //     await Promise.all([
  //       AsyncStorage.removeItem('authToken'),
  //       AsyncStorage.setItem('isLoggedIn', 'false'),
  //     ]);
  
  //     ToastAndroid.show('Logout Successful', ToastAndroid.SHORT);
  
    
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'authStack', params: { screen: 'Login' } }],
  //     });
  
  //   } catch (error) {
  //     console.error('Error occurred while logging out:', error);
  //     ToastAndroid.show('Error Logging Out', ToastAndroid.SHORT);
  //   }
  // };
  
  
  const IncompleteInfoTag = ({ isIncomplete, message, color ,textColor}) => {
    if (!isIncomplete) return null;
  
    return (
      <View style={[styles.missingInfoTag, { backgroundColor: color }]}>
        <Ionicons
          name="information-circle-outline"
          style={[styles.missingInfoIcon, { color :textColor }]}
        />
        <Text style={[styles.missingInfoText, { color :textColor }]}>{message}</Text>
      </View>
    );
  };

  const imageUrl = user && user?.data?.profilePic && user?.data?.profilePic.path
  ? { uri: user.data.profilePic.path }
  : require("../../../../assets/dAvatar.jpg");



  return (
    
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />

      <View style={{ paddingTop: 20 }}>
        <Header title={"Profile"} icon={icons.back} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
        {isLoading ? (
            // Shimmer loader for profile image and details
            <View style={styles.profileContainer}>
              <ShimmerPlaceholder style={styles.shimmerAvatar} />
              <View style={styles.profileTextContainer}>
                <ShimmerPlaceholder style={styles.shimmerText} />
                <ShimmerPlaceholder style={styles.shimmerTextSmall} />
              </View>
            </View>
          ) : (
       
          <View style={styles.profileContainer}>
            <Avatar rounded source={imageUrl} size={75} />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>
                {user && <>{user?.data?.name}</>}
              </Text>
              <Text style={styles.profileEmail}>
                {user && <>{user?.data?.email}</>}
              </Text>
            </View>
          </View>     
            )} 
          <Border color={COLORS.primary}  />
          </View>


          <View style={[styles.contentcontainer,{backgroundColor:COLORS.white}]}>
          <TouchableOpacity onPress={() => navigation.navigate("MainProfile")}>
  <View style={styles.viewContainer}>
    <View style={{ flex: 1 }}>
      <Text style={styles.textContainer}>My Profile</Text>
      <Text style={styles.subtext}>In few clicks, Update your profile</Text>
    </View>
    
    <IncompleteInfoTag
     isIncomplete={isProfileIncomplete()}
     message="Incomplete Info"
    color={COLORS.missingIcon} // Set the desired color
    textColor= {COLORS.alertText}
                />
      <Image style={styles.image} source={icons.arrow_right} />
  </View>
</TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity onPress={() => navigation.navigate("Share")}>
            <View style={styles.viewContainer}>
              <View  >
            
                <Text style={styles.textContainer}>Share and Rewards</Text>
                <Text style={styles.subtext}>Earn by sharing with your network</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />

            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity onPress={() => navigation.navigate("Help")}>
            <View style={styles.viewContainer}>
              <View  >
                <Text style={styles.textContainer}>Help & Support</Text>
                <Text style={styles.subtext}>Stuck in something, Solve it out</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />

            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Privacy Policy</Text>
                <Text style={styles.subtext}>Be aware from everything</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity
            onPress={() => navigation.navigate("TermConditions")}
          >
            <View style={styles.viewContainer}>
              <View >
              
                <Text style={styles.textContainer}>Terms & Conditions</Text>
                <Text style={styles.subtext}>Check out our terms & conditions for details</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />

            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateAadharVerification")}
          >
            <View style={styles.viewContainer}>
              <View>
              
                <Text style={styles.textContainer}>KYC Details</Text>
                <Text style={styles.subtext}>Update your KYC Details</Text>

              </View>
              <IncompleteInfoTag
                  isIncomplete={isKYCIncomplete()}
                  message="Attention"
                  color={COLORS.attention} 
                  textColor={COLORS.attention_text}
                />
              <Image style={styles.image} source={icons.arrow_right} />

            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateBankVerification")}
          >
            <View style={styles.viewContainer}>
              <View >
              
                <Text style={styles.textContainer}>Bank Details</Text>
                <Text style={styles.subtext}>Update your Bank details</Text>

              </View>
              <IncompleteInfoTag
                  isIncomplete={isBankDetailsIncomplete()}
                  message="Attention"
                  color={COLORS.attention} 
                  textColor={COLORS.attention_text}
                />
              <Image style={styles.image} source={icons.arrow_right} />

            </View>
          </TouchableOpacity>
        
          <View style={styles.hr} />
          <TouchableOpacity
           onPress={() => setIsModalVisible(true)}          >
            <View style={styles.viewContainer}>
              <View >
                <Text style={styles.textContainer}>Logout</Text>
                <Text style={styles.subtext}>App Version : {versionName} </Text> 

              </View>
              <Image style={styles.image} source={icons.arrow_right} />

            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={styles.logoutContainer}
            onPress={logoutAndNavigate}
          >
            <Image
              style={styles.image}
              source={require("../../assets/profile-icon/logout.png")}
            />
            <Text
              style={styles.logoutText}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View> */}
        
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily:'Poppins-Medium',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily:'Poppins'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

  },
  button: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    borderRadius: 5,
    fontFamily:'Poppins',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.grey,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily:'Poppins'
  },
  contentcontainer : {
    justifyContent:'center',
    marginTop:40,
    // backgroundColor:COLORS.white,
    marginHorizontal:20,
    borderRadius:12
  },
  container: {
    flex: 1,
    backgroundColor:COLORS.background
    },
    shimmerAvatar: {
      width: 75,
      height: 75,
      borderRadius: 37.5,
    },
    shimmerText: {
      width: 120,
      height: 20,
      marginTop: 8,
    },
    shimmerTextSmall: {
      width: 80,
      height: 15,
      marginTop: 4,
    },
  profileContainer: {
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center', // Ensure the items are centered vertically
    position: 'relative', // Add position relative
  },
  profileTextContainer: {
    marginLeft: 20,
  },
  profileName: {
   ...FONTS.h3,
    color: '#fff',
  },
  profileEmail: {
   ...FONTS.h5,
    color: COLORS.white,
  },
  subtext :{
  ...FONTS.h5 
 
  },
  hr: {
    position: "relative",
    width: "86%",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    opacity: 0.1,
    marginTop: 10,
    marginHorizontal: 25,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 0,
    paddingVertical: 15,
  
    marginHorizontal: 20,
  },
  textContainer: {
   ...FONTS.h4
  },
  missingInfoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.missingIcon, // Use the color you want for the tag
    borderRadius: 5,
    marginTop:8,
    marginLeft:30,
    paddingHorizontal: 5,
    marginBottom: 20, // Adjust the vertical alignment as needed
  },
  missingInfoIcon: {
    fontSize: 14, // Size of the warning icon
    marginRight: 5,
  },
  missingInfoText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  image: {
    width: 18,
    height: 18,
    marginTop:10
  },
  // logoutContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#F5F5F5",
  //   width: "80%",
  //   paddingVertical: 15,
  //   borderRadius: 10,
  //   marginTop: 20,
  //   marginBottom: 30,
  // },
  // logoutText: {
  //   marginLeft: 10,
  //   fontFamily: "Poppins",
  //   color: "black",
  // },
});

export default Profile;
