import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../Header';
import { getHomeTutorById } from '../../../../redux/actions/user/homeTutor/homeTutor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { windowHeight, windowWidth } from '../../../../utils/Dimensions';
import { COLORS } from '../../../../components/constants';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/Form/Button';
const ShowInstructorForUser = ({ navigation, route }) => {
  const { homeTutorId } = route.params;
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const banner = [
    { id: 1, image: require('../../../../assets/get-screen/w1.png') },
    { id: 2, image: require('../../../../assets/get-screen/w2.png') },
    { id: 3, image: require('../../../../assets/get-screen/w3.png') },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(getHomeTutorById(homeTutorId));
        if (res && res.success && res.data) {
          const tutorData = res.data;
          tutorData.yogaFor = JSON.parse(tutorData.yogaFor || '[]');
          tutorData.language = JSON.parse(tutorData.language || '[]');
          tutorData.specilization = JSON.parse(tutorData.specilization || '[]');
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

    fetchData();
  }, [dispatch, homeTutorId]);

 
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
    <Image source={{ uri: item.path }} style={styles.carouselImage} />
  );

  const renderBannerItem = ({ item }) => (
    <Image source={item.image} style={styles.carouselImage} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      <Header title={data.homeTutorName} icon={'chevron-left'} />
      <StatusBar backgroundColor={COLORS.primary} style="light" />

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
        <View style={styles.section}>
          <Text style={styles.heading}>Bio</Text>
          <Text style={styles.text}>{data.instructorBio}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Languages</Text>
          <FlatList
            data={data.language}
            renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Specialisation</Text>
          <FlatList
            data={data.specilization}
            renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Session Offered</Text>
          {data.privateSessionPrice_Day && (
            <Text style={styles.itemText}>{`Individual Class (Day) - ₹ ${data.privateSessionPrice_Day}`}</Text>
          )}
          {data.privateSessionPrice_Month && (
            <Text style={styles.itemText}>{`Individual Class (Month) - ₹ ${data.privateSessionPrice_Month}`}</Text>
          )}
          {data.groupSessionPrice_Day && (
            <Text style={styles.itemText}>{`Group Class (Day) - ₹ ${data.groupSessionPrice_Day}`}</Text>
          )}
          {data.groupSessionPrice_Month && (
            <Text style={styles.itemText}>{`Group Class (Month) - ₹ ${data.groupSessionPrice_Month}`}</Text>
          )}
        </View>
        <View style={[styles.section, { paddingBottom: windowHeight / 10 }]}>
          <Text style={styles.heading}>Giving Yoga Sessions for</Text>
          <FlatList
            data={data.yogaFor}
            renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </View>
      </ScrollView>
      <View style={styles.fixedButtonsContainer}>
        {/* <TouchableOpacity style={styles.button} onPress={handleBookButtonPress}>
          <Text style={styles.buttonText}> Book</Text>
        </TouchableOpacity> */}
        <Button title="Book Session" onPress={handleBookButtonPress}/>
        {/* <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={() => console.log('Chat button pressed')}>
          <MaterialCommunityIcons name="chat" size={24} color="white" />
          <Text style={styles.buttonText}> Chat</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  section: {
    marginBottom: 5,
  },
  heading: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    padding:5,
    borderRadius:5,
    marginVertical: 20,
    // backgroundColor: COLORS.notifyicon
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
    padding: 12,
    marginBottom: 8,
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
    marginLeft: 12,
    marginRight: 12,
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
