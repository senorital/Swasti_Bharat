import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const AccordionWidget = ({ faqData }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <View>
      {faqData.map((faq, index) => (
        <View key={index} style={styles.container}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => toggleAccordion(index)}
          >
            <Text style={styles.title}>{faq.question}</Text>
            <FontAwesome
              name={activeIndex === index ? 'angle-up' : 'angle-down'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          {activeIndex === index && (
            <View style={styles.content}>
              <Text>{faq.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop : 10,
    fontFamily: 'Poppins',
    marginTop:10
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 5,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:6,
    fontFamily: 'Poppins',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins',
    marginRight:8
  },
  content: {
    padding: 10,
    fontFamily: 'Poppins-Medium',
    backgroundColor: '#fff',
  },
});

export default AccordionWidget;
