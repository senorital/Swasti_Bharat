import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, Fontisto, MaterialIcons, Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import * as Location from "expo-location";
import { COLORS } from '../../../components/constants';
import { FONTS } from '../../../components/constants/theme';
import { styles } from './style';
import { useDispatch } from 'react-redux';
import { getAddress } from '../../../redux/actions/user/addressBook/addressBook';
const LocationModal = ({ isVisible, toggleModal, onSelectAddress }) => {
  const navigation = useNavigation();

  // Local states
  const [addresses, setAddresses] = useState([]); // Stores fetched addresses
  const [loading, setLoading] = useState(true); // Loading state for API request
  const [errorMsg, setErrorMsg] = useState(null); // To store any error from API
  const [location, setLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const dispatch = useDispatch();
  // Fetch addresses from getAddress function
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getAddress()); // Call the getAddress function
      if (response && Array.isArray(response.data)) {
        setAddresses(response.data); // Update the addresses state with the fetched data
      } else {
        setErrorMsg('No addresses available');
      }
      setLoading(false);
    } catch (error) {
      setErrorMsg('Failed to fetch addresses');
      setLoading(false);
      console.error(error);
    }
  };

  

  // Fetch current location
  const getLocation = async () => {
    setLoadingLocation(true);
    setErrorMsg(null);
    setCurrentAddress(null);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setCurrentAddress(geocode[0]);
    } catch (error) {
      setErrorMsg("Error fetching location");
      console.error(error);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchAddresses(); // Fetch the addresses when the modal opens
    getLocation(); // Fetch current location
  }, []);

  const handleAddNewAddress = () => {
    toggleModal();
    navigation.navigate('LocateAddress');
  };

  const handleAddressSelect = (address) => {
    onSelectAddress(address);
    toggleModal();
  };

  return (
    <Modal
      visible={isVisible}
      onBackdropPress={toggleModal}
      swipeDirection={['down']}
      transparent={true}
      presentationStyle="overFullScreen"
      onSwipeComplete={toggleModal}
      style={stylesc.bottomModal}
      backdropOpacity={0.5}
    >
      <View style={stylesc.overlay} />

      <TouchableOpacity onPress={toggleModal} style={{ alignItems: 'center' }}>
        <Ionicons name="close" size={25} color="white" style={stylesc.close} />
      </TouchableOpacity>

      <View style={stylesc.modalContent}>
        <Text style={[stylesc.text, { color: '#0F1012', marginBottom: 0 }]}>
          Select Address
        </Text>

        <View style={[styles.inputContainer]}>
          <View style={[styles.input, { flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center' }]}>
            <Feather name="plus" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
            <TouchableOpacity onPress={handleAddNewAddress} style={stylesc.modalText}>
              <Text style={stylesc.inputText}>Add New Address</Text>
            </TouchableOpacity>

            <Ionicons name="chevron-forward-outline" size={24} color="black" style={{ marginLeft: 'auto' }} />
          </View>
        </View>

        <Text style={{ fontFamily: 'Poppins', color: COLORS.grey, marginLeft: 5 }}>Your Current Location</Text>

        {/* Static Address Cards */}
        <ScrollView style={stylesc.addressContainer}>
          {loadingLocation ? (
            <Text>Loading current location...</Text>
          ) : errorMsg ? (
            <Text style={{ color: 'red' }}>{errorMsg}</Text>
          ) : currentAddress ? (
            <AddressCard
              onSelect={handleAddressSelect}
              title="Current Location"
              address={`${currentAddress.name}, ${currentAddress.city}, ${currentAddress.region}, ${currentAddress.country}`}
            />
          ) : (
            <Text>No current location available</Text>
          )}

          {/* Render Address Cards from API */}
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : errorMsg ? (
            <Text style={{ color: 'red' }}>{errorMsg}</Text>
          ) : addresses.length > 0 ? (
            addresses.map((addr, index) => (
              <AddressCard
                key={index}
                onSelect={handleAddressSelect}
                title={addr.name}
                address={`${addr.address}, ${addr.city}, ${addr.country}`}
              />
            ))
          ) : (
            <Text>No saved addresses available</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const AddressCard = ({ title, address, onSelect }) => {
  return (
    <TouchableOpacity style={stylesc.card} onPress={() => onSelect(address)}>
      <Text style={stylesc.title}>{title}</Text>
      <Text style={stylesc.addressText}>{address}</Text>
      <View style={stylesc.iconContainer}>
        <TouchableOpacity style={stylesc.iconButton}>
          <MaterialIcons name="edit" size={12} color={COLORS.primary} style={{ alignItems: 'center', justifyContent: 'center' }} />
        </TouchableOpacity>
        <TouchableOpacity style={[stylesc.iconButton, { marginLeft: 10 }]}>
          <Fontisto name="share-a" size={12} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const stylesc = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for dimming effect
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: COLORS.primary
  },
  close: {
    backgroundColor: '#1A1D17',
    borderRadius: 50,
    padding: 8,
    margin: 12,
  },
  modalContent: {
    backgroundColor: '#F5F6FB',
    padding: 20,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    ...FONTS.h4
  },
  addressText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: COLORS.black,
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 5
  },

    iconButton: {
      width: 30,
      height: 30,
      borderRadius: 20,
      borderColor:COLORS.dark_purple,
      borderWidth:1,
      backgroundColor: COLORS.background,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    addressContainer: {
    },
  });

  export default LocationModal;
