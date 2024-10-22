import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Pressable, StyleSheet,ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../Header';
import ImageCard from '../ImageCard';
import { styles } from '../style';
import { Ionicons } from '@expo/vector-icons';
import { windowWidth } from '../../utils/Dimensions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextContent from '../TextContent';
import ReviewsPage from '../Reviews';
import Button from '../Form/Button';
import MapView, { Marker } from 'react-native-maps';

const Work = ({ icon, title, text }) => {
  return (
    <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialCommunityIcons name={icon} size={24} color="#FC9D45" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.smalltext}>{title}</Text>
          <Text style={[styles.medtext, { fontSize: 15, marginTop: 0, marginBottom: 0 }]}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const CategoryDetail = ({ navigation }) => {
  const [markerCoord, setMarkerCoord] = useState({
    latitude: 28.704060,
    longitude: 77.102493,
  });

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoord({ latitude, longitude });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Ear, Nose & Throat" icon="chevron-left" />
      <ScrollView contentContainerStyle={styles.container}>
        <ImageCard title="Dr. Stone Gaze" subtitle="Ear, Nose & Throat specialist" image={require('../../assets/therapist/doctor.png')} onPress={() => handleCardPress('CategoryDetail')} text={'IDR. 120.000'} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Work icon={'yoga'} title="Hospital" text="RS. Hermina" />
          <View style={{ borderLeftWidth: 1, borderLeftColor: '#F3F4F6', height: '100%' }} />
          <Work icon={'clock'} title="Working Hour" text="07.00 - 18.00" />
        </View>
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 5 }} />
        <TextContent heading='Biography' text='Dr. Patricia Ahoy specialist in Ear, Nose & Throat, and work in RS. Hermina Malang. It is a long established fact that a reader will be distracted by the readable content.' />
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 5 }} />
        <TextContent heading='Work Location' text='Jl. Tangkuban Perahu No.31-33, Kauman, Kec. Klojen, Kota Malang, Jawa Timur 65119' />
        <View style={{ height: 200, marginVertical: 10 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: markerCoord.latitude,
              longitude: markerCoord.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}>
            <Marker coordinate={markerCoord} title="Work Location" description="RS. Hermina Malang" />
          </MapView>
        </View>
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 5 }} />
        <Text style={styles.medtext}>Rating (72)</Text>
        <ReviewsPage />
      </ScrollView>
      <Pressable style={stylesdetail.appButtonContainer} onPress={() => navigation.navigate('BookAppointment')}>
        <Button text="Make Appointment" />
      </Pressable>
    </View>
  );
};

const stylesdetail = StyleSheet.create({
  appButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  }
});

export default CategoryDetail;
