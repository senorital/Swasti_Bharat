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
  ActivityIndicator
} from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../../components/header/Header";
import Border from "../../components/border/BorderRadius";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, icons } from "../../../../components/constants";
import { FONTS } from "../../../../components/constants/theme";
import {
widthPercentageToDP as wp,
heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect } from '@react-navigation/native';
import { getUser } from "../../../../redux/actions/auth/auth";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const UserProfileOverview = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getUser());
      setUser(res?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      const msg = error.response?.data?.message;
      Toast.show({
        type: "error",
        text1: msg || "An error occurred. Please try again.",
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
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

  const imageUrl = user && user.profilePic && user.profilePic.path
  ? { uri: user.profilePic.path }
  : require("../../../../assets/dAvatar.jpg");

  if (loading) {
    return (
      <View style={{ marginTop: 100, paddingHorizontal: 20 }}>       
      <View style={{ alignItems:'center'}}>
        <ShimmerPlaceholder
          style={{ borderRadius: 10, height: 95, width: wp(83) }}
        />
      </View>
      <View style={{ marginVertical: 20 }}>
        <View
          style={{justifyContent:'center',alignItems:'center' }}
        >
          <ShimmerPlaceholder
            style={{ borderRadius: 10, height: 350, width: wp(83) }}
          />
          <ShimmerPlaceholder
            style={{
              marginVertical:30,
              borderRadius: 10,
              height: 150,
              width: wp(83),
              marginLeft: 10,
            }}
          />
        </View>
       
      </View>
    </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.user_front_theme_color} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"My Profile"} icon={icons.back} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
        <View style={{}}>
          <View style={styles.profileContainer}>
            <Avatar rounded source={imageUrl} size={60} />
            <View style={styles.profileTextContainer}>
            <View style={styles.row}>

              <Text style={styles.profileName}>
                {user && <>{user?.name}</>}
              </Text>
              <MaterialIcons name="edit" size={20} color="#fff" style={styles.iconRight} onPress={() => navigation.navigate("EditUserProfile")} />

              </View>
              <Text style={styles.profileEmail}>
                {user && <>{user?.email}</>}
              </Text>
            </View>
          </View>      
          <Border color={COLORS.primary}  />
          </View>
          <View style={{ paddingHorizontal: 20,marginVertical:20,marginTop:40 }}>
            <View style={styles.textcontainer}>
              {user?.email && (
                <View>
                 <View style={styles.row}>
                 <Text style={styles.headingText}>Email Address</Text>
                 </View>
                  <Text style={styles.text}>{user.email}</Text>
                </View>
              )}
              {user?.phoneNumber && (
                <View style={{ marginTop: 5 }}>
                  <View style={styles.row}>
                    <Text style={styles.headingText}>Mobile Number</Text>
 
                  </View>
                  <Text style={styles.text}>+91 {user.phoneNumber}</Text>
                </View>
              )}
       {user?.location && user.location.trim() !== '' && user.data.location !== 'undefined' && user.location !== 'null' && (
<View style={{ marginTop: 5 }}>
  <View style={styles.row}>
    <Text style={styles.headingText}>Location</Text>
  </View>
  <Text style={styles.text}>{user.data.location}</Text>
</View>
)}
             
             

              </View>
            
             
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


export default UserProfileOverview;
