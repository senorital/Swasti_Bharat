import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  BackHandler,
  ToastAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
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
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const kycData = useSelector((state) => state.auth.aadharVerification); // Ensure correct data path
  const bankData = useSelector((state) => state.auth.bankVerification); // Ensure correct data path
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getInstructor()),
        await dispatch(getKYC()),
        await dispatch(getBankDetails())

      } catch (error) {
        console.error("Error fetching data:", error);
        const msg = error.res?.data?.message || "An error occurred. Please try again.";
        Toast.show({
          type: "error",
          text1: msg,
          visibilityTime: 2000,
          autoHide: true,
        });

        if (error.response?.status === 401) {
          // Token is expired, log out the user
          handleLogout();
        }
      }
    };

    fetchData();
  }, [dispatch]);

  const isProfileIncomplete = () => {
    const requiredFields = ["bio", "dateOfBirth"];
    return requiredFields.some((field) => !user?.data?.[field]);
  };

  const isKYCIncomplete = () => {
    const requiredFields = ["aadharNumber", "address"];
    return requiredFields.some((field) => !kycData.data?.[field]);
  };

  const isBankDetailsIncomplete = () => {
    const requiredFields = ["bankName", "IFSCCode","accountNumber"];
    return requiredFields.some((field) => !bankData.data[0]?.[field]);
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


  const handleLogout = async (navigation) => {
    try {
      // Clear authentication token and set login status to false
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.setItem('isLoggedIn', 'false');
      await AsyncStorage.setItem('role','null');

      // Show success toast
      // Toast.show({
      //   type: 'success',
      //   text1: 'Logout Successful',
      //   visibilityTime: 3000,
      // });
      ToastAndroid.show('Logout Successful',ToastAndroid.SHORT)
     navigation.navigate("Login")
   
    } catch (error) {
      console.error('Error occurred while logging out:', error);
      // Show error toast
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error Logging Out',
      //   visibilityTime: 3000,
      // });
      ToastAndroid.show('Error Logging Out',ToastAndroid.SHORT)

    }
  };
  
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

  const imageUrl = user && user.data.profilePic && user.data.profilePic.path
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
          <View style={{}}>
          <View style={styles.profileContainer}>
            <Avatar rounded source={imageUrl} size={75} />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>
                {user && <>{user.data?.name}</>}
              </Text>
              <Text style={styles.profileEmail}>
                {user && <>{user.data?.email}</>}
              </Text>
            </View>
          </View>      
          <Border color={COLORS.primary}  />
          </View>


          <View style={styles.contentcontainer}>
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
            onPress={() => handleLogout(navigation)}
          >
            <View style={styles.viewContainer}>
              <View >
                <Text style={styles.textContainer}>Logout</Text>
                <Text style={styles.subtext}>App Version : {version} </Text> 

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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

  contentcontainer : {
    justifyContent:'center',
    marginTop:40,
    backgroundColor:COLORS.white,
    marginHorizontal:20,
    borderRadius:12
  },
  container: {
    flex: 1,
    backgroundColor:COLORS.background
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
