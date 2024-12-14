import React, { useState , useEffect} from "react";
import { View, Text, StyleSheet, Image, ImageBackground,BackHandler, Modal, ActivityIndicator, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../components/button/Button";
import { COLORS } from "../../components/constants";
import * as Location from 'expo-location';
import { useDispatch } from "react-redux";
import { setLocationAddress, clearLocationAddress } from "../../redux/actions/instructor/locationActions/locationActions";
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const DenyLocation = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Location Permission Needed",
        "Please allow location permission for smooth functioning of the app.",
        [
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
      return true; // Prevents the back action
    };

    // Add the event listener for back press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener on component unmount
    return () => backHandler.remove();
  }, []);

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const requestLocationPermission = async () => {
    setLoading(true);
    dispatch(clearLocationAddress());

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const role = await AsyncStorage.getItem('userRole');
      
      if (status === 'granted') { 
        const location = await Location.getCurrentPositionAsync({});
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          Alert.alert(
            "Enable Location Services",
            "Location services are currently disabled. Please enable them in your device settings to continue.",
            [
              {
                text: "Retry",
                onPress: openAppSettings,
              },
            ],
            { cancelable: false }
          );
        }
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        dispatch(setLocationAddress(geocode[0]));

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "appStack", params: { role : role } }],
          })
        );
        return;
        
      } else {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          Alert.alert(
            "Enable Location Services",
            "Location services are currently disabled. Please enable them in your device settings to continue.",
            [
              {
                text: "Retry",
                onPress: openAppSettings,
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "Location Permission Denied",
            "Location permission is required to use this feature. Please allow location access.",
            [
              {
                text: "Retry",
                onPress: openAppSettings,
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      Alert.alert(
        "Location Permission Denied",
        "Location permission is required to use this feature. Please allow location access.",
        [{ text: "Retry", onPress: checkLocationPermissions }]
      );
    } finally {
      setLoading(false);
    }
  };

  const checkLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return false;
    const isLocationEnabled = await Location.hasServicesEnabledAsync();
    return isLocationEnabled;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={{ flex: 1 }}>
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
          <Button title="Allow" onPress={requestLocationPermission} />
        </View>
      </LinearGradient>

      {/* Loading Indicator Modal */}
      {loading && (
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => {}}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DenyLocation;
