import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../style';
import { Ionicons } from '@expo/vector-icons';

const Filter = () => {
  
  const [activeCategory, setActiveCategory] = useState(null); // State to track active category
  const [activeRating, setActiveRating] = useState(null); // State to track active rating

  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"]; // Array of categories
  const ratings = [5, 4, 3, 2]; // Array of ratings

  const toggleCategory = (index) => {
    setActiveCategory(index === activeCategory ? null : index); // Toggle active category
  };

  const toggleRating = (index) => {
    setActiveRating(index === activeRating ? null : index); // Toggle active rating
  };

  return (
    <View style={{marginLeft:5,marginRight:5}}>
      <Text style={[styles.settingstext, { }]}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingRight: 16,marginBottom:12 }}>
        {categories.map((category, index) => (
          <TouchableOpacity 
            key={index} 
            style={[stylesf.tab, activeCategory === index && stylesf.activeTab ]} 
            onPress={() => toggleCategory(index)}>
            <Text style={[stylesf.tabText, activeCategory === index && stylesf.activeTabText]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
     
      <Text style={[styles.settingstext, { }]}>Rating</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingRight: 16 }}>
        {ratings.map((rating, index) => (
          <TouchableOpacity 
            key={index} 
            style={[stylesf.tab, activeRating === index && stylesf.activeTab ]} 
            onPress={() => toggleRating(index)}>
            <Text style={[stylesf.tabText, activeRating === index && stylesf.activeTabText]}><Ionicons name="star" size={15} color="#F97419" /> {rating}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:20,}}>
      <TouchableOpacity style={[stylesf.filterbtn,{backgroundColor:'#EBEBEB',borderColor:'#EBEBEB',borderWidth:2}]}>
          <Text  style={[stylesf.btn,{color:'#000'}]}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[stylesf.filterbtn,{borderColor:'#FC9D45',borderWidth:2}]}>
          <Text style={[stylesf.btn]}>Filter</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default Filter;

const stylesf = StyleSheet.create({
  filterbtn: {
    backgroundColor: '#FC9D45',
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignItems: 'center',
    color: '#fff',
    width: 120,
    textAlign: 'center',
    borderRadius: 5
  },
  btn: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#fff'
  },
  tab: {
    borderRadius: 5,
    backgroundColor: '#eee',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#FC9D45',
  },
  tabText: {
    color: '#000', // Default text color
    fontFamily: 'Poppins',
    fontSize: 12,
  },
  activeTabText: {
    color: '#fff', // Active text color
  },
});
