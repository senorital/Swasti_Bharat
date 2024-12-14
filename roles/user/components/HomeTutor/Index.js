import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet, TouchableOpacity, BackHandler, ToastAndroid } from 'react-native';
import Cards from './Cards';
import Toast from 'react-native-toast-message';
import { styles } from '../style';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeTutor } from '../../../../redux/actions/user/homeTutor/homeTutor';
import { COLORS } from '../../../../components/constants';

const Index = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userLocation = useSelector((state) => state.location.address); // Assuming this is where the location data is stored
 

  const handleFilterPress = () => {
    navigation.navigate('HomeTutorSearch', {
      onApplyFilters: (filters) => {
        fetchTutors(filters); // Pass the filters to fetchTutors
        navigation.goBack(); // Optionally navigate back after applying filters
      }
    });
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

  // Function to fetch tutors
  const fetchTutors = useCallback(async (filters) => {

    try {
      setLoading(true);
      const tutorsResponse = await dispatch(getHomeTutor(filters));
      if (tutorsResponse?.success && Array.isArray(tutorsResponse?.data)) {
        const tutorsData = tutorsResponse.data;
        setData(tutorsData);
        setFilteredData(tutorsData);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching tutors:', error.message);
      ToastAndroid.show('Failed to load tutors', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    const filters = route?.params?.filterParams || {};
    if (userLocation) {
      const { latitude, longitude } = userLocation;
      fetchTutors({ ...filters, latitude, longitude, distance: 20 });
    } else {
      fetchTutors(filters);
    }
  }, [route?.params?.filterParams, userLocation, fetchTutors]);


  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = data.filter((tutor) => {
      const name = tutor?.homeTutorName?.toLowerCase() || '';
      return name.includes(query.toLowerCase());
    });
    setFilteredData(filtered);
  };

  // Render tutor card
  const renderTutor = ({ item }) => <Cards 
  tutor={item} 
  latitude={userLocation?.latitude} 
  longitude={userLocation?.longitude} 
  distance={2000} 
/>;

  const CustomHeader = ({ title, subtitle, icon }) => {
    const handleGoBack = () => {
      navigation.navigate('HomeScreen');
    };
    return (
      <View>
        <View style={stylesx.header}>
          <TouchableOpacity onPress={handleGoBack} style={{ marginTop: 0 }}>
            <Image source={icon} style={stylesx.back} />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={stylesx.title}>{title}</Text>
            <Text style={styles.vsmalltext}>{subtitle}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex:1}}>
      <CustomHeader
        title="Explore Home Tutor"
        subtitle="Wide range of yoga experts"
        icon={require('../../../../assets/back.png')}
      />
      <View style={[styles.container]}>
        <View style={[styles.inputContainer]}>
          <View style={[styles.input, { flex: 1, flexDirection: 'row', backgroundColor: '#fff' }]}>
            <View style={{ marginRight: 10 }}>
              <Ionicons name="search" size={20} color="grey" />
            </View>
            <TextInput
              placeholder="Search by name "
              style={{ fontSize: 14, fontFamily: 'Poppins', width: '100%' }}
              value={searchQuery}
              onChangeText={handleSearch}
            />
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
          {[1, 2, 3].map((item) => (
            <ShimmerPlaceholder
              key={item}
              style={{ width: '90%', height: 150, marginVertical: 10, borderRadius: 10,marginHorizontal:20 }}
              shimmerColors={['#f6f7f8', '#eaeaea', '#f6f7f8']}
            />
          ))}
        </View>
      ) : filteredData.length === 0 ? (
        <View style={stylesx.noResultsContainer}>
          <Text style={stylesx.noResultsText}>No results found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderTutor}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Index;

const stylesx = StyleSheet.create({
  header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      marginTop: 50,
      paddingBottom: 10
  },
  loadingContainer: {
    flex: 1,
  },
  backBtn: {
      marginLeft: 20,
      marginBottom: 20
  },
  title: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
  },
  back: {
    width: 20,
    height: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
});
