import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const FormButton = ({width,height,fontSize,buttonTitle, ...rest}) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer,{height:height,width:width}]} {...rest}>
      <Text style={[styles.buttonText,{fontSize:fontSize}]}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    borderColor:'#FDA758',
    borderWidth:1,
    backgroundColor: '#FDA758',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom:5
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});