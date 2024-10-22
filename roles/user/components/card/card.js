import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { COLORS } from '../../../../components/constants';

const Card = () => {
  const navigation = useNavigation(); // Initialize navigation

  const handleCardPress = () => {
    navigation.navigate('Category'); // Navigate to the 'Category' page
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.scrollContainer}
    >
      {/* Card 1 */}
      <TouchableOpacity onPress={handleCardPress}>
        <View style={[styles.card, { marginHorizontal: 0 }]}>
          <Image 
            source={require('../../../../assets/batch.png')} 
            style={styles.cardImage} 
          />
          <View style={{ padding: 10 }}>
            <Text style={styles.cardText}>Morning Meditation</Text>
            <Text style={styles.smalltext}>Morning Meditation</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Card 2 */}
      <TouchableOpacity onPress={handleCardPress}> 
        <View style={styles.card}>
          <Image 
            source={require('../../../../assets/batch.png')} 
            style={styles.cardImage} 
          />
          <View style={{ padding: 10 }}>
            <Text style={styles.cardText}>Morning Meditation</Text>
            <Text style={styles.smalltext}>Morning Meditation</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Card 3 */}
      <TouchableOpacity onPress={handleCardPress}> 
        <View style={styles.card}>
          <Image 
            source={require('../../../../assets/batch.png')} 
            style={styles.cardImage} 
          />
          <View style={{ padding: 10 }}>
            <Text style={styles.cardText}>Morning Meditation</Text>
            <Text style={styles.smalltext}>Morning Meditation</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    width: 140,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  smalltext: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default Card;
