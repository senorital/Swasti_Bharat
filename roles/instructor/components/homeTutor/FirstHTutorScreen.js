import React, { useEffect, useState,useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  BackHandler,
  ActivityIndicator,ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SelectList } from "react-native-dropdown-select-list";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "../../../../components/button/Button";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { updateTutorTerm, getInstructor } from "../../../../redux/actions/auth/auth";
import { COLORS } from "../../../../components/constants";
import CustomAlertModal from "../../../../components/CustomAlert/CustomAlertModal";


const FirstHTutorScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [onAlertOk, setOnAlertOk] = useState(() => {});
  const [boldText, setBoldText] = useState('');


  const data = [
    { key: "1", value: "Yes" },
    { key: "2", value: "No" },
  ];

  const validationSchema = Yup.object().shape({
    selected: Yup.string().required("Selection is required"),
  });

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

  const checkProfileCompletion = useCallback(async () => {
    try {
      // Fetch the instructor profile
      const profileRes = await dispatch(getInstructor());
      const qualifications = profileRes.data.data.qualifications;
      const username = profileRes.data.data.name || "User"; // Assuming username is available in the response
      const bio = profileRes.data.data.bio; // Assuming username is available in the response
      if (!bio) {

        setBoldText(username);
        setAlertMessage(`Please complete your Profile.`);
        setOnAlertOk(() => () => {
          setShowAlert(false);
          navigation.navigate("EditProfile");
        });
        setShowAlert(true);
        return false;
      } else if (!qualifications.some((q) => q.qualificationIn === "HomeTutor")) {

        setBoldText(username);
        setAlertMessage(`Please complete your Qualification.`);
        setOnAlertOk(() => () => {
          setShowAlert(false);
          navigation.navigate("AddQualification");
        });
        setShowAlert(true);
        return false; // Qualification incomplete

      }
      return true; // Profile and qualifications complete

    } catch (error) {
      console.error("Error checking profile completion:", error);
   
      return false; // Error occurred

    }
  }, [dispatch, navigation]);


  const handleSubmit = async (values) => {
    try {
      // Check if the user selects "Yes" for home tutor terms
      const isHome = values.selected === "Yes";
  
      if (isHome) {
        // If "Yes", check if the profile is complete
        const isProfileComplete = await checkProfileCompletion();
  
        if (!isProfileComplete) {
          // If profile is incomplete, show a message and exit
          // ToastAndroid.show("Please complete your profile first.", ToastAndroid.SHORT);
          return;
        }
        
        // Proceed with home tutor terms
        const termInfo = { homeTutorTermAccepted: true };
  
        setLoading(true);
        const res = await dispatch(updateTutorTerm(termInfo));
  
        if (res.success) {
          // Show success message
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
  
          // Navigate to HomeTutor screen if home tutor terms are accepted
          navigation.navigate("HomeTutor");
        } else {
          // Handle case where response is unsuccessful
          ToastAndroid.show("Something went wrong. Please try again.", ToastAndroid.SHORT);
        }
      } else {
        // If "No", just navigate to the Home screen without checking profile
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      const msg = error.res?.data?.message || "An error occurred. Please try again.";
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };


  
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Formik
      initialValues={{ selected: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <StatusBar backgroundColor={COLORS.primary} style="light" />
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
            <View style={{ flex: 1, paddingTop: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={handleGoBack}
                  style={{ marginTop: 5, paddingVertical: 20 }}
                >
                  <Image
                    source={require("../../../../assets/back.png")}
                    style={styles.back}
                  />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                  <Text style={styles.headingText}>Become a Home Yoga Tutor</Text>
                  <Text style={styles.text1}>Bring Yoga to Your Clients' Homes</Text>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../../../assets/get-screen/hTutor.png")}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.container1}>
                <Text
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 13,
                    lineHeight: 24,
                  }}
                >
                  Welcome to{" "}
                  <Text style={{ fontFamily: "Poppins-SemiBold", color: "#000" }}>
                    Swasti Bharat Partners !&nbsp;
                  </Text>
                  As a{" "}
                  <Text style={{ fontFamily: "Poppins-SemiBold", color: "#000" }}>
                    Home Yoga Tutor
                  </Text>{" "}
                  on our platform, you have the opportunity to offer
                  personalized yoga sessions right in your clients' homes.
                  Transform living rooms into serene yoga spaces and provide
                  expert guidance tailored to individual needs. By joining us,
                  you can set your own pricing, reach a wide audience, and make
                  a significant impact on your students' well-being. Sign up
                  today and help create a healthier, happier Bharat, one home
                  session at a time!
                </Text>
              </View>
              <View>
                <Text style={styles.headingText1}>
                  Are you providing Yoga Sessions at home?
                </Text>
                <SelectList
                  setSelected={(val) => setFieldValue("selected", val)}
                  data={data}
                  save="value"
                  fontFamily="Poppins"
                  search={false}
                />
                {errors.selected && touched.selected && (
                  <Text style={styles.errorText}>{errors.selected}</Text>
                )}
              </View>
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By clicking next, you accept the app's{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("TermConditions")}>
                  <Text style={styles.linkText}>Terms of Service</Text>
                </TouchableOpacity>
                <View style={styles.newLineContainer}>
                  <Text style={styles.termsText}> and </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                  <Text style={styles.termsText}>.</Text>
                </View>
              </View>
              <Button
                title={
                  loading ? (
                    <ActivityIndicator
                      size="small"
                      color="#ffffff"
                      style={styles.indicator}
                    />
                  ) : (
                    "Next"
                  )
                }
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
          <CustomAlertModal
        visible={showAlert}
        greeting="Hello,"
        boldText={boldText}
        message={alertMessage}
        onCancel={() => setShowAlert(false)}
        onOk={() => {
          setShowAlert(false);
          onAlertOk();
        }}
      />
        </View>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  back: {
    width: 24,
    height: 24,
  },
  imageContainer: {
    width: wp(90),
    height: hp(23),
    borderRadius: 10,
    backgroundColor: "#dcdcdc",
    alignSelf: "center",
    marginVertical: 20,
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  container1: {
    marginVertical: 20,
    justifyContent:'space-between',
     alignSelf:'flex-start'

  },
  headingText: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 28,
  },
  headingText1: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 28,
    marginBottom: 8,
  },
  text1: {
    fontSize: hp(1.8),
    fontFamily: "Poppins",
    lineHeight: 20,
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    width:wp('90%'),
    marginVertical:10,
  },
  termsText: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: 11,
    textAlign: "justify",
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: "Poppins_Medium",
    fontWeight: "400",
    fontSize: 11,
  },
  newLineContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  errorText: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
});

export default FirstHTutorScreen;
