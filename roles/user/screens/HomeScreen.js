import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, BackHandler,TouchableOpacity,Pressable, ActivityIndicator, Dimensions, useWindowDimensions } from 'react-native';
import { Avatar } from "react-native-elements";
import { windowHeight, windowWidth } from '../../../utils/Dimensions';
import { styles } from '../components/style';
import { StatusBar } from 'expo-status-bar';
import { Ionicons,FontAwesome5, Octicons } from '@expo/vector-icons';
import * as Location from "expo-location";
import ImageSlider from '../components/imageSlider/ImageSlider';
import { Feather } from '@expo/vector-icons';
import { getBanners, getYogaForCategory } from '../../../redux/actions/user/authActions';
import AntDesign from '@expo/vector-icons/AntDesign';
import Modal from 'react-native-modal'; // Import the modal library
import Searchbar from '../components/Search/Searchbar';
import { COLORS } from '../../../components/constants';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from '../../../redux/actions/auth/auth';
import { getInstructor } from '../../../redux/actions/auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlertModal from "../../../components/CustomAlert/CustomAlert";
import Class from '../components/classes/myClasses';
import defaultImage from '../../../assets/batch.png';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import CategoryDetail from '../components/category/categoryDetail';
import DenyLocation from '../../../auth/login/DenyLocation';
import { setLocationAddress,clearLocationAddress } from '../../../redux/actions/instructor/locationActions/locationActions';
import LocationModal from '../components/LocationModal';


const YogaCard = ({ text1, text2, image, navigation,path,category,marginHorizontal })=> {
  const handlePress = () => {
    if (path) {
      navigation.navigate(path);
    }
    if (category) {
      navigation.navigate('CategoryDetail', { category: text1 });
    }
  };
// console.log("image :" + image)
  return (
    <TouchableOpacity onPress={handlePress} style={[stylesc.cardContainer,{marginHorizontal}]}>
    <View style={[stylesc.imageContainer]}>
    <Image source={image} style={stylesc.categoryImage} />
    </View>
    <View style={{marginLeft:10}}>
    <Text style={[stylesc.categoryText]}>{text1}</Text>
    <Text style={[stylesc.smalltext]}  numberOfLines={1}  ellipsizeMode="tail">{text2}</Text>
    </View>
  </TouchableOpacity>
  );
};

// const Card = () => {
  

 

//   const handleCardPress = (path) => {
//     navigation.navigate(path); // Navigate to the dynamic 'path' from the API
//   };

