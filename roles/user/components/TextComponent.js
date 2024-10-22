import React, { useState, useRef, createRef } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import OtpInput from '../components/Form/OtpInput';

const TextComponent = ({route }) => {
const { header, heading,content1,content2,lastupdate } = route.params;
  return (
    <View>
      <Header title={header} icon="chevron-left" />
      <View style={styles.content}>
      <Text style={styles.smalltext}>{lastupdate}</Text>
      <Text style={styles.text}>{content1}</Text>
        <Text style={styles.buttonText}>{heading}</Text>
        <Text style={styles.text}>{content2}</Text>
      </View> 
    </View>
  );
};

const styles = StyleSheet.create({
    
    content: {
        //   flex: 1,
      marginLeft: 20,
      marginRight: 20,
    },
    bottomSection: {
      justifyContent: 'flex-end',
      marginBottom: 36,
      marginLeft: 20,
      marginRight: 20,
    },
    text: {
      fontFamily: 'Poppins',
      fontSize: 15,
      marginBottom: 2,
      color: '#000',
    },
    smalltext: {
      fontFamily: 'Poppins-Medium',
      fontSize: 15,
      marginBottom: 10,
      color: '#ADACB7',
    },
    vsmalltext: {
      fontFamily: 'Poppins-Light',
      fontSize: 13,
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'center',
      color: '#6C7072',
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    highlight: {
      color: '#FC9D45', // Orange color
      fontFamily: 'Poppins-Light',
    },
    privacyContainer: {
      flex: 1,
    },
    buttonText: {
      fontSize: 17,
      color: "#FC9D45",
      fontFamily: 'Poppins-Medium',
    },
  });
  
  export default TextComponent;
  