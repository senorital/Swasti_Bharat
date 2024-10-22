import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Image,
  BackHandler,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Header from "../../components/header/Header";
// import BookingTab from "./BookingTab";
// import HomeTutorBooking from "./HomeTutorBooking";
// import TherapistBooking from "./TherapistBooking";
import { COLORS, icons } from "../../components/constants";
import Steps from "./steps";
import ShareTab from "./ShareTab";
import Faqs from "./Faqs";
import Referral from "./referral";

const Share = ({ route, navigation }) => {
    const [bookingTab, setBookingTab] = useState(1);
    const onSelectSwitch = (value) => {
      setBookingTab(value);
    };
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Share & Earn"} icon={icons.back} />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1}} >
     
          <View style={{ }}>
       <View style={{}}>
          <ShareTab
            selectionMode={1}
            option1="Invite"
            option2="Referrals"
            option3="FAQ"
            onSelectSwitch={onSelectSwitch}
          />
          </View>
          {bookingTab === 1 && <Steps />  }
          {bookingTab === 2 && <Referral /> }
          {bookingTab === 3 && <Faqs /> }
      
          </View>
       
      </ScrollView>
    </View>
  );
};

export default Share;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

