import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const ContentBox = ({ heading, contentText, Icon, sideIcon, path }) => {
  const navigation = useNavigation(); // Initialize navigation hook

  const onPressHandler = () => {
    // Navigate to the specified screen upon clicking
    navigation.navigate(path);
  };

  return (
    <TouchableOpacity onPress={onPressHandler} activeOpacity={0.8}>
      <View style={[styles.container1]}>
        <View>
          <Ionicons name={Icon} size={24} color="#F97216" />
        </View>
        <View style={[styles.column, { marginLeft: 30 }]}>
          <Text style={{ color: '#573353', fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: '500' }}>{heading}</Text>
          <Text style={{ color: '#D4CBD3', fontSize: 13, fontFamily: 'Poppins' }}>{contentText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContentBox;
