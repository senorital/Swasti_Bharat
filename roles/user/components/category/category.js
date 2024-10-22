import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { StatusBar } from "expo-status-bar";
import Searchbar from "../../components/Search/Searchbar";
import Header from "../../../../components/header/Header";
// import { windowWidth } from "../../utils/Dimensions";
import { COLORS, icons } from "../../../../components/constants";
import { ScrollView } from "react-native-gesture-handler";

const CategoryCard = ({ text1, text2, path, navigation, image }) => {
  const handlePress = () => {
    if (path) {
      navigation.navigate(path);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.categoryImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.categoryText}>{text1}</Text>
        <Text style={styles.smallText}>{text2}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Category = ({ navigation }) => {
  // Data for the categories
  const categories = [
    { id: '1', text1: 'For Yourself', text2: 'Find your inner peace', image: require('../../../../assets/get-screen/tutor3.jpg'), path: null },
    { id: '2', text1: 'Yoga for Children ',text2: 'Find your inner peace', image: require('../../../../assets/get-screen/tutor3.jpg'), path: 'Index' },
    { id: '3', text1: 'Yoga for Pregnancy', text2: 'Every Wednesday', image: require('../../../../assets/get-screen/tutor3.jpg'), path: null },
    { id: '4', text1: 'Gentle Yoga', text2: 'Every Thursday', image: require('../../../../assets/get-screen/tutor3.jpg'), path: 'Index' },
    // Add more categories as needed
  ];

  // Render each category card
  const renderCategory = ({ item }) => (
    <CategoryCard 
      text1={item.text1} 
      text2={item.text2} 
      image={item.image} 
      path={item.path} 
      navigation={navigation} 
    />
  );

  return (
    <View style={{flex:1}}>
      <StatusBar style="dark" backgroundColor="#d6d5ff" />
      <View style={{paddingTop:20}}>     
     <Header title="Explore Categories" icon={icons.back} />
      </View>

      <View style={styles.container}>
      <Searchbar />


      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        numColumns={2}  // Display two cards per row
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.categoryRow}  // Style for each row
      />
    </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginHorizontal: 5,  // Margins between columns
    overflow: 'hidden',   // Ensure the content doesn't overflow the card
  },
  imageContainer: {
    width: '100%',
    height: 100,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    marginHorizontal: 5,
  },
  smallText: {
    fontSize: 10,
    color: 'grey',
    fontFamily: 'Poppins',
    marginHorizontal: 5,
  },
});

export default Category;
