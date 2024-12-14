import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  BackHandler,
  ToastAndroid
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { GOOGLE_MAPS_APIKEY } from "../../../../profile/apiKey/index";
import Header from "../../../../components/header/Header";
import { Formik } from "formik";

import Button from "../../../../components/button/Button";
import { addTutorLocation } from "../../../../redux/actions/instructor/homeTutor/homeTutor";

import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { TouchableHighlight } from "react-native-gesture-handler";

const defaultLocation = {
  latitude: 28.6139, // Latitude for New Delhi
  longitude: 77.2090, // Longitude for New Delhi
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const distances = [
  { id: 1, label: "1 km", value: 1000 },
  { id: 2, label: "3 km", value: 3000 },
  { id: 3, label: "5 km", value: 5000 },
  { id: 4, label: "10 km", value: 10000 },
];

const AddTLocation = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { id } = route.params;
  const [location, setLocation] = useState(defaultLocation);
  const [radius, setRadius] = useState(null);
  const [name, setName] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  
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

  const handleSelectDistance = (value) => {
    setRadius(value);
  };

  const handleLocationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    const isInIndia = details.formatted_address.includes("India");

     if (isInIndia) {
    setLocation({
      latitude: parseFloat(lat.toFixed(7)),
      longitude: parseFloat(lng.toFixed(7)),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setName(details.formatted_address);
    setValidationMessage("");
  } else {
    setValidationMessage("Please select a location within India.");
    setLocation(defaultLocation);
    setName("");
  }
  };

  useEffect(() => {
    // Enable submit button only if radius, name, latitude, and longitude are set and not default
    if (
      radius &&
      name &&
      location.latitude !== defaultLocation.latitude &&
      location.longitude !== defaultLocation.longitude
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [radius, name, location]);

  const renderStepTwo = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
  }) => (
    <View style={styles.stepContainer}>
      <View style={styles.autocompleteContainer}>
        <Text style={styles.label}>Enter Service area Location</Text>
        <GooglePlacesAutocomplete
  placeholder="Search by location"
  onPress={handleLocationSelect}
  query={{
    key: GOOGLE_MAPS_APIKEY,
    language: "en",
  }}
  fetchDetails={true}
  renderRow={(rowData) => {
    const { description } = rowData;
    return (
      <View style={styles.row}>
        <Ionicons
          name="location-outline"
          size={20}
          color="#000"
          style={styles.locationIcon}
        />
        <Text style={styles.locationText} numberOfLines={1}>
          {description}
        </Text>
      </View>
    );
  }}
  textInputProps={{
    value: name, // Bind the current value to the state
    onChangeText: (text) => setName(text), // Update the state when text changes
    placeholderTextColor: "#999",
    style: {
      fontFamily: "Poppins", // Apply Poppins font to text input
      borderColor: COLORS.background,
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: COLORS.background,
      paddingHorizontal: 10,
      width: "100%",
      marginTop: 5,
      fontSize: 13,
      paddingVertical: 5,
    },
  }}
  renderLeftButton={() => null} // No left button needed
  renderRightButton={() =>
    name ? ( // Conditionally render the clear button if there is text
      <TouchableHighlight
        style={styles.clearButton}
        onPress={() => setName("")} // Clear the input text when pressed
      >
        <Ionicons name="close-circle" size={20} />
      </TouchableHighlight>
    ) : null
  }
  styles={{
    container: { flex: 0 },
    listView: { zIndex: 1000 },
    poweredContainer: {
      display: "none", // Hide "Powered by Google" container
    },
    powered: {
      display: "none", // Hide "Powered by Google" text
    },
  }}
/>


           {validationMessage ? (
          <Text style={styles.validationText}>{validationMessage}</Text>
        ) : null}
      </View>

        {location && (
          <View>
            <MapView style={styles.map} region={location}>
              <Marker coordinate={location} />
              <Circle
                center={location}
                radius={radius}
                fillColor="rgba(135,206,250,0.5)"
                strokeColor="rgba(135,206,250,1)"
              />
            </MapView>
          </View>
        )}
      <FlatList
        data={distances}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.distanceButton,
              item.value === radius
                ? styles.selectedDistanceButton
                : styles.unselectedDistanceButton,
            ]}
            onPress={() => handleSelectDistance(item.value)}
          >
            <Text
              style={[
                styles.distanceButtonText,
                item.value === radius
                  ? styles.selectedDistanceButtonText
                  : styles.unselectedDistanceButtonText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.distanceList}
      />
        <View style={styles.buttonContainer}>

      <Button
        title={
          isSubmitting ? (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={styles.indicator}
            />
          ) : (
            "Submit"
          )
        }
        onPress={handleSubmit}
      />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Add Service Area Location"} icon={icons.back} />
      </View>

      <>
        <View style={{ paddingHorizontal: 20 }}>{renderStepTwo}</View>
        <Formik
         initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {
            if (!name) {
              // Toast.show({
              //   type: "error",
              //   text1: "Service area is required",
              //   visibilityTime: 2000,
              //   autoHide: true,
              // });
              ToastAndroid.show("Service area is required", ToastAndroid.SHORT);
              setSubmitting(false);
              return;
            }
        
            if (!name.includes("India")) {
              ToastAndroid.show(
                "Please select a location within India.",
                ToastAndroid.SHORT
              );
              setSubmitting(false);
              return;
            }

            if (!radius) {
              // Toast.show({
              //   type: "error",
              //   text1: "Distance is required",
              //   visibilityTime: 2000,
              //   autoHide: true,
              // });
              ToastAndroid.show("Distance is required", ToastAndroid.SHORT);

              setSubmitting(false);
              return;
            }
            const locationData = {
              id: id,
              latitude: String(location.latitude),
              longitude: String(location.longitude),
              locationName: name,
              radius: String(radius),
              unit: "km",
            };
            dispatch(addTutorLocation(locationData))
              .then((res) => {
             
                ToastAndroid.show(res.message,ToastAndroid.SHORT)

                setSubmitting(false);
                navigation.goBack();
              })
              .catch((error) => {
                console.error("Error adding tutor location:", error);
               
                ToastAndroid.show('An error occurred. Please try again.',ToastAndroid.SHORT)

                setSubmitting(false);
              });
          }}
        >
           {(formikProps) => renderStepTwo(formikProps)}
        </Formik>
      </>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    position: "absolute", // Positions the button at the bottom
    bottom: 16, // Space from the bottom
    left: 16, // Space from the left
    right: 16, // Space from the right
  },
  stepContainer: {
    paddingHorizontal: 20,
    flex:1
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "600",
  },

  autocompleteContainer: {
    zIndex: 1,
    width: "100%",
    // marginVertical: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  distanceButton: {
    height:50,
    width:68,
    borderRadius: 5,
    
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  validationText: {
    color: "red",
    fontSize: 12,
    fontFamily:'Poppins',
    marginTop: 5,
  },
  selectedDistanceButton: {
    backgroundColor: "rgba(102, 42, 178, 1)",
    borderColor: "rgba(102, 42, 178, 1)",
  },
  unselectedDistanceButton: {
    backgroundColor: "#fff",
    borderColor: "lightgray",
  },
  distanceButtonText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 12,
    zIndex: 10,
  },
  locationText: {
    fontSize: 13,
    color: "#000",
    flex: 1,
    justifyContent:'center',
    
    fontFamily:'Poppins-Medium'
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    // marginLeft:-5
    // paddingHorizontal: 5,
  },
  locationIcon: {
    marginRight: 5,
    marginLeft:-5
  },
  selectedDistanceButtonText: {
    color: "#fff",
  },
  unselectedDistanceButtonText: {
    color: "#000",
  },
  distanceList: {
    // paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddTLocation;
