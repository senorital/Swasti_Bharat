import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  FlatList,
  BackHandler,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../../../../components/header/Header';
import { getHomeTutorById } from '../../../../redux/actions/user/homeTutor/homeTutor';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { windowHeight, windowWidth } from '../../../../utils/Dimensions';
import { COLORS } from '../../../../components/constants';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/Form/Button';

const ShowInstructorForUser = ({ navigation, route }) => {
  const { homeTutorId, latitude, longitude, distance } = route.params;
  const dispatch = useDispatch();
  const [numColumns, setNumColumns] = useState(2); // Initial number of columns

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const banner = [
    { id: 1, image: require('../../../../assets/get-screen/w1.png') },
    { id: 2, image: require('../../../../assets/get-screen/w2.png') },
    { id: 3, image: require('../../../../assets/get-screen/w3.png') },
  ];

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params = { latitude, longitude, distance, homeTutorId };
        const res = await dispatch(getHomeTutorById(params));

        if (res?.success) {
          const tutorData = res?.data;
          tutorData.yogaFor = JSON.parse(tutorData.yogaFor || '[]');
          tutorData.language = JSON.parse(tutorData.language || '[]');
          tutorData.specialization = JSON.parse(tutorData.specialization || '[]');
          setData(tutorData);
          setImages(tutorData.images || []);
        } else {
          console.error('No data found');
          Alert.alert('No data found', 'Could not find any data for this tutor.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude && distance && homeTutorId) {
      fetchData();
    } else {
      console.warn('Missing required parameters for fetching data');
    }
  }, [latitude, longitude, distance, homeTutorId]);

  const handleBookButtonPress = () => {
    if (data) {
      navigation.navigate('BookAppointment', {
        homeTutorId: homeTutorId,
        firstImage: images.length > 0 ? images[0].path : banner[0].image,
        yogaFor: data.yogaFor,
        languages: data.language,
      });
    } else {
      Alert.alert('Error', 'No data available to navigate.');
    }
  };

  const renderApiImageItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item.path)}>
      <Image source={{ uri: item.path }} style={styles.carouselImage} />
    </TouchableOpacity>
  );

  const renderBannerItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item.image)}>
      <Image source={item.image} style={styles.carouselImage} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data found for this tutor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{paddingTop:20}}>
      <Header title={data.homeTutorName} icon={require("../../../../assets/back.png")} />
      </View>
      <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.bannerContainer}>
          <FlatList
            data={images.length > 0 ? images : banner}
            renderItem={images.length > 0 ? renderApiImageItem : renderBannerItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* Conditionally render Bio section */}
        {data.instructors && (
          <View style={styles.section}>
            <Text style={styles.heading}>Total Experience</Text>
            <Text style={[styles.itemText,{width:'30%',textAlign:'center'}]}>{data.instructors.totalExperienceInYears} Years</Text>
          </View>
        )}
        {(data.isGroupSO || data.isPrivateSO) && (
  <View style={styles.section}>
    <Text style={styles.heading}>Service Type</Text>
    <Text style={[styles.itemText,{width:'30%',textAlign:'center'}]}>
      {data.isGroupSO && "Group"}
      {data.isGroupSO && data.isPrivateSO && " and "}
      {data.isPrivateSO && "Private"}
    </Text>
  </View>
)}       

{data.hTPrices && data.hTPrices.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.heading}>Package Prices</Text>
    {data.hTPrices.map((price, index) => (
      <View key={price.id} style={styles.priceContainer}>
        <Text style={styles.itemText}>
           {price.durationType} ({price.priceName})
        </Text>
        {price.private_PricePerDayPerRerson && (
          <Text style={styles.itemText}>
            Private Price Per Day Per Person: ₹{price.private_PricePerDayPerRerson}
          </Text>
        )}
        {price.group_PricePerDayPerRerson && (
          <Text style={styles.itemText}>
            Group Price Per Day Per Person: ₹{price.group_PricePerDayPerRerson}
          </Text>
        )}
        {price.private_totalPricePerPerson && (
          <Text style={styles.itemText}>
            Private Total Price Per Person: ₹{price.private_totalPricePerPerson}
          </Text>
        )}
        {price.group_totalPricePerPerson && (
          <Text style={styles.itemText}>
            Group Total Price Per Person: ₹{price.group_totalPricePerPerson}
          </Text>
        )}
      </View>
    ))}
  </View>
)}


      {data.experiences && data.experiences.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.heading}>Experience</Text>
    {data.experiences.map((exp, index) => (
      <View key={exp.id} style={styles.experienceContainer}>
        <Text style={styles.text}>
          {exp.role}
        
          {exp.joinDate !== "0000-00-00" ? ` ,  ${exp.joinDate}` : ""}
        </Text>
        <Text style={styles.text}>{exp.workHistory ? `${exp.workHistory}` : ""}</Text>
      </View>
    ))}
  </View>
)}

       

        {/* Conditionally render Languages section */}
        {data.language.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Languages</Text>
            <FlatList
              data={data.language}
              renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          </View>
        )}

        {/* Conditionally render Specialization section */}
        {data.specialization.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Specialization</Text>
            <FlatList
              data={data.specialization}
              renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          </View>
        )}

       
        {/* Conditionally render Giving Yoga Sessions For section */}
        {data.yogaFor.length > 0 && (
  <View style={[styles.section]}>
    <Text style={styles.heading}>Giving Yoga Sessions for</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      {data.yogaFor.map((item, index) => (
      
          <Text style={styles.itemText}>{item}</Text>
      
      ))}
    </ScrollView>
  </View>
)}

{data.serviceAreas.length > 0 && (
  <View style={[styles.section,{marginBottom:100}]}>
    <Text style={styles.heading}>Service Locations</Text>
   
      {data.serviceAreas.map((item, index) => (
       <View key={index} style={styles.row}>
       <View style={styles.column}>
         <Ionicons name="location-sharp" color={COLORS.primary} size={15} style={styles.icon} />
         <Text style={styles.columnValue}>{item.locationName}</Text>
       </View>
       </View>
      ))}
  </View>
)}


      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
            <MaterialCommunityIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>

      <View style={styles.fixedButtonsContainer}>
        <Button title="Book Session" onPress={handleBookButtonPress} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  icon: {
    marginRight: 5,
  },
  columnText: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  columnValue: {
    color: '#555',
    fontFamily:'Poppins',
    fontSize:13
  },
  locationContainer: {
    marginRight: 20,
    alignItems: 'center',
    flexDirection:'row'
  },
  locationName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily:'Poppins'
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: windowHeight / 50,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {},
  carouselImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical:5,
  },
  section: {
    marginVertical:5,
    borderRadius:8,
    padding:12,
    backgroundColor:COLORS.white
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  modalImage: {
    width: windowWidth - 40,
    height: windowHeight - 100,
    resizeMode: 'contain',
  },
  heading: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    // padding:5,
    // borderRadius:5,
    marginVertical: 5,
    // backgroundColor: COLORS.notifyicon
  },
   experienceContainer: {
    marginBottom: 10,
    padding:8,
    backgroundColor: '#eeedfc',
    borderRadius:10,
  },

  text: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 24,
  },
  itemText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    backgroundColor: '#eeedfc',
    borderRadius: 10,
    padding: 8,
    marginVertical:5,
    marginRight: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  selectedTab: {
    backgroundColor: '#5F33E1',
  },
  tabText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#000',
  },
  selectedTabText: {
    color: '#fff',
  },
  fixedButtonsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    // marginLeft: 12,
    // marginRight: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});

export default ShowInstructorForUser  ;
