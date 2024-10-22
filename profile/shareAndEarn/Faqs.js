import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, StatusBar, Image, BackHandler, ActivityIndicator } from "react-native";
import { Avatar } from "react-native-elements";
import Header from "../../components/header/Header";
import { COLORS, icons } from "../../components/constants";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from "@expo/vector-icons";
import Accordion from "../../roles/instructor/components/accordion/Accordion";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const Faqs = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [stepss, setstepss] = useState([]);



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
 
      
        <ScrollView style={{backgroundColor:COLORS.white}}>            
          {/* <Text style={styles.title}>Frequently Asked Questions</Text> */}
         <View style={{marginHorizontal:20,marginVertical:10}}>
         <View style={{}}>  
         <Accordion
          title="Who can register as a subscriber on Swasti Bharat?"
          answer="Swasti Bharat Partners App is a platform where yoga instructors, therapists, and studios can list their services to connect with users seeking yoga-related services like home tutoring, therapy sessions, and studio classes."
        />
        <Accordion
          title="Which all instruments are available on Swasti Bharat?"
          answer="To register, download the Swasti Bharat Partners App, complete the registration form with your personal and professional details, and submit the required documents for verification."
        />
        <Accordion
          title="How does the verification process work?"
          answer="After submitting your registration, our team will review your credentials and documents. Once verified, you will receive a confirmation email, and your profile will be live on the app."
        />
        <Accordion
          title="How can I manage my profile and services?"
          answer="You can manage your profile, update your services, set your availability, and modify your pricing directly through the Swasti Bharat Partners App."
        />
        <Accordion
          title="How do I receive bookings from users?"
          answer="Users will search for services based on their preferences and book directly through the app. You will receive notifications for new bookings, which you can accept or decline."
        />
      </View>
      </View> 
        </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    
  },
  hr: {
    position: "relative",
    width: "100%",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    opacity: 0.1,
    marginTop: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 250,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    marginTop: 5,
    fontFamily: "Poppins",
    fontSize: 18,
    textAlign: "center",
    color: '#5F33E1',
  },
  icon :{
  backgroundColor:COLORS.primary,
  padding:10,
  borderColor:COLORS.primary,
  borderWidth:1,
  borderRadius:12,
  justifyContent:'center',
  alignItems:'center'  
  },
  title :{
  fontFamily:'PoppinsSemiBold',
  fontSize:18,
  marginHorizontal:20 ,
  marginVertical:15 
  }
});

export default Faqs;
