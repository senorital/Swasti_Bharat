import React, { useState, useEffect, useRef } from 'react';
import { View,TextInput, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity,Text, ScrollView } from 'react-native';
const { width } = Dimensions.get('window');
import { styles } from '../style';
import Header from '../Header';
import { Card } from '../Card';
import { Ionicons } from '@expo/vector-icons';
import BatchCard from '../BatchCard';
const Batches = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tabs, setTabs] = useState(['Trending', 'Online', 'Offline']); // Add your tab names here

  const handleTabPress = (index) => {
    setCurrentIndex(index);
  };

  return (
    <View style={styles.mainContainer}>
     <View style={styles.container}>
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
              
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 ,zIndex:1}}>
        <TouchableOpacity style={styles.batchbtn}>
        <Image
            source={require('../../assets/sort.png')}
            style={{width:20,height:20,marginRight:10}}
          />
          <Text style={{fontFamily:'Poppins-Medium'}}>Filter</Text> 
        </TouchableOpacity>    
        {tabs.map((tab, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.bactButton, index === currentIndex && styles.activebactButton]} 
            onPress={() => handleTabPress(index)}
          >
            <Text style={[styles.bactButtonText, index === currentIndex && styles.activebactButtonText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
      
       <BatchCard/>
       <BatchCard/> 
        
      </View>
      </View>
    </View>

  );
};

export default Batches;
