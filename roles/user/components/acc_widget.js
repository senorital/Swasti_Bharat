import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AccordionWidget() {
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  const toggleTopic = () => {
    setIsTopicOpen(!isTopicOpen);
  };

  return (
    <View>
    <View style={styles.container}>
    <TouchableOpacity style={styles.heading} onPress={toggleTopic}>
      <Text style={styles.headingText}>Course Introduction</Text>
      <Text style={styles.timeText}>5 min</Text>
      
    </TouchableOpacity>
    {isTopicOpen && (
      <View style={{}}>
        <Text style={styles.topicContent}>Promotion</Text>
        {/* <Ionicons
        name={isTopicOpen ? 'ios-lock-open' : 'ios-lock-closed'}
        size={18} 
        color={isTopicOpen ? 'green' : 'red'}
      /> */}
        <Text style={styles.topicContent}>Guidleines</Text>
        <Text style={styles.topicContent}>TextContent</Text>

      </View>
    )}
  </View>
    <View style={styles.container}>
      <TouchableOpacity style={styles.heading} onPress={toggleTopic}>
        <Text style={styles.headingText}>Course Introduction</Text>
        <Text style={styles.timeText}>5 min</Text>
        
      </TouchableOpacity>
      {isTopicOpen && (
        <View style={{}}>
          <Text style={styles.topicContent}>Promotion</Text>
          {/* <Ionicons
          name={isTopicOpen ? 'ios-lock-open' : 'ios-lock-closed'}
          size={18} 
          color={isTopicOpen ? 'green' : 'red'}
        /> */}
          <Text style={styles.topicContent}>Guidleines</Text>
          <Text style={styles.topicContent}>TextContent</Text>

        </View>
      )}
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor : '#ccc',
    borderWidth : 1,
    marginBottom: 10,
    borderRadius : 5
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e0e0e0',
  },
  headingText: {
    fontSize: 15,
    fontFamily : 'Poppins-Medium'
  },
  timeText: {
    fontSize: 14,
    marginRight: 10,
    color : 'grey'
  },
  topicContent: {
   fontFamily : 'Poppins-Medium',
   fontSize : 14,
   padding : 8
  },
});