//   return (
//     <>
//       <Text style={[styles.text, { fontFamily: 'Poppins-Medium', marginTop: 10 }]}>
//         Explore Categories
//       </Text>
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false} 
//         style={stylesc.scrollContainer}
//       >
//         {yogaCategories && yogaCategories.length > 0 ? (
//           yogaCategories.map((category) => (
//             <TouchableOpacity 
//               key={category.id} 
//               onPress={() => handleCardPress(category.slug)} // Use the 'slug' or dynamic 'path'
//             >
//               <View style={stylesc.card}>
//                 <Image 
//                   source={{ uri: category.path }} 
//                   style={stylesc.cardImage} 
//                 />
//                 <View style={{ padding: 10 }}>
//                   <Text style={stylesc.cardText}>{category.yogaFor}</Text>
//                   <Text style={stylesc.smalltext}>{category.description}</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         ) : (
//           <Text>No categories available</Text>
//         )}
//       </ScrollView>
//     </>
//   );
// };
const Card = ({ image, path, text1, text2, description, onPress,marginHorizontal ,navigation}) => {
  return (
    <TouchableOpacity  onPress={() => navigation.navigate(path, { classType: text1 })} >
      <View style={[stylesc.card, { marginHorizontal }]}>
        <Image 
          source={image} 
          style={stylesc.categoryImage} 
        />
        <View style={{ padding: 10 }}>
          <Text style={stylesc.cardText}>{text1}</Text>
          {/* <Text style={styles.smalltext}>{description}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};



const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [authToken, setAuthToken] = useState(null);
  const [yogaCategoriesData, setYogaCategoriesData] = useState([]); // State to hold yoga categories
  const address_loc = useSelector((state) => state.location.address);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  console.log("address :" + address_loc)

  const userRole = useSelector((state) => state.auth.user);
  const yogaCategories = useSelector((state) => state.auth.yogaForCategory);
 
  useEffect(() => {
    fetchAuthToken(),
    getLocation(),
    fetchData();
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
      const { latitude, longitude } = location.coords;
  
      setLocation(location);
  
      // Reverse geocode the location to get the address
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
  
      if (geocode.length > 0) {
        const formattedAddress = geocode[0].formattedAddress;
        setAddress(formattedAddress);
  
        // Dispatch the location to Redux store
        dispatch(
          setLocationAddress({
            address: formattedAddress,
            latitude,
            longitude,
          })
        );
      } else {
        setErrorMsg("Unable to fetch address");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMsg(
        error.message ===
          "Location request failed due to unsatisfied device settings"
          ? "Please enable location services in device settings"
          : "Error fetching location"
      );
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      console.log("Fetching data...");
  
      // Fetch user data
      const userRes = await dispatch(getUser());
      console.log("User Name: " + userRes.data.name);
  
      // Fetch yoga category data
      const yogaRes = await dispatch(getYogaForCategory());
      // console.log("Yoga Category: " + JSON.stringify(yogaRes.data));
      setYogaCategoriesData(yogaRes.data);

    } catch (error) {
      // Identify the API call that failed
      if (error?.response?.config?.url?.includes('getUser')) {
        console.error("Error in fetching user data:", error.response?.data?.message || error.message);
      } else if (error?.response?.config?.url?.includes('getYogaForCategory')) {
        console.error("Error in fetching yoga category data:", error.response?.data?.message || error.message);
      } else {
        console.error("Unknown error:", error.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  useEffect(() => {
    const backAction = () => {
      setIsModalVisible(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleConfirm = () => {
    BackHandler.exitApp();
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };


  const fetchAuthToken = async () => {
    try {
      console.log("Fetching auth token...");

      const token = await AsyncStorage.getItem("authToken");
      console.log("Token :" + token)
      if (token !== null) {
        setAuthToken(token);
      } else {
        console.log("No auth token found");
      }
    } catch (error) {
      console.error("Failed to fetch the auth token:", error);
    }
    
  };

  // console.log("user.data.name" + user.data.name)

  const fetchBannerImages = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const res = await dispatch(getBanners());
      console.log(res);
      if (res.success) {
        setBannerImages(res.data);
      } else {
        setErrorMsg(res.message);
      }
    } catch (error) {
      console.error('Error fetching banner images:', error);
      setErrorMsg('Error fetching banner images');
    } finally {
      setLoading(false);
    }
  };

 
  const handleSelectAddress = (addresss) => {
    setSelectedAddress(addresss); // Update the selected address state
    console.log('Selected Address:', addresss); // Log the selected address
    // navigation.navigate('Payment'); // Change 'Payment' to the actual route name if it's different
    // setIsAddressSelected(true); // Update state when address is selected

  };

  const handleIconPress = () => {
    setShowLocationModal(true); // Show the LocationModal
  };

  const closeModal = () => {
    setShowLocationModal(false); // Close the LocationModal
  };

  const imageUrl = userRole && userRole.profilePic && userRole.profilePic.path
  ? { uri: userRole.profilePic.path }
  : require("../../../assets/dAvatar.jpg");

console.log(userRole?.profilePic?.path);

  return (
    <ScrollView style={{backgroundColor:'#fff'}} showsVerticalScrollIndicator={false} >
      <StatusBar style="dark" backgroundColor={COLORS.user_front_theme_color} />
      <View style={{paddingTop:30}}></View>
        <View style={stylesc.redContainer} />
    
      <View style={styles.content}>
      

        <View style={styles.topBar}>
          <View style={{flexDirection:'column'}}>
          <Text style={{}}>
        {userRole && (
            <Text style={{ fontFamily: "Poppins-SemiBold",fontSize:20}}>
            {/* { console.log("user.data.name :" + user.name)} */}
            Hi,&nbsp;
            
             {userRole.name}


           </Text>
         )}
          &nbsp;
       </Text>    
       {loading ? (
          <View>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : errorMsg ? (
          <View>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity onPress={getLocation}>
              <Text style={{}}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : address ? (
         
             <TouchableOpacity onPress={handleIconPress}>
               <View style={{ width:'80%',flexDirection:'row'  }}>
               <Text style={[styles.greetingText, { color: '#000', fontSize: 12, fontFamily: 'Poppins' }]} numberOfLines={1} ellipsizeMode="tail">
               {selectedAddress ? selectedAddress : (address ? address + ", " : "")}
                </Text>
            <Octicons name="triangle-down" size={18} color="black" />
            </View>
            </TouchableOpacity>
           
        ) : null}  
        </View>
       <TouchableOpacity onPress={() => navigation.navigate('MainProfile')}>
       <Avatar
    rounded
    source={imageUrl}
    containerStyle={{ borderColor: 'white', borderWidth: 2 }}
    size={50}
  />
   </TouchableOpacity>
        </View>

       
        <Text style={[styles.additionalText, { color: '#210d68', marginTop: 10 }]}>Find the best Yoga Instructors and Trainers</Text>
         <View style={{alignItems:'center',justifyContent:'center'}}>      
        <Searchbar categories={yogaCategoriesData} />
        </View> 
        </View>
      
      <View style={stylesc.container}>
      <ImageSlider />
    
     <View style={{ flexDirection: 'row',marginTop:20}}>
            <Card 
              text1="Morning Classes" 
              marginHorizontal={0}
              image={require('../../../assets/get-screen/tutor3.jpg')} 
              navigation={navigation} 
              // text2 = "4:00-10:00 AM"
              path="Session"
            />
            <Card 
              text1="Evening Classes" 
              path="Session"  
              marginHorizontal={10}            
              image={require('../../../assets/get-screen/tutor3.jpg')} 
              navigation={navigation} 
              // text2="1:00-7:00 PM"
            />
         
          </View>
      
         
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 }}>
      <Text style={[styles.text, { fontFamily: 'Poppins-Medium' }]}>
        Explore Categories
      </Text>
      <Pressable onPress={() => navigation.navigate('Category')} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.seeall}>see all</Text>
        <FontAwesome5 name="angle-right" size={14} color={COLORS.primary} style={{ marginLeft: 5 }} />
      </Pressable>
    </View>
        <View style={{flexDirection:'row'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>    
            {yogaCategoriesData.map((category, index) => (
              <YogaCard 
                key={index} // Unique key for each card
                text1={category.yogaFor} // Pass category name as text1
                text2={category.description || 'Every Day'} // Pass description or fallback text
                image={{
                  uri: Image.resolveAssetSource(defaultImage).uri,
                }}               
                navigation={navigation} // Pass navigation prop for handling navigation
                path = {CategoryDetail}
                marginHorizontal={index === 0 ? 0 : 10} // Conditional margin
                category={category.yogaFor}
              />
            ))}
            </ScrollView>
         
          </View>
          {showLocationModal && (
        <LocationModal
          visible={showLocationModal}
          toggleModal={closeModal}
          onSelectAddress={handleSelectAddress}
        />
      )}
        </View>
        <CustomAlertModal
        visible={isModalVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </ScrollView>
      
  );
};


const stylesc = StyleSheet.create({
  container: {
   marginHorizontal:20
  },
  textinput: {
    fontSize: 15,
    color: '#7A7D84',
    marginTop: 2,
    fontFamily: 'Poppins'
  },
  shadow: {
    shadowColor: '#1A1D17',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  close: {
    backgroundColor: '#1A1D17',
    borderRadius: 50,
    padding: 8,
    margin: 12
  },
  redContainer: {
    backgroundColor: COLORS.user_front_theme_color,
    width: windowWidth,
    height: windowHeight / 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    borderBottomColor: '#d6d5ff',
    borderBottomWidth: 1,
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight / 4,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 20,
  },
  smalltext: {
    color: 'grey',
    fontSize: 10,
    fontFamily: 'Poppins',
    // marginHorizontal:5,
    paddingRight:5
  },
  imageSliderContainer: {
    // flexDirection: 'row',
    // alignSelf: 'center',
    // marginVertical: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  bannerImage: {
    width: windowWidth - 30,
    height: 105,
    borderRadius: 12,
  },
  categoryContainer: {
  
  
  },
  cardContainer: {
    width : SCREEN_WIDTH/2.2,  
    borderRadius: 10,    
    height: SCREEN_HEIGHT/4, 
    marginBottom:10,  
    backgroundColor: '#FCFCFC',
    borderColor:COLORS.icon_background,
    borderWidth:1,      
  },
  imageContainer: {
    width: '100%',              // Container for the image
   
         // Space between image and text
  },
 
  categoryText: {
    fontSize: 15,  
    // marginHorizontal:5,
    // marginVertical :5,
    fontFamily:'Poppins'    // Bolder font for emphasis
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
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
  closeButton: {
    marginTop: 10,
    fontSize: 14,
    color: '#007BFF',
  },
  scrollContainer: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FCFCFC',
    borderColor:COLORS.icon_background,
    borderWidth:1,
    borderRadius: 10,
    marginHorizontal: 10,
    width: SCREEN_WIDTH/2.3
  },
  categoryImage: {
    width: 148, // Set width
    height: 95, // Set height
    margin:7,
    borderRadius:10,
    resizeMode:'cover'
  },
  cardImage: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardText: {
    fontSize: 15,
    fontFamily: 'Poppins',
  },
 
});

export default HomeScreen;



  {/* <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        swipeDirection={['down']}
        onSwipeComplete={toggleModal}
        style={stylesc.bottomModal}
      >
         <TouchableOpacity onPress={toggleModal} style={{alignItems:'center'
         }}>
         <Ionicons name="close" size={25} color="white" style={stylesc.close} />   
          </TouchableOpacity>
         
        <View style={stylesc.modalContent}>
          <Text style={[styles.text,{color:'#0F1012',marginBottom:0}]}>Select location</Text>
          <View style={[styles.inputContainer]}>
          <View style={[styles.input,stylesc.shadow, { flex: 1, flexDirection: 'row', backgroundColor: '#fff' }]}>
            <View style={{ marginRight: 10 }}>
              <Ionicons name="search" size={24} color="grey" />
            </View>
            <TextInput placeholder="Search for area, street name.." style={stylesc.textinput} />
          </View>
          </View>
          <Text style={stylesc.modalText}>Hello! This is a bottom sheet modal.</Text>
         
        </View>
      </Modal>
      */}

         {/* <View style={[styles.row, { justifyContent: 'space-evenly', marginTop: 10 }]}> */}
          {/* <Category text="Yoga Instructor" backgroundColor="#FEF3F2" color={'#D15E00'} borderColor={"#D15E00"} image={require('../assets/home_banner/home_icons/3.png')} marginVertical={12} />
          <Category text="Home Tutor" path="Index" navigation={navigation} backgroundColor="#EDFCF2" borderColor={"#1ED35A"} color={'#1ED35A'} image={require('../assets/home_banner/home_icons/2.png')} marginVertical={4} />
          <Category text="Yoga Therapist" path="TherapistScreen" navigation={navigation} backgroundColor="#F9F5FF" borderColor={"#3A44C9"} color={'#3A44C9'} image={require('../assets/home_banner/home_icons/4.png')} marginVertical={-1} />
          <Category text="Yoga Studios" backgroundColor="#FFE0DE" borderColor={"#FA0000"} color={'#FA0000'} image={require('../assets/home_banner/home_icons/1.png')} marginVertical={3} />
        </View> */}


          {/* {imagesToDisplay.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginLeft: -11, marginRight: -10 }}
        >
          {imagesToDisplay.map((banner, index) => (
            <Image
              key={index}
              source={banner.path ? { uri: banner.path } : banner} // Handle both API and local images
              style={[
                stylesc.bannerImage,
                index !== 0 && { marginLeft: 9 } // Add marginLeft to all images except the first one
              ]}
            />
          ))} */}
        {/* </ScrollView> */}
      {/* )} */}
    