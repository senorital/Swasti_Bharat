import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  BackHandler,ToastAndroid,Share,Linking
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

const MainProfile = () => {
  const navigation = useNavigation();

  const dispatch=useDispatch();
  const user =useSelector((state)=>state.auth.user);
  // console.log(user.name)
  // const role = (user.data.isInstructor === true ? "Instructor" : "User");
  const fetchData = async () => {
    try {
    const res=  await dispatch(getUser());
    console.log(res);
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
     <StatusBar backgroundColor={COLORS.primary} style="light" />
        <View style={{paddingTop:20}}>
        <Header title="Profile" icon={icons.back} />
        </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 ,marginVetical:20}}>
        <View style={{ flex: 1 }}>
        <View style={{}}>
            <View style={styles.profileContainer}>
              <Avatar rounded source={imageUrl} size={60} />
              <View style={styles.profileTextContainer}>

                <Text style={styles.profileName}>
                  {user && <>{user?.name}</>}
                  {/* Pallavi */}
                </Text>
                <Text style={styles.profileEmail}>
                  {user && <>{user?.email}</>}
                  {/* pallavi@gmail.com */}
                </Text>
              </View>
            </View>      
            <Border color={COLORS.primary} />
            </View>
            <View style={styles.contentcontainer}>

          <TouchableOpacity
            onPress={() => navigation.navigate("EditUserProfile")}
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
          <TouchableOpacity  onPress={async () => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome app! Download it from [App Store/Play Store URL]',
        url: 'https://play.google.com/store/apps/details?id=com.bharatswasti&hl=en', // If you have an app link
      });

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error while sharing: ', error.message);
    }
  }}>
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
          onPress={handleLogout}
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
