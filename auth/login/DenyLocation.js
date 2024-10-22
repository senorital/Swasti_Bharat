import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Alert, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../components/button/Button";
import { COLORS } from "../../components/constants";
import * as Location from 'expo-location';
import { useDispatch } from "react-redux";
import { setLocationAddress, clearLocationAddress } from "../../redux/actions/instructor/locationActions/locationActions";
import { CommonActions } from '@react-navigation/native';

const DenyLocation = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();

  const requestLocationPermission = async () => {
    setLoading(true);
    setErrorMsg(null);
    dispatch(clearLocationAddress());

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        console.log('Location:', location);

        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log('Geocode:', geocode);
        dispatch(setLocationAddress(geocode[0]));

        // Reset the navigation stack to the initial route
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }], // Replace 'Login' with the actual name of your login screen
          })
        );
        return;
      }

      // Prompt the user to enable location services if not enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        setErrorMsg('Location services are disabled');
        Alert.alert(
          'Location Disabled',
          'Location services are disabled. Please enable them to use this feature.',
          [
            {
              text: 'Retry',
              onPress: requestLocationPermission,
            },
          ]
        );
      } else {
        setErrorMsg('Location permission denied');
        Alert.alert(
          'Location Permission Denied',
          'Location permission is required to use this feature. Please allow location access.',
          [
            {
              text: 'Retry',
              onPress: requestLocationPermission,
            },
          ]
        );
      }

    } catch (error) {
      console.log('Error:', error.message);

      if (error.message === 'Location request failed due to unsatisfied device settings') {
        setErrorMsg('Location request failed due to unsatisfied device settings');
        Alert.alert(
          'Location Request Failed',
          'Location request failed due to unsatisfied device settings. Please try again.',
          [
            {
              text: 'Retry',
              onPress: requestLocationPermission,
            },
          ]
        );
      } else {
        setErrorMsg('Error fetching location');
        Alert.alert(
          'Error',
          'An error occurred while fetching location.',
          [
            {
              text: 'Retry',
              onPress: requestLocationPermission,
            },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
        style={{ flex: 1 }}
      >
        <View style={styles.header} />

        <View style={styles.container}>
          <ImageBackground
            source={require("../../assets/location/denybackground.png")}
            style={styles.backgroundImage}
          >
            <Image
              source={require("../../assets/location/mark_point.png")}
              style={styles.markPoint}
            />
          </ImageBackground>

          <Text style={styles.title}>Location</Text>
          <Text style={styles.message}>
            Allow maps to access your location while you use the app
          </Text>
          <Button title="Allow" onPress={() => {
            setErrorMsg(null);  // Reset error message
            requestLocationPermission();  // Retry location request
          }} />
        </View>
      </LinearGradient>

      {/* Loading Indicator Modal */}
      {loading && (
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => { }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: 180,
    height: 120,
    marginTop: 40,
    alignItems: 'flex-end',
    resizeMode: 'contain',
    justifyContent: 'flex-end',
  },
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    marginTop: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  markPoint: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: '5%',
    left: '45%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  title: {
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#606268',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    // backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DenyLocation;
