import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './style';
const Card = () => {
  return (
    <View style={{marginTop:10, padding: 10,marginRight:19, backgroundColor: '#fff', borderRadius: 10, elevation: 3}}>
      <Image
        source={require('../assets/batch.png')} // Update with your image path
        style={{ width: '100%', height: 200, borderRadius: 10 }}
      />
      <View style={{padding: 10}}>
      <View style={{flexDirection: 'row',justifyContent:'space-evenly'}}>
            <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: 'gray', marginHorizontal: 2,marginVertical:4}} />       
            <Text style={{fontSize: 12, fontWeight: 'bold',marginRight:9}}>Recorded Lectures</Text>
            <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: 'gray', marginHorizontal: 2,marginVertical:4}} />
            <Text style={{fontSize: 12, fontWeight: 'bold',marginRight:9}}>Year Long Batch</Text>
           
          </View>
        <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
          <TouchableOpacity style={styles.buttonContainer}>
           <Text style={styles.buttonText}>Explore Now</Text> 
          </TouchableOpacity>
         
          <TouchableOpacity style={{marginTop:15,marginRight:-10}}>
          <Ionicons name="logo-whatsapp" size={24} color="green" />
          </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

export default Card;
