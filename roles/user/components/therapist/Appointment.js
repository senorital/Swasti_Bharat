import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../Header';
import ImageCard from '../ImageCard';
import { styles } from '../style';
import { Ionicons } from '@expo/vector-icons';
import CategoryDetail from './CategoryDetail';



const Appointment = ({navigation}) => {

    const handleCardPress = (screenName) => {
        // Navigate to the specified screen when ImageCard is pressed
        navigation.navigate(screenName);
    };

    const screenConfigs = {
        Appointment: { showArrowIcon: true , text : null }, // Default configuration for Appointment screen
        CategoryDetail: { showArrowIcon: false }, // Configuration for CategoryDetail screen
        // Add configurations for other screens if needed
      };    

    return (
        <View style={styles.mainContainer}>
            <Header title="Book an Appointment" icon="chevron-left" />
            <View style={styles.container}>
                <Text style={[styles.medtext, { marginTop: 10, marginBottom: 0 }]}>Medical Specialties</Text>
                <Text style={[styles.navButtonText, { fontFamily: 'Poppins-Light', marginTop: 0 }]}>Wide selection of doctor's specialties</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <View style={{ marginRight: 10 }}>
                            <Ionicons name="search" size={24} color="#6C737F" />
                        </View>
                        <TextInput placeholder="Search Here" style={{ fontSize: 15, flex: 1, fontFamily: 'Poppins' }} />
                    </View>
                    <View style={styles.filterIcon}>
                        <Ionicons name="filter" size={24} color="#FC9D45" />
                    </View>
                </View>
                <ImageCard title="Ear, Nose & Throat" subtitle="Wide selection of doctor's specialties" image={require('../../assets/therapist/ear.png')} path = {CategoryDetail}  screenConfig={screenConfigs.Appointment} text={null} navigation={navigation}/>
                <ImageCard title="Psychiatrist" subtitle="Wide selection of doctor's specialties" image={require('../../assets/therapist/ear.png')}  path = 'EarNoseThroatScreen' screenConfig={screenConfigs.Appointment}  />
                <ImageCard title="Psychiatrist" subtitle="Wide selection of doctor's specialties" image={require('../../assets/therapist/ear.png')} />
                <ImageCard title="Psychiatrist" subtitle="Wide selection of doctor's specialties" image={require('../../assets/therapist/ear.png')} />
            </View>
        </View>
    );
};



export default Appointment;
