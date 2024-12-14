import React, { useEffect,useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  BackHandler,ToastAndroid,Share,Linking,Modal
} from "react-native";
import { Avatar } from "react-native-elements";
import Toast from "react-native-toast-message";
import Header from "../../../../components/header/Header";
import { useDispatch,useSelector } from "react-redux";
import Border from "../border/BorderRadius";
import { COLORS,icons } from "../../../../components/constants";
import { FONTS } from "../../../../components/constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import { getInstructor, getUser } from "../../../../redux/actions/auth/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { color } from "react-native-elements/dist/helpers";
import { heightPercentageToDP } from "react-native-responsive-screen";

const MainProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // State to manage the loading state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const confirmLogout = () => {
    setIsModalVisible(false);
    handleLogout();
  };

  const dispatch=useDispatch();
  const user =useSelector((state)=>state.auth.user);
  console.log("user.isInstructor :" + user.isInstructor)
  // const role = (user.data.isInstructor === true ? "Instructor" : "User");
  const fetchData = async () => {
    try {
    const res=  await dispatch(getUser());
    console.log(res);
    setLoading(false); // Set loading to false once data is fetched

    } catch (error) {
      console.error("Error fetching data:", error);
      const msg=error.response?.data.message
      ToastAndroid.show( msg || "An error occurred. Please try again." ,ToastAndroid.SHORT)
    }
  };
  useEffect(() => {

    fetchData();
  }, [dispatch]);
  
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
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


  // const imageUrl = .instructor.imagePath
  // ? { uri: user.instructor.imagePath user}
  // : 
  // const imageUrl = require("../../../../assets/dAvatar.jpg");

  const imageUrl = user && user.profilePic && user.profilePic.path
  ? { uri: user.profilePic.path }
  : require("../../../../assets/dAvatar.jpg");

console.log(user?.profilePic?.path);


const handleLogout = async () => {
  try {
    console.log('Logout initiated');

    // Clear authentication token and set login status to false
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.setItem('isLoggedIn', 'false');

    ToastAndroid.show('Logout Successful', ToastAndroid.SHORT);

    // Debugging: Log the current navigation state
    console.log('Current Navigation State:', navigation.getState());

    console.log('Navigating to Login screen');

    navigation.reset({
      index: 0,
      routes: [{ name: 'authStack', params: { screen: 'Login' } }],
    });

    console.log('Reset navigation executed');
  } catch (error) {
    console.error('Error occurred while logging out:', error);
    ToastAndroid.show('Error Logging Out', ToastAndroid.SHORT);
  }
};


  return (
    <View style={styles.container}>
     <StatusBar backgroundColor={COLORS.user_front_theme_color} style="light" />
        <View style={{paddingTop:20}}>
        <Header title="Profile" icon={icons.back} />
        </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 ,marginVetical:20}}>
        <View style={{ flex: 1 }}>
        <View style={{}}>
        <View style={styles.profileContainer}>
            {/* Shimmer Placeholder for Image */}
            <ShimmerPlaceHolder
              autoRun={true}
              visible={!loading}
              style={[styles.avatar]}
            >
              <Avatar rounded source={imageUrl} size={60} />
            </ShimmerPlaceHolder>
            
            <View style={styles.profileTextContainer}>
              {/* Shimmer Placeholder for Name */}
              <ShimmerPlaceHolder
                autoRun={true}
                visible={!loading}
                style={[styles.profileName,{paddingVertical:3}]}
              >
                <Text style={styles.profileName}>
                  {user && <>{user?.name}</>}
                </Text>
              </ShimmerPlaceHolder>
              
              {/* Shimmer Placeholder for Email */}
              <ShimmerPlaceHolder
                autoRun={true}
                visible={!loading}
                style={[styles.profileEmail,{marginTop:0,paddingVertical:3}]}
              >
                <Text style={styles.profileEmail}>
                  {user && <>{user?.email}</>}
                </Text>
              </ShimmerPlaceHolder>
            </View>
            </View>      
            <Border color={COLORS.primary} />
            </View>
            <View style={styles.contentcontainer}>

          <TouchableOpacity
            onPress={() => navigation.navigate("UserProfileOverview")}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Profile</Text>
                <Text style={styles.subtext}>In few clicks, Update your Details</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>

          <View style={styles.hr} />
          <TouchableOpacity
          onPress={() => navigation.navigate("AddressBook")}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Address Book</Text>
                <Text style={styles.subtext}>Add or Update your Address Details</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity onPress={() => navigation.navigate("UserShare")}>
            <View style={styles.viewContainer}>
              <View>
              <Text style={styles.textContainer}>Share the App</Text>
              <Text style={styles.subtext}>Invite your friends & family to use the app!</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity onPress={() => Linking.openURL('market://details?id=com.bharatswasti')}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Review</Text>
                <Text style={styles.subtext}>Give feedback to help us improve</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")} >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Policy</Text>
                <Text style={styles.subtext}>Read our privacy and security policies</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity  onPress={() => navigation.navigate("TermConditions")} >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Terms & Conditions</Text>
                <Text style={styles.subtext}>Ensure compliance with our policies</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Logout</Text>
                <Text style={styles.subtext}>Log out of your account safely</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.hr} />
        </View>
        </View>
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
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
    padding: 15,
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
    // marginTop:12
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
    marginTop: 8,
     marginHorizontal: 25,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    paddingHorizontal: 0,
    paddingVertical: 15,
  
    marginHorizontal: 20,
  },
  textContainer: {
    marginTop: 3,
    fontFamily: "Poppins-Medium",
    color: "black",
    fontSize:15
  },
  image: {
    width: 20,
    height: 20,
    marginTop:10
  },

 
});

export default MainProfile;



// async () => {
//   try {
//     const result = await Share.share({
//       message: 'Check out this awesome app! Download it from [App Store/Play Store URL]',
//       url: 'https://play.google.com/store/apps/details?id=com.bharatswasti&hl=en', // If you have an app link
//     });

//     if (result.action === Share.sharedAction) {
//       console.log('Shared successfully');
//     } else if (result.action === Share.dismissedAction) {
//       console.log('Share dismissed');
//     }
//   } catch (error) {
//     console.error('Error while sharing: ', error.message);
//   }
// }}