import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, BackHandler,TouchableOpacity, ActivityIndicator, Dimensions, useWindowDimensions } from 'react-native';
import { Avatar } from "react-native-elements";
import { windowHeight, windowWidth } from '../../../utils/Dimensions';
import { styles } from '../components/style';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
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

const YogaCard = ({ text1, text2, image, navigation,path,category })=> {
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
    <TouchableOpacity onPress={handlePress} style={[stylesc.cardContainer,{marginHorizontal:5}]}>
    <View style={[stylesc.imageContainer]}>
    <Image source={image} style={stylesc.categoryImage} />
    </View>
    <View style={{padding:10}}>
    <Text style={[stylesc.categoryText]}>{text1}</Text>
    <Text style={[stylesc.smalltext]}>{text2}</Text>
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
const Card = ({ image, title, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card, { marginHorizontal: 0 }]}>
        <Image 
          source={image} 
          style={styles.cardImage} 
        />
        <View style={{ padding: 10 }}>
          <Text style={styles.cardText}>{title}</Text>
          <Text style={styles.smalltext}>{description}</Text>
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
      // console.log("Location:", location); // Log the entire location object
      // console.log("Latitude:", location.coords.latitude); // Log the latitude
      // console.log("Longitude:", location.coords.longitude); // Log the longitude
      setLocation(location);
  
      // Reverse geocode the location to get the address
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      // console.log("Geocode:", geocode); // Log the geocode result
      setAddress(geocode[0]);
      
    } catch (error) {
      setErrorMsg("Error fetching location");
      console.error(error); // Log the error
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
      console.log("Yoga Category: " + JSON.stringify(yogaRes.data));
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

 

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const imageUrl = userRole && userRole.profilePic && userRole.profilePic.path
  ? { uri: userRole.profilePic.path }
  : require("../../../assets/dAvatar.jpg");

console.log(userRole?.profilePic?.path);

  return (
    <ScrollView style={{marginTop:30}} >
      <StatusBar style="light" backgroundColor={COLORS.user_front_theme_color} />
        <View style={stylesc.redContainer} />
    
      <View style={styles.content}>
      

        <View style={styles.topBar}>
          <Text>
        {userRole && (
            <Text style={{ fontFamily: "Poppins-SemiBold",fontSize:20 }}>
            {/* { console.log("user.data.name :" + user.name)} */}
            Hi,&nbsp;
            
             {userRole.name}


           </Text>
         )}
          &nbsp;
       </Text>    
           
       <TouchableOpacity onPress={() => navigation.navigate('MainProfile')}>
       <Avatar
    rounded
    source={imageUrl}
    containerStyle={{ borderColor: 'white', borderWidth: 2 }}
    size={50}
  />
   </TouchableOpacity>
        </View>

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
          <View style={{ flexDirection: 'row', marginTop: -10 }}>
            <Text style={[styles.greetingText, { color: '#000', fontSize: 12, marginRight: 5, fontFamily: 'Poppins' }]}>
              {address.name ? address.name + ", " : ""}
              {address.street ? address.street + ", " : ""}
              {address.city ? address.city + ", " : ""}
              {address.region ? address.region + ", " : ""}
              {address.postalCode ? address.postalCode : ""}
            </Text>
            <AntDesign name="caretdown" size={13} color="black" onPress={toggleModal} /> 
          </View>
        ) : null}
        <Text style={[styles.additionalText, { color: '#210d68', marginTop: 15 }]}>Find the best Yoga Instructors and Trainers</Text>
        <Searchbar categories={yogaCategoriesData} />
        </View>
      
      <View style={stylesc.container}>
      <ImageSlider />
    
     <View style={{ flexDirection: 'row'}}>
            <YogaCard 
              text1="Morning Classes" 
              marginHorizontal={0}
              image={require('../../../assets/get-screen/tutor3.jpg')} 
              navigation={navigation} 
              // text2 = "4:00-10:00 AM"
              path = {"Class"}
            />
            <YogaCard 
              text1="Evening Classes" 
              path={"Class"}   
              marginHorizontal={10}            
              image={require('../../../assets/get-screen/tutor3.jpg')} 
              navigation={navigation} 
              // text2="1:00-7:00 PM"
            />
         
          </View>
      
         
 
        <Text style={[styles.text, { fontFamily: 'Poppins-Medium',marginTop:10,marginBottom:10 }]}>Explore Categories</Text>
        <View style={{flexDirection:'row'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>    
            {yogaCategoriesData.map((category, index) => (
              <YogaCard 
                key={index} // Unique key for each card
                text1={category.yogaFor} // Pass category name as text1
                text2={category.description || 'Every Day'} // Pass description or fallback text
                image={{ uri: category.path }} // Pass image URI
                navigation={navigation} // Pass navigation prop for handling navigation
                path = {"CategoryDetail"}
                category={category.yogaFor}
              />
            ))}
            </ScrollView>
         
          </View>
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
    height: windowHeight / 3.2,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
    marginHorizontal:5,
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
    width : 155,  
    borderRadius: 10,       
    backgroundColor:COLORS.white       
  },
  imageContainer: {
    width: '100%',              // Container for the image
    height: 100,
    
    marginBottom: 10,       // Space between image and text
  },
 
  categoryText: {
    fontSize: 14,  
    marginHorizontal:5,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    width: 140,
  },
  categoryImage: {
    width: 130, // Set width
    height: 100, // Set height
    margin:12,
    borderRadius:10,
    resizeMode:'cover'
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
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
    