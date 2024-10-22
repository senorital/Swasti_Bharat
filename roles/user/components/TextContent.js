import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './style';

const TextContent = ({heading,text}) => {

 return (
 <View>
 <Text style={styles.medtext}>{heading}</Text>
 <Text style={styles.descstyle}>{text}</Text>
 </View>
 );  
};

export default TextContent;