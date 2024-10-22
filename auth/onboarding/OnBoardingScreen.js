
import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Onboarding from "react-native-onboarding-swiper";
import { icons } from "../../components/constants";



export default function OnBoardingScreen({ navigation }) {
  const renderImage = (source) => (
    <View style={{ width: wp(100), height: hp(40) }}>
      <Image source={source} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
    </View>
  );

  const handleDone = async () => {
    navigation.navigate("authStack");
  }

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.nextButton} {...props}>
        <Image
          source={icons.arrow_right}
          style={{ height: 20, width: 20 }}
        />
      </TouchableOpacity>
    );
  };

  const skipButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.skipButton} {...props}>
        <Text style={{ color: "#000", fontFamily: "Poppins" }}>Skip</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
     
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
     
      <Onboarding
        onSkip={handleDone}
        onDone={handleDone}
        bottomBarHighlight={false}
        DoneButtonComponent={doneButton}
        NextButtonComponent={doneButton}
        SkipButtonComponent={skipButton}
        bottomBarContainerStyle={{ marginBottom: 30 }}
        containerStyles={{ paddingHorizontal: 20 }}
        titleStyles={styles.textHeading}
        subTitleStyles={styles.textP}
        pages={[
          {
            backgroundColor: "#fff2cd",
            image: renderImage(require("../../assets/bording/onboarding2.png")),
            title: "Welcome to Swasti Bharat!",
            subtitle:
              "Join our yoga community. List your services, connect with clients, and grow your practice.",
          },
          {
            backgroundColor: "#f2f9ca",
            image: renderImage(require("../../assets/bording/onboarding1.png")),
            title: "Set Up Your Profile",
            subtitle:
              "Add your details, set availability, and list services. Stand out with clear, quality images.",
          },
          {
            backgroundColor: "#fce1cf",
            image: 
              renderImage(require("../../assets/bording/onboarding3.png")),
            
            title: "Manage Bookings Easily",
            subtitle:
              "Receive and manage bookings through the app. Secure payments and easy communication await.",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textHeading: {
    fontSize: hp(3),
    lineHeight: 28,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Poppins",
    color:'green'
  },
  textP: {
    // marginVertical: 3,
    fontSize: hp(2),
    // lineHeight: 20,
    textAlign: "center",
    color: "green",
    fontFamily: "Poppins",
  },
  nextButton: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 50,
    marginRight: 15,
    marginBottom: 10,
  },
  skipButton: {
    // marginBottom: 10,
    marginLeft: 15,
  },
});
