  import React, { useEffect, useState } from "react";
  import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Linking,
    BackHandler,
    ActivityIndicator,
    ToastAndroid
  } from "react-native";
  import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
  import LinearGradient from "expo-linear-gradient";
  import { useDispatch } from "react-redux";
  import Toast from "react-native-toast-message";
  import { Avatar } from "react-native-elements";
  import { Ionicons } from "@expo/vector-icons";
  import Header from "../../components/header/Header";
  import { getInstructor } from "../../redux/actions/auth/auth";
  import Border from "../../components/border/BorderRadius";
  import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, icons } from "../../components/constants";
import { FONTS } from "../../components/constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const ProfileOverview = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [dob, setDob]  = useState(null);
    const [totalExperienceInYears, settotalExperienceInYears]  = useState(null);
  const [isConnected, setIsConnected] = useState(true); // Track network connectivity


  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check the network connection before fetching
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected); // Set network connection status

      // If connected, proceed with API call
      if (state.isConnected) {
        const res = await dispatch(getInstructor());
        setDob(res.data.data.dateOfBirth);
        settotalExperienceInYears(res?.data?.data.totalExperienceInYears);
        setUser(res?.data);
      } else {
        ToastAndroid.show("No internet connection", ToastAndroid.SHORT);
      }
    } catch (error) {
      const msg = error.response?.data?.message;
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // Using useFocusEffect for fetching data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
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

    const handlePress = (url) => {
      Linking.openURL(url);
    };

    const imageUrl = user && user?.data?.profilePic && user?.data?.profilePic.path
    ? { uri: user?.data?.profilePic.path }
    : require("../../assets/dAvatar.jpg");



    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} style="light" />
        <View style={{ paddingTop: 20 }}>
          <Header title={"My Profile"} icon={icons.back} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
          <View style={{}}>
            <View style={styles.profileContainer}>
              <Avatar rounded source={imageUrl} size={75} />
              <View style={styles.profileTextContainer}>
              <View style={styles.row}>

                <Text style={styles.profileName}>
                  {user && <>{user?.data?.name}</>}
                </Text>
                <MaterialIcons name="edit" size={20} color="#fff" style={styles.iconRight} onPress={() => navigation.navigate("EditProfile")} />

                </View>
                <Text style={styles.profileEmail}>
                  {user && <>{user?.data?.email}</>}
                </Text>
              </View>
            </View>      
            <Border color={COLORS.primary}  />
            </View>
            <View style={{ paddingHorizontal: 20,marginVertical:20,marginTop:40 }}>

            {!loading ?  
              <View style={styles.textcontainer}>
                {user?.data.email && (
                  <View>
                   <View style={styles.row}>
                   <Text style={styles.headingText}>Email Address</Text>
                   </View>
                    <Text style={styles.text}>{user.data.email}</Text>
                  </View>
                )}
                {user?.data.phoneNumber && (
                  <View style={{ marginTop: 5 }}>
                    <View style={styles.row}>
                      <Text style={styles.headingText}>Mobile Number</Text>
   
                    </View>
                    <Text style={styles.text}>+91 {user.data.phoneNumber}</Text>
                  </View>
                )}
         {user?.data.location && user.data.location.trim() !== '' && user.data.location !== 'undefined' && user.data.location !== 'null' && (
  <View style={{ marginTop: 5 }}>
    <View style={styles.row}>
      <Text style={styles.headingText}>Location</Text>
    </View>
    <Text style={styles.text}>{user.data.location}</Text>
  </View>
)}
                {user?.data.dateOfBirth && (
                  <View style={{ marginTop: 5 }}>
                    <View style={styles.row}>
                      <Text style={styles.headingText}>Date Of Birth</Text>
                    </View>
                    <Text style={styles.text}>{dob}</Text>
                  </View>
                )}

           {user?.data.totalExperienceInYears && (
                  <View style={{ marginTop: 5 }}>
                    <View style={styles.row}>
                      <Text style={styles.headingText}>Total Years of Experience</Text>
                    </View>
                    <Text style={styles.text}>{totalExperienceInYears} Year</Text>
                  </View>
                )}

                {(user?.data.linkedIn ||
                  user?.data.instagram ||
                  user?.data.twitter_x ||
                  user?.data.facebook) && (
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.headingText}>Social Media</Text>
                    <View style={styles.iconContainer}>
                      {user?.data.linkedIn && (
                        <TouchableOpacity onPress={() => handlePress(user.data.linkedIn)}>
                          <Ionicons
                            name="logo-linkedin"
                            size={24}
                            color="#0e76a8"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      )}
                      {user?.data.instagram && (
                        <TouchableOpacity onPress={() => handlePress(user.data.instagram)}>
                          <Ionicons
                            name="logo-instagram"
                            size={24}
                            color="#bc2a8d"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      )}
                      {user?.data.twitter_x && (
                        <TouchableOpacity onPress={() => handlePress(user.data.twitter_x)}>
                          <Ionicons
                            name="logo-twitter"
                            size={24}
                            color="#1da1f2"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      )}
                      {user?.data.facebook && (
                        <TouchableOpacity onPress={() => handlePress(user.data.facebook)}>
                          <Ionicons
                            name="logo-facebook"
                            size={24}
                            color="#3b5998"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}

               
                {user?.data.bio && (
                  <View style={[styles.textcontainer,{marginTop:15}]}>
                  <View style={styles.row}>
                    <Text style={styles.headingText}>About me</Text>
                    </View>    
                    <Text style={[styles.text, { textAlign: "justify" }]}>
                      {user.data.bio}
                    </Text>
                  </View>
                )}
                {Array.isArray(user?.data.languages) && user?.data.languages?.length > 0 && (
                <View style={[styles.textcontainer,{marginTop:15}]}>
                    <Text style={styles.headingText}>Languages</Text>
                    <Text style={styles.text}>
                      {user.data.languages.join(", ")}
                    </Text>
                  </View>
                )}
                
              </View> :  
              <View style={[styles.textcontainer]}>
          
        
       
      
         <View style={{ marginTop: 5 }}>
          
           <ShimmerPlaceholder />
           
      
<View style={{ marginTop: 5 }}>

<ShimmerPlaceholder />
</View>

      
        
       

       </View>
      
      </View>
       }
          </View>
            </View>
        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    textcontainer:{
      padding: 12,
      backgroundColor:'#FFF',
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
    },
    profileTextContainer: {
      flex: 1, // Ensure the container takes up available space
       marginLeft: 20, 
      marginTop:10
       },
    profileName: {
     ...FONTS.h3,
      color: '#fff',
    },
    profileEmail: {
     ...FONTS.h5,
     flex:1,
     marginTop:-10,
      color: COLORS.white,
    },
    headingText: {
      fontFamily: "Poppins-Medium",
      fontSize: 14,
      marginTop:5,
      justifyContent:'center'
    },
    text: {
      fontFamily: "Poppins",
      fontSize: 12,
      marginVertical:10
    },
    iconContainer: {
      marginTop: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 30,
    },
    iconRight: {
      marginRight: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      justifyContent: "space-between",
      flexDirection: "row",
      flex: 1, // Ensure text takes available space pushing the icon
    },

    // profileTextContainer: {
    //   marginLeft: 20,
    // },
    // iconLeft: {
    //   marginRight: 10,
    // },
  });
  

  export default ProfileOverview;
