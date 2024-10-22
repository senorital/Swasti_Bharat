import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import { COLORS } from '../constants';

const Button = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: 48,
        width: '100%',
      
        backgroundColor: COLORS.primary,
        // marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10
      }}>
      <Text style={{color: COLORS.white, fontFamily:'Poppins-Medium', fontSize: 16}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;