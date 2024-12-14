import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList,BackHandler, StyleSheet,ActivityIndicator,TouchableOpacity, ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from '../style';
import Cards from '../HomeTutor/Cards';
import SearchResult from '../Search/SearchResult';
import { Ionicons } from '@expo/vector-icons';
import HomeTutorSearch from '../Search/HomeTutorSearch';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeTutor, getHometutors } from '../../../../redux/actions/user/homeTutor/homeTutor';
import { COLORS} from '../../../../components/constants';
import {icons} from '../../../../components/constants';
import Header from '../../../../components/header/Header';


const CategoryDetail = ({ navigation,route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const userLocation = useSelector((state) => state.location.address);
  const [filteredData, setFilteredData] = useState([]);

  const {category} = route.params;
  useEffect(() => {
    const filters = route?.params?.filterParams || {}; // Get filters from route params or default to empty object
    if (userLocation) {
      const { latitude, longitude } = userLocation;
      const distance = 2000; // Example: 2000 meters
      const yogaFor = category;
      // Fetch tutors with filters and location data
      fetchTutors({ ...filters, latitude, longitude, distance,yogaFor });
    } else {
      console.warn('User location not available. Default filters applied.');
      // Call without location if not available
      fetchTutors(filters);
    }
  }, [route?.params?.filterParams, userLocation]);


  const fetchTutors = async (filters) => {

    try {
      setLoading(true);

      // Fetch data from the API
      const tutorsResponse = await dispatch(getHomeTutor(filters));

      if (tutorsResponse?.success && Array.isArray(tutorsResponse?.data)) {
        const tutorsData = tutorsResponse?.data;
        setData(tutorsData);
        setFilteredData(tutorsData);
      } else {
        console.error('Unexpected data format:', tutorsResponse);
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching tutors:', error.message);
      ToastAndroid.show('Failed to load tutors', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

   

  const handleFilterPress = () => {
    navigation.navigate(HomeTutorSearch);
  };

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

  const renderTutor = ({ item }) => (
    <Cards  tutor={item} 
    latitude={userLocation?.latitude} 
    longitude={userLocation?.longitude} 
    distance={2000}  />
  );



  return (
    <View style={{flex:1}}>
        <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />
        <View style={{ paddingTop: 20 }}>
        <Header title={category} icon={icons.back} />
      </View>
      <View style={[styles.container]}>
        <View style={[styles.inputContainer]}>
          <View style={[styles.input, { flex: 1, flexDirection: 'row', backgroundColor: '#fff' }]}>
            <View style={{ marginRight: 10 }}>
              <Ionicons name="search" size={20} color="grey" />
            </View>
            <TextInput placeholder="Search" style={{  fontSize: 15, // Adjust font size
      fontFamily:'Poppins',width:'100%' }} />
          </View>
          <View style={styles.filterIcon}>
            <Ionicons
              name="filter"
              size={24}
              color={COLORS.primary}
              onPress={handleFilterPress}
            />
          </View>
        </View>
      </View>
      {loading ? (
        <View style={stylesx.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : data.length === 0 ? ( // Check if data is empty
        // <View style={stylesx.noResultsContainer}>
        //   <Text style={stylesx.noResultsText}>No results found</Text>
        // </View>
        <View style={stylesx.noResultsContainer}>
        <View style={stylesx.imageContainer}>
          <Image style={{ width: 150, height: 150 }} source={icons.imagebg} />
          <Text style={stylesx.noResultsText}>No data found!</Text>
        </View>
      </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderTutor}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};


const stylesx = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 0.1,
      // paddingLeft: 10,
      marginTop: 50,
   paddingBottom: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
      marginLeft:20,
      marginBottom:20
  },
  title: {
      fontSize: 20,
      marginRight:20,
      fontFamily: 'Poppins-SemiBold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    fontFamily:'Poppins',
    textAlign: 'center',
  },
});

export default CategoryDetail;
