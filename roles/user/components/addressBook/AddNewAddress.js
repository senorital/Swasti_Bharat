import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StatusBar, BackHandler, ToastAndroid ,StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { addAddress } from '../../../../redux/actions/user/addressBook/addressBook';
import Input from '../../../../components/input/Input'; // Custom input component
import Button from '../../../../components/button/Button'; // Custom button component
import Header from '../../../../components/header/Header'; // Custom header component
import CustomAlertModal from '../../../../components/CustomAlert/CustomAlert';
import { COLORS, icons } from '../../../../components/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import Toast from 'react-native-toast-message';



const AddNewAddress = ({ navigation }) => {
  const dispatch = useDispatch();
//   const address = useSelector((state) => state.address.addresses);
  const [loading1, setLoading1] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [onAlertOk, setOnAlertOk] = useState(() => () => {});
  const [boldText, setBoldText] = useState('');

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
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


  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
    .min(3, 'Name must be at least 3 characters') // Ensure minimum length of 3
    .required('Please input name'),  
    email: Yup.string().email('Invalid email format').required('Please input email'),
    phoneNumber: Yup.string()
    .required('Mobile Number is required')
    .matches(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits'),
    zipCode: Yup.string().required('Please input zipcode'),
    city: Yup.string().required('Please input city'),
    country: Yup.string().required('Please input country'),
  });

  const handleSubmitForm = async (values, { setSubmitting, setErrors }) => {
    try {
      setLoading1(true); // Show loading
      const payload = {
        ...values,
        latitude: String(0.2), // Convert latitude to string
        longitude: String(2.3), // Convert longitude to string
      };
      const response = await dispatch(addAddress(payload));
      console.log("Add address response:", response);
      if (response?.status === 400) {
        ToastAndroid.show(response.message || 'Bad request. Please check your inputs.', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(response.message || 'Address added successfully!', ToastAndroid.SHORT);
        navigation.navigate('AddressBook');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      const msg = error.response?.data?.message || 'An error occurred. Please try again.';
      setAlertMessage(msg);
      setBoldText("Error");
      setShowAlert(true);
    } finally {
      setLoading1(false);
      setSubmitting(false); // End loading state for Formik
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Add Address"} icon={icons.back} />
      </View>

      <Formik
        initialValues={{
          name:  '',
          email: '',
          phoneNumber: '',
          zipCode: '',
          city: '',
          country: '',
          address: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
            <View style={{ flex: 1 }}>
              <Input
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                label="Save Address as *"
                placeholder="Name"
                value={values.name}
                error={touched.name && errors.name}
                maxLength={50}
              />
              <Input
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                label="Email"
                placeholder="Email"
                value={values.email}
                error={touched.email && errors.email}
              />
              <Input
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                label="Mobile Number"
                placeholder="Mobile Number"
                keyboardType="numeric" // Numeric keyboard
                value={values.phoneNumber}
                error={touched.phoneNumber && errors.phoneNumber}
                maxLength={10} 
              />
              <Input
                onChangeText={handleChange('zipCode')}
                onBlur={handleBlur('zipCode')}
                label="zipCode"
                placeholder="zipCode"
                value={values.zipCode}
                keyboardType="numeric" // Numeric keyboard
                error={touched.zipCode && errors.zipCode}
                maxLength={6} 
              />
              <Input
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                label="City"
                placeholder="City"
                value={values.city}
                error={touched.city && errors.city}
              />
              <Input
                onChangeText={handleChange('country')}
                onBlur={handleBlur('country')}
                label="Country"
                placeholder="Country"
                value={values.country}
                error={touched.country && errors.country}
              />
              <Input
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                label="Address"
                placeholder="Enter Your Address"
                value={values.address}
                multiline
                numberOfLines={5}
              />
            </View>

            <Button
              title={isSubmitting || loading1 ? (
                <ActivityIndicator size="small" color="#ffffff" style={styles.indicator} />
              ) : "Submit"}
              onPress={handleSubmit}
            />
          </ScrollView>
        )}
      </Formik>

      {/* <CustomAlertModal
        visible={showAlert}
        greeting="Hello,"
        boldText={boldText}
        message={alertMessage}
        onCancel={() => setShowAlert(false)}
        onOk={onAlertOk}
      /> */}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  defaultBorder: {
    borderColor: COLORS.icon_background,
    borderWidth:1,
    borderRadius:10 // Default border color
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth:1,
    borderRadius:10 // Error border color
  },
  multiSelectContainer: {
    marginBottom: 10,
  },
  label: {
    marginVertical: 5,
    color : COLORS.primary,
    fontSize: 14,
    fontFamily: "Poppins_Medium",
  },
  errorText: {
    fontFamily:'Poppins',
    color: "red",
    fontSize: 12,
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
  marginBottom:10,
    paddingHorizontal: 10,
    fontFamily: "Poppins",
    height: 45,
  },
  languageList: {
    flexDirection: "row", // Display items horizontally
    flexWrap: "wrap", // Wrap items to next row when needed
  },
  languageItem: {
    margin: 5, // Add some margin between items
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  cameraContainer: {
    width: wp(40),
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10,
    marginBottom:10,
    backgroundColor: "#fff",
  },
  cameraImage: {
    width: 30,
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  cameraText: {
    fontSize: hp(2),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  progressBar: {
    backgroundColor: "#ccc",
    height: 5,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 5,
  },
  progressBarActive: {
    backgroundColor: "#5F33E1",
  },
  stepContainer: {
    padding: 20,
  },
  autocompleteContainer: {
    zIndex: 1,
    width: "100%",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
  },

  retryText: {
    color: "#00f",
    textDecorationLine: "underline",
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  tab: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 5,
    marginTop:3,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  styleInputGroup: {
    borderWidth: 0, // Remove underline from input group
    borderBottomWidth : 0,
    paddingVertical:10,
   marginLeft:0,
  //  padding:8,
  padding:0,
  minHeight:48,
   paddingHorizontal :0
  },
  styleDropdownMenuSubsection: {
    borderWidth: 0, // Remove underline from dropdown menu subsection
    borderBottomWidth : 0,
    paddingVertical:10,
    paddingHorizontal:0
  },
  styleMainWrapper: {
    
    paddingHorizontal: 10,
    paddingVertical:0,
  },
  tabText: {
    color: '#000',
    fontSize: 13,
    fontFamily:'Poppins'
  },
  removeButton: {
    marginLeft: 5,
    padding: 5,
    marginTop:-5,
    borderRadius: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#000'
  },
  styleDropdownMenu: {
    borderWidth: 0, // Remove underline from dropdown menu
    // paddingVertical:10,

  },
});

export default AddNewAddress;
