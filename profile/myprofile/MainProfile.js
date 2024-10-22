import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  BackHandler
} from "react-native";
import { Avatar } from "react-native-elements";
import Toast from "react-native-toast-message";
import Header from "../../components/header/Header";
import { getInstructor } from "../../redux/actions/auth/auth";
import { useDispatch,useSelector } from "react-redux";
import Border from "../../components/border/BorderRadius";
import { COLORS, icons } from "../../components/constants";
import { FONTS } from "../../components/constants/theme";
import { useFocusEffect } from '@react-navigation/native';

const MainProfile = ({ navigation }) => {
  const dispatch=useDispatch();
  const user =useSelector((state)=>state.auth.user);
  const fetchData = async () => {
    try {
    const res=  await dispatch(getInstructor());
    console.log(res);
    } catch (error) {
      console.error("Error fetching data:", error);
      const msg=error.response?.data.message
      Toast.show({
        type: "error",
        text1: msg || "An error occurred. Please try again.",
        visibilityTime: 2000,
        autoHide: true,
      });
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


  const imageUrl = user && user.data.profilePic && user.data.profilePic.path
  ? { uri: user.data.profilePic.path }
  : require("../../assets/dAvatar.jpg");


console.log(user?.profilePic?.path);

  return (
    <View style={styles.container}>
     <StatusBar backgroundColor={COLORS.primary} style="light" />
        <View style={{paddingTop:20}}>
      <Header title={"My Profile"} icon={icons.back} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 ,marginVetical:20}}>
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
            <Border color={COLORS.primary} />
            </View>
            <View style={styles.contentcontainer}>

          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileOverview")}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>My Details</Text>
                <Text style={styles.subtext}>In few clicks, Update your Details</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>

          <View style={styles.hr} />
          <TouchableOpacity
          onPress={() => navigation.navigate("Qualification")}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Qualification</Text>
                <Text style={styles.subtext}>Add or Update your qualification</Text>

              </View>
              <Image style={styles.image} source={icons.arrow_right} />
            </View>
          </TouchableOpacity>
          <View style={styles.hr} />
          <TouchableOpacity
          onPress={() => navigation.navigate("Experience")}
          >
            <View style={styles.viewContainer}>
              <View>
                <Text style={styles.textContainer}>Experience</Text>
                <Text style={styles.subtext}>Add or Update your Experience</Text>

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
