import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FormInput from '../components/Form/FormInput';
import { windowHeight } from '../utils/Dimensions';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { connect } from 'react-redux'; // Assuming the useDispatch and useSelector aren't used
import { TextInput } from 'react-native-gesture-handler';



const searchbar = () => {
    return (
    <View style={styles.container}>
    </View>
    );
};