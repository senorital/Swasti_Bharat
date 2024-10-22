import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar,SocialIcon } from "react-native-elements";
import Icon from 'react-native-vector-icons/Feather';
import Header from "../../../components/header/Header";
import { COLORS,icons } from '../../../components/constants';
const ReviewsPage = () => {
  const [reviews, setReviews] = useState([
    {
      name: 'John Doe',
      rating: 4,
      helpfulCount: 15,
      unhelpfulCount: 5,
      reviewText: 'This course is very good. the explanation ofmentor is very good and clear to understand .',
    },
    {
      name: 'Jane Smith',
      rating: 5,
      helpfulCount: 20,
      unhelpfulCount: 3,
      reviewText: 'I love this product!',
    },
    // Add more reviews here
  ]);

  const handleThumbsUp = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].helpfulCount += 1;
    setReviews(updatedReviews);
  };

  const handleThumbsDown = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].unhelpfulCount += 1;
    setReviews(updatedReviews);
  };
  const StarRating = ({ rating, size = 20, color = '#FC9D45' }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const iconName =
        i <= rating ? 'star' : i - rating < 0.5 ? 'star-half' : 'star-outline';
      stars.push(
        <Ionicons key={i} name={iconName} size={size} color={color} style={styles.star} />
      );
    }
  
    return <View style={styles.starRating}>{stars}</View>;
  };
  return (
    <View style={{flex:1}}>
        <StatusBar backgroundColor={COLORS.primary} style="light" />
        <View style={{paddingTop:20}}>
        <Header title="Write Your Reviews" icon={icons.back} />
        </View>
            <View style={styles.container}>

      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewContainer}>
          <View style={styles.header}>
            {/* <Ionicons name="star" size={20} color="gold" /> */}
            <Avatar
          rounded
          source={{
            uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          }}
          size={50}
        />   
            <View style={{flexDirection : 'column'}}>
            <Text style={[styles.name,{marginLeft : 12}]}>{review.name}</Text>
            <View style={{flexDirection : 'row'}}>
            <StarRating rating={4} size={14} color="#FC9D45"  style={{marginLeft : 50}}/>
            <Text style={{fontSize:12,color:'grey',marginLeft : 10, fontFamily : 'Poppins-Light'}}>20 minutes</Text>
            </View>
          </View>
          </View>
          <Text style={styles.reviewText}>{review.reviewText}</Text>
          <View style={styles.footer}>
            <View style={styles.countContainer}>
            <Text style={[styles.name,{fontSize:12,marginTop:5, alignItems : 'flex-start'}]}>Was this review  helpful ?</Text>
          
            <View style={{ ...styles.iconContainer, justifyContent: 'space-between',flex:2 ,marginLeft : 30}}>
            <TouchableOpacity onPress={() => handleThumbsUp(index)}>
      {/* Thumbs-up icon and text */}
      <View style={{ flexDirection: 'row',alignItems : 'center', }}>
        <Icon name="thumbs-up" size={13} color="green" />
        <Text style={[styles.name, { fontSize: 12, marginTop: 5,marginLeft:8 }]}>{review.helpfulCount}</Text>
      </View>
      
    </TouchableOpacity>

    <TouchableOpacity onPress={() => handleThumbsDown(index)}>
      {/* Thumbs-down icon and text */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="thumbs-down" size={16} color="red" />
        <Text style={[styles.name, { fontSize: 12, marginTop: 5 ,marginLeft:8 }]}>{review.unhelpfulCount}</Text>
      </View>
    </TouchableOpacity>
            </View>
            </View>

            </View>
          </View>
      ))}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,

    paddingHorizontal: 20,
    // paddingVertical: 10,
  },
  reviewContainer: {
    marginBottom: 20,
    // backgroundColor: 'white',
    padding: 10,    
    // borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    // shadowRadius: 2,
    // elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
   
    fontSize: 14,
    fontFamily : 'Poppins-Medium',
    marginBottom : 4
  },
  reviewText: {
    fontSize: 12,
    marginBottom: 10,
    color:'#565656',
    fontFamily : 'Poppins-Medium',

  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth:1,
    backgroundColor: 'transparent',
    borderTopColor: '#eee', // Add top border with lightgrey color
    borderBottomColor: '#eee', // Add bottom border with lightgrey color
    shadowColor: 'transparent',
    elevation: 0,
    justifyContent: 'space-between',

  },
  countContainer: {
    flex: 1,
    flexDirection  :'row',
    alignItems: 'center', flexWrap: 'wrap'
  },
  countLabel: {
    fontSize: 12,
  },
  iconContainer: {
  flexDirection: 'row',
  },

  starRating: {
    marginLeft : 12,
    flexDirection: 'row',
  },
  star: {
  },
});

export default ReviewsPage;
