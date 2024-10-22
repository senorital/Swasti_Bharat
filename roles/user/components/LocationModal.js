  import React ,{useEffect,useState}from 'react';
  import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
  import { Ionicons,Fontisto, MaterialIcons,Feather } from '@expo/vector-icons';
  import Modal from 'react-native-modal';
  import { useNavigation } from '@react-navigation/native'; // Navigation hook
  import { styles } from './style';
  import { COLORS } from '../../../components/constants';
  import { FONTS } from '../../../components/constants/theme';
  import * as Location from "expo-location";


  
  const LocationModal = ({ isVisible, toggleModal, onSelectAddress }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [address, setAddress] = useState(null); // State to store fetched address
    const [currentLocation, setCurrentLocation] = useState(null); // State for current location
    const [location, setLocation] = useState(null);

    useEffect(() => {
      getLocation()
    }, []);
    const getLocation = async () => {
      setLoading(true);
      setErrorMsg(null);
      setAddress(null);
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }
    
        // Get the current location
        let location = await Location.getCurrentPositionAsync({});
        console.log("Location:", location); // Log the entire location object
        console.log("Latitude:", location.coords.latitude); // Log the latitude
        console.log("Longitude:", location.coords.longitude); // Log the longitude
        setLocation(location);
    
        // Reverse geocode the location to get the address
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log("Geocode:", geocode); // Log the geocode result
        setAddress(geocode[0]);
        
      } catch (error) {
        setErrorMsg("Error fetching location");
        console.error(error); // Log the error
      } finally {
        setLoading(false);
      }
    };
  
    
    const handleAddNewAddress = () => {
      toggleModal(); 
      navigation.navigate('AddNewAddress'); 
    };
  
    // Function to handle address selection
    const handleAddressSelect = (address) => {
      onSelectAddress(address); // Pass the selected address to the parent
      toggleModal(); // Close the modal
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
            {/* <View style={[styles.input, { flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center' }]}>
              <Feather name="plus" size={20} color={COLORS.darkgreen} style={{ marginRight: 10 }} />
              <TouchableOpacity onPress={handleAddNewAddress} style={stylesc.modalText}>
                <Text style={stylesc.inputText}>Add New Address</Text>
              </TouchableOpacity>

              <Ionicons name="chevron-forward-outline" size={24} color="black" style={{ marginLeft: 'auto' }} />
            </View> */}
          </View>
          <Text style={{fontFamily:'Poppins',color:COLORS.grey,marginLeft:5}}>Your Current Location</Text>

          {/* Static Address Cards */}
          <View style={stylesc.addressContainer}>
          {loading ? (
            <Text>Loading...</Text> // Show loading message if fetching location
          ) : errorMsg ? (
            <Text style={{ color: 'red' }}>{errorMsg}</Text> // Show error message if there's an error
          ) : address ? (
            <AddressCard onSelect={handleAddressSelect} title="Current Location" address={`${address.name}, ${address.city}, ${address.region}, ${address.country}`} />
          ) : (
            <Text>No address found</Text> // Fallback message
          )}
        </View>
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
            <MaterialIcons name="edit" size={12} color="darkgreen" style={{ alignItems: 'center', justifyContent: 'center' }} />
          </TouchableOpacity>
          <TouchableOpacity style={[stylesc.iconButton, { marginLeft: 10 }]}>
            <Fontisto name="share-a" size={12} color="darkgreen" />
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
    inputText : {
    fontFamily:'Poppins-SemiBold',
    fontSize:15,
    color:COLORS.darkgreen
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
    title :{
    ...FONTS.h4
    },
    addressText: {
      fontFamily: 'Poppins',
      fontSize: 14,
      color: COLORS.black,
    },
    iconContainer: {
      flexDirection: 'row',
      marginTop:5
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
