import React, { useState } from "react";
import { View, TextInput, Image,StyleSheet, TouchableOpacity, ScrollView, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Image
          source={require('../../../../assets/icons/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
        />
      </View>

      {/* Display filtered category list using ScrollView */}
      {filteredCategories.length > 0 && (
        <View style={styles.dropdownContainer}>
          <ScrollView>
            {filteredCategories.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleCategorySelect(item)}>
                <Text style={styles.categoryItem}>{item.yogaFor}</Text>
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
  searchBox: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // elevation: 5,
    marginVertical: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily:'Poppins'
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    // borderColor: '#ccc',
    // borderWidth: 1,
    // borderRadius: 8,
    // backgroundColor: '#f5f5f5',
    // color: '#333',
    // elevation: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily:'Poppins',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default Searchbar;
