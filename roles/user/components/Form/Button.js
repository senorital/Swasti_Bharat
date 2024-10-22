import React, { useState } from 'react';
import { View, Text, StyleSheet,Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../style';
import { COLORS } from '../../../../components/constants';
const Button = ({title, onPress = () => {}}) => {
 return (
    <Pressable onPress={onPress} style={styles.appButtonContainer} >
  <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.appButton}>
   
      <Text style={styles.appButtonText}>{title}</Text>
    
  </LinearGradient>
</Pressable>
 );   
};

export default Button;