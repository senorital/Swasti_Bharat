import React, { useState } from "react";
import { View, TextInput, Image,StyleSheet, TouchableOpacity, ScrollView, Text,Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../components/constants";
const Searchbar = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const navigation = useNavigation();

  // Log categories prop to verify it's passed correctly
  console.log("Categories: ", categories);

  // Handle search input change
  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (query) {
      const filtered = categories.filter((category) =>
        category.yogaFor?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
      // console.log("Filtered Categories After Update: ", filtered); // Log filtered results
    } else {
      setFilteredCategories([]);
      console.log("No search query entered."); // Log when the input is empty
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    console.log("Selected Category: ", category); // Log the selected category
    navigation.navigate('CategoryDetail', { category: category.yogaFor });
    setSearchQuery(''); // Reset search query after selection
    setFilteredCategories([]); // Clear filtered categories
  };

  return (
    <View style={styles.searchBox}>
     <View
  style={{
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Adjust spacing if needed
      paddingHorizontal: 5, // Add padding around the items
    // height: 30, // Ensures consistent height for alignment
  }}
>
  {/* <Image
    source={require('../../../../assets/icons/search.png')}
    style={{
      width: 18, // Adjust the size of the icon
      height: 18,
      marginRight: 10, // Add space between the icon and TextInput
      marginBottom:2
    }}
  /> */}
    <Ionicons name="search" size={20} color="grey" style={styles.icon}/>
  <TextInput
    placeholder="Search"
    value={searchQuery}
    onChangeText={handleSearchChange}
    style={{
      flex: 1, // Allows TextInput to take available space
      fontSize: 15, // Adjust font size
      fontFamily:'Poppins'
    }}
    selectionColor={COLORS.primary}
  />
</View>

      {/* Display filtered category list using ScrollView */}
      {filteredCategories.length > 0 && (
        <View style={styles.dropdownContainer}>
          <ScrollView>
            {filteredCategories.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleCategorySelect(item)}>
                <Text style={[styles.categoryItem,{textAlign:'left'}]}>{item.yogaFor}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {filteredCategories.length === 0 && searchQuery.length > 0 && (
        <Text style={styles.categoryItem}>No related searches found</Text>
      )}
    </View>
  );
};


export const styles = StyleSheet.create({
  icon :{
  marginRight:8,
  marginBottom:2
  },
    searchBox: {
    width: ITEM_WIDTH,
    padding: 8,
    borderColor:COLORS.icon_background,
    borderWidth:1,
    backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // elevation: 5,
    marginVertical: 5,
    // alignContent:'center',
    // alignItems:'center'
  },
  searchIcon: {
    width: 18,
    height: 18,
    justifyContent:'center',
    alignItems:'center',
    marginRight: 10,
    // tintColor: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily:'Poppins'
  
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 50,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // paddingHorizontal: 5,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign:'auto',
    fontFamily:'Poppins',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
});

export default Searchbar;
