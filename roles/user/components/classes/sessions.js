import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, BackHandler, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMorningEveningTimeSlot } from '../../../../redux/actions/user/authActions';
import { StatusBar } from 'expo-status-bar';
import Header from '../../../../components/header/Header';
import { COLORS, icons } from '../../../../components/constants';
import { Feather } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Session = ({ route, navigation }) => {
  const { classType } = route.params; 
  const dispatch = useDispatch();
  const userLocation = useSelector((state) => state.location.address);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch time slots
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (userLocation?.latitude && userLocation?.longitude) {
        const queryParams = {
          date: new Date().toISOString().split('T')[0], // Today's date
          page: 1,
          limit: 1,
          distance: 20,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          isMorning: classType === 'Morning Classes' ? true : false, 
        };


        try {
          setLoading(true);
          const response = await dispatch(getMorningEveningTimeSlot(queryParams));
          if (response?.success && response?.data) {
            setTimeSlots(response.data);
          } else {
            console.error('Failed to fetch time slots:', response.message);
          }
        } catch (error) {
          console.error('Error fetching time slots:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTimeSlots();
  }, [userLocation, classType, dispatch]);

  // Back handler
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

  const renderItem = ({ item }) => (
    <View style={{ flex: 1 }}>
      <View key={item.id} style={styles.cardContainer}>
        <View style={styles.leftContainer}>
          <View style={{ flexDirection: 'row' }}>
          <Ionicons name={classType === 'Morning Classes' ? 'sunny' : 'moon'}  size={24} color={classType === 'Morning Classes' ? 'orange' : 'orange'} style={{ marginRight: 8  }}
/>
            <Text style={styles.historyText}>{item.serviceType}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Feather name="clock" size={15} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.timeText}>
              {`${item.time} - ${
                new Date(
                  new Date().setHours(
                    parseInt(item.time.split(':')[0]),
                    parseInt(item.time.split(':')[1]) + item.timeDurationInMin
                  )
                )
                  .toTimeString()
                  .slice(0, 5)
              } (${item.timeDurationInMin} min)`}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={styles.avatarsContainer}></View>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // Show loading or error state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />
      <View style={{ paddingTop: 20 }}>
        <Header title={`${classType}`} icon={icons.back} />
      </View>
      <FlatList
        data={timeSlots}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../../assets/imagebg.png')} // Your "no data" image
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No data found</Text>
          </View>
        }
      />
    </View>
  );
};

export default Session;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.icon_background,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
  },
  leftContainer: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  historyText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  timeText: {
    color: '#000',
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Light',
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  startButtonText: {
    fontWeight: '400',
    color: '#fff',
    fontFamily: 'Poppins',
  },
  emptyContainer: {
    flex: 1,
    marginTop:100,
    justifyContent: 'center',  // Centers vertically
    alignItems: 'center',      // Centers horizontally
    padding: 100,               // Add padding if needed

  },
  emptyImage: {
    width: 120,
    height: 120,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: 'Poppins',
  },
});
