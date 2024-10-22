import * as React from 'react';
import { View, ImageBackground, StyleSheet, FlatList, Text, TouchableWithoutFeedback } from 'react-native';
import { Card } from '../Card';
import { styles } from '../style';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const eventslist = [
  {
    src: require('../../assets/courses/course.jpg'),
    title: 'User Experience Design',
  },
  {
    src: require('../../assets/courses/course.jpg'),
    title: 'Brunch',
  },
  {
    src: require('../../assets/courses/course.jpg'),
    title: 'Lunch',
  },
  {
    src: require('../../assets/courses/course.jpg'),
    title: 'Snacks',
  },
  {
    src: require('../../assets/courses/course.jpg'),
    title: 'Dinner',
  },
];

const LatestCourse = () => {
  const navigation = useNavigation(); // Access the navigation object

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };

  const renderCarousel = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('CourseDetail', { course: item }); // Use navigation object
      }}>
      <View>
        <Card style={styles.cardContainerStyle}>
          <TouchableWithoutFeedback
            onPress={() => {
              // Handle onPress logic if needed
            }}>
            <ImageBackground
              source={item.src}
              style={styles.imageBackgroundStyle}>
            </ImageBackground>
          </TouchableWithoutFeedback>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.texts}>{truncateText(item.title, 20)}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.smalltext]}>$180</Text>
              <Text style={[styles.smalltext, { marginRight: 12 }]}> <Ionicons name='star' size={15} color='#FC9D45' /> 4.3 </Text>
            </View>
          </View>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={eventslist}
        renderItem={renderCarousel}
      />
    </View>
  );
};

export default LatestCourse;
