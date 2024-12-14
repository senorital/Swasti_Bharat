import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,BackHandler
} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'expo-linear-gradient'; // Required by ShimmerPlaceholder
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Header from '../../../../components/header/Header';
import { COLORS } from '../../../../components/constants';
import Button from '../../../../components/button/Button';

const LocateAddress = ({navigation}) => {
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState({
    mainArea: '',
    details: '',
  });
  const [isLoadingPage, setIsLoadingPage] = useState(true); // For initial shimmer loading
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isMoving, setIsMoving] = useState(false); // Flag for UI response when moving the map
  const mapRef = useRef(null); // Reference to MapView
  const debounceTimeout = useRef(null); // Ref for debouncing address fetch

  // Fetch current location
  const fetchCurrentLocation = async () => {
    try {
      setIsMoving(true); // Start UI feedback
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        setIsMoving(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 2000); // Smooth movement in 2 seconds
      }

      // Fetch address based on current location
      fetchAddressFromCoords(latitude, longitude);
    } catch (error) {
      console.error('Error fetching location:', error.message);
      Alert.alert('Error', 'Could not fetch location.');
    } finally {
      setIsMoving(false);
    }
  };

  const fetchAddressFromCoords = async (latitude, longitude) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout fetching address')), 5000)
    );

    try {
      setIsLoadingAddress(true);
      const [addressObj] = await Promise.race([
        Location.reverseGeocodeAsync({ latitude, longitude }),
        timeout,
      ]);

      const mainArea = `${addressObj.street || ''}`;
      const details = `${addressObj.name || ''}, ${addressObj.city || ''}, ${addressObj.region || ''}, ${addressObj.country || ''}`.trim();

      setAddress({ mainArea, details });
    } catch (error) {
      console.error('Error fetching address:', error.message);
      setAddress({ mainArea: 'Error fetching main area', details: 'Error fetching details' });
    } finally {
      setIsLoadingAddress(false);
      setIsLoadingPage(false); // Stop page loading shimmer
    }
  };

  // Handle debounced address fetching
  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchAddressFromCoords(newRegion.latitude, newRegion.longitude);
    }, 1000);
  };

  const handleAddNewAddress = () => {
    if (region) {
      navigation.navigate('AddNewAddress', {
        latitude: region.latitude,
        longitude: region.longitude,
      });
    } else {
      Alert.alert('Location error', 'No valid location found.');
    }
  };

  // Load current location on component mount
  useEffect(() => {
    fetchCurrentLocation();
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);


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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />
      <View style={{ paddingTop: 20 }}>
        <Header title="Locate Address" icon={require('../../../../assets/back.png')} />
      </View>

      {region ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
          />

          {/* Center Marker */}
          <View style={styles.markerContainer}>
            <View style={styles.markerBaseOuter}>
              <View style={styles.markerBaseInner} />
            </View>
            <View style={styles.markerPole} />
            <View style={styles.tooltipContainer}>
              <Text style={styles.tooltipText}>Select your address for the tutor's session</Text>
            </View>
            <View style={styles.markerBaseOval} />
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            style={styles.currentLocationButtonInsideMap}
            onPress={fetchCurrentLocation}
          >
            {isMoving ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="locate" size={20} color={COLORS.primary} />
            )}
            <Text style={styles.currentLocationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <ShimmerPlaceholder
            style={{flex:4,width:'100%'}}
            shimmerColors={['#E0E0E0', '#F0F0F0', '#E0E0E0']}
            LinearGradient={LinearGradient}
          />
        </View>
      )}

      {/* Address Section */}
      <View style={styles.addressContainer}>
        <Text style={styles.text}>Your Address for the Tutor's session</Text>
        {isLoadingPage || isLoadingAddress ? (
          <>
            <ShimmerPlaceholder
              style={styles.shimmerMainArea}
              shimmerColors={['#E0E0E0', '#F0F0F0', '#E0E0E0']}
              LinearGradient={LinearGradient}
            />
            <ShimmerPlaceholder
              style={styles.shimmerDetails}
              shimmerColors={['#E0E0E0', '#F0F0F0', '#E0E0E0']}
              LinearGradient={LinearGradient}
            />
          </>
        ) : (
          <View style={styles.addressTextRow}>
            <View style={styles.addressTextContainer}>
              <Text style={styles.mainAreaText}>{address.mainArea}</Text>
              <Text style={styles.detailsText}>{address.details}</Text>
            </View>

            {/* Change Location Button */}
            <TouchableOpacity style={styles.changeLocationButton}>
              <Text style={styles.changeLocationText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

         <Button title="Add more address details" onPress={handleAddNewAddress} />
       </View>
    </View>
  );
};


const styles = StyleSheet.create({
  shimmerMainArea: {
    height: 50,
    borderRadius: 8,
    marginBottom: 8,
    // paddingHorizontal:10,
    width: '100%',
  },
  shimmerDetails: {
    height: 16,
    borderRadius: 8,
    width: '100%',
    // paddingHorizontal:10,

  },
  changeLocationButton: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor:COLORS.white,
    marginLeft: 10,
    borderColor: COLORS.primary,
    borderWidth:1
  },
  changeLocationText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  addressTextRow: {
    flexDirection: 'row', // Align text and button horizontally
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius:8,
    borderWidth:1,
    padding:5,
    backgroundColor:COLORS.address_blue,
    borderColor:'#ECEDEF'  },
  addressTextContainer: {
    flex: 1, // Allow address text to take up available space
  },
  mainAreaText: {
    fontSize: 18,
    color: '#000',
    fontFamily:'Poppins-Medium',
    // textAlign: 'center',
    marginBottom: 5,

  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    fontFamily:'Poppins-Light'
    // textAlign: 'center',
  },
  
  text : {
  fontFamily:'Poppins-SemiBold',
  fontSize:15,
  paddingVertical:10
  
  },
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 2.5, // Adjust the height of the map section
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    flex: 1, // Adjust the height of the address section
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',

  },
  addressText: {
    fontSize: 16,
    color: '#000',
    // textAlign: 'center',
    backgroundColor:COLORS.address_blue,
    padding:12,
 
  },
  markerContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height / 4 - 50,
    left: Dimensions.get('window').width / 2 - 10,
    alignItems: 'center',
  },
  markerBaseOuter: {
    width: 25,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerBaseInner: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  markerPole: {
    width: 3,
    height: 20,
    backgroundColor: '#000',
  },
  markerBaseOval: {
    width: 30,
    height: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 7,
    marginTop: 2,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 55,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
    width: 250,
    textAlign:'center',
    fontFamily:'Poppins'
  },
  currentLocationButtonInsideMap: {
    position: 'absolute',
    bottom: 30,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    elevation: 5,
  },
  currentLocationButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 10,
    fontFamily:'Poppins'
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#666',
  },
});

export default LocateAddress;
