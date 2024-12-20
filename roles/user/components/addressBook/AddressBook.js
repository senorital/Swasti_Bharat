import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,Share,
  BackHandler,ToastAndroid,TouchableHighlight
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons,Feather,MaterialIcons,Fontisto } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { COLORS, icons } from "../../../../components/constants";
import CustomAlertModal from "../../../../components/CustomAlert/CustomAlertModal";
import { FONTS } from "../../../../components/constants/theme";
import { deleteAddress, getAddress } from "../../../../redux/actions/user/addressBook/addressBook";
import AddNewAddress from "./AddNewAddress";
import EditAddress from "./EditAddress";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';
import LocateAddress from "./LocateAddress";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";




const AddressBook = () => {
  const totalSteps = 1;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState("Select Date");
  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [addresses, setAddresses] = useState([]); 

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [onAlertOk, setOnAlertOk] = useState(() => () => {});
  const [boldText, setBoldText] = useState('');
  const navigation = useNavigation();

  const renderShimmer = () => {
    return (
      <ShimmerPlaceHolder
        style={styles.shimmerCard}
        autoRun={true}
        width={wp("90%")}
        height={hp("15%")}
      />
    );
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

 
  const fetchData = async () => {
    try {
      setLoading(true);  // Show shimmer before data fetching
      const res = await dispatch(getAddress());  // Fetch the address data from API
      if (res.success) {
        setAddresses(res?.data);  // Save the addresses to the state
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      const msg = error.response?.data?.message;
      ToastAndroid.show(msg || 'An error occurred. Please try again.', ToastAndroid.SHORT);
      setLoading(false); 

    }
    finally{
    setLoading(false); 
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
fetchData();
}, [dispatch]);


const handlenewPress = () => {
navigation.navigate(LocateAddress);

}
 
const AddressCard = ({ title, address,id }) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Address: ${title} - ${address}`, // Format the message with the title and address
      });

   
    } catch (error) {
      console.error("Error sharing the address:", error.message);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditAddress', { id: id });
  };



  const handleDeletePress = () => {
    handleDelete(id);  // Call handleDelete with the correct address ID
  };

  const handleDelete = async (id) => {
    try {

      const res = await dispatch(deleteAddress(id));
  
      if (res && res.success) {
        // Show a toast message using ToastAndroid
        ToastAndroid.show(res?.message, ToastAndroid.SHORT);
        fetchData(); 
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      const msg = error.res?.data?.message || "An error occurred. Please try again.";
     ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

    return (
      <TouchableHighlight style={styles.card}>
        <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.addressText}>{address}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={12} color={COLORS.primary} style={{ alignItems: 'center', justifyContent: 'center' }} />
          </TouchableOpacity>
        
          <TouchableOpacity 
            style={[styles.iconButton, { marginLeft: 10 }]} 
            onPress={handleDeletePress} >
            <MaterialIcons name="delete" size={15} color={COLORS.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.iconButton, { marginLeft: 10 }]} onPress={onShare}>
            <Fontisto name="share-a" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        </View>
      </TouchableHighlight>
    );
  };
  
 
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"My Addresses"} icon={icons.back}/>
      </View>
   
   <View style={styles.container}>

      <View style={[styles.inputContainer]}>
      <View style={[styles.input, { flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center' }]}>
    
        <TouchableOpacity onPress={handlenewPress} style={styles.modalButton}>
         <View style={styles.leftContainer}>
         <Feather name="plus" size={20} color={COLORS.black} style={styles.leftIcon} />
       <Text style={styles.inputText}>Add New Address</Text>
        </View>
       </TouchableOpacity>
       <Ionicons name="chevron-forward-outline" size={24} color="black" style={styles.rightIcon}  onPress={handlenewPress}/>

            </View>
         
      </View>
      
        {/* Displaying Address Cards */}
        {loading ? (
      <View style={styles.shimmerContainer}>
        {renderShimmer()}  
        {renderShimmer()}
        {renderShimmer()}
      </View>
    ) : (
      <>
        {addresses.length > 0 ? (
          addresses.map((item) => (
            <AddressCard
              key={item.id}
              id={item.id}
              title={item.name}
              address={`${item.address}, ${item.city}, ${item.country} - ${item.zipCode}`}
            />
          ))
        ) : (
          <Text style={styles.noAddressesText}>No addresses found</Text>
        )}
      </>
    )}
    
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
    // flexGrow: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  modalButton: {
    flexDirection: 'row', // Row layout
    alignItems: 'center', // Vertically center the content
    justifyContent: 'space-between', // Space between the left and right sections
  

  },
  shimmerContainer: {
    marginTop: 10,
    width: wp("90%"),
    alignItems: "center",
  },
  shimmerCard: {
    marginBottom: 10,
    borderRadius: 5,
  },
  noAddressesText: {
    fontSize: 15,
    color: "#555",
    // justifyContent:'center',
    // textAlign: "center",
    flex:1,
    // alignItems:'center',
    marginTop: 20,
    fontFamily:'Poppins'
  },
  leftContainer: {
    flexDirection: 'row', // Align the Feather icon and text in the same row
    alignItems: 'center', // Vertically center the content
  },
  leftIcon: {
    marginRight: 10, // Add space between the Feather icon and text
  },
  inputText: {
    fontSize: 16, // Adjust text size as needed
    color: '#000', // Text color
  },
  rightIcon: {
    marginLeft: 'auto', // Push the Ionicons icon to the right
  },
    container: {
        flex: 1,
        paddingHorizontal:20,
      },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for dimming effect
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    input : {
        flexDirection : 'row',
        // borderColor : '#D2D6DB',
        // borderWidth:1,
        borderRadius: 10,
        marginTop:5, 
        padding:8,
        // width : windowWidth/1.3
        },
    inputText : {
    fontFamily:'Poppins-SemiBold',
    fontSize:15,
    color:COLORS.darkgreen
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
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
      flexDirection:'row',
      justifyContent:'space-between'
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    text: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 17,
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


export default AddressBook;
