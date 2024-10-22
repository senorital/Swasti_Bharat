import React from 'react';
import { View, Text, Image ,ScrollView} from 'react-native';
import { styles } from '../style';
import { Ionicons } from '@expo/vector-icons';
import { windowWidth , windowHeight } from '../../utils/Dimensions';
import FormButton from '../Form/FormButton';
const Course = () => {
  return (
    <ScrollView>
      <View
        style={{
          margin: 12,
          backgroundColor: '#fff',
          borderRadius: 12,
          elevation: 5, // Add elevation for box shadow
        }}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/courses/c1.jpg')}
            style={styles.courseImage}
          />
          <View
            style={{
              flexDirection: 'column',
              marginLeft: 20,
              width: windowWidth / 1.8,
              marginRight: 10,
            }}
          >
           <View style={{flexDirection:'row'}}>  
            <Text style={styles.coursecontent}>Development</Text>
            <Ionicons name="bookmark" color={'#F97216'} size={18} style={{marginHorizontal:50}}></Ionicons>
            </View> 
            <Text style={styles.name}>
              The Complete 2023 Future Web Developer Course
            </Text>
            <View style={{flexDirection:'row',margin:2}}>
            <Text style={{ fontSize: 15, color: '#5A5F6C', fontFamily: 'Poppins-Medium',marginRight:30 }}>
              $170
            </Text>
            <FormButton   buttonTitle="Enroll Now" height={windowHeight/23} fontSize={13}  width={windowWidth/4} onPress={() => navigation.navigate('SignUp')}  />
            </View>
            {/* <Text
              style={[
                styles.ratingstext,
                { textAlign: 'left', marginLeft: 0, fontSize: 12 },
              ]}
            >
              <Ionicons
                name="star"
                size={15}
                style={styles.icon}
                color="orange"
              />{' '}
              4.3 (3.7k) ratings
            </Text> */}
          </View>
        </View>
      </View>
      <View
        style={{
          margin: 12,
          backgroundColor: '#fff',
          borderRadius: 12,
          elevation: 5, // Add elevation for box shadow
        }}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/courses/c1.jpg')}
            style={styles.courseImage}
          />
          <View
            style={{
              flexDirection: 'column',
              marginLeft: 20,
              width: windowWidth / 1.8,
              marginRight: 10,
            }}
          >
           <View style={{flexDirection:'row'}}>  
            <Text style={styles.coursecontent}>Development</Text>
            <Ionicons name="bookmark" color={'#F97216'} size={18} style={{marginHorizontal:50}}></Ionicons>
            </View> 
            <Text style={styles.name}>
              The Complete 2023 Future Web Developer Course
            </Text>
            <View style={{flexDirection:'row',margin:2}}>
            <Text style={{ fontSize: 15, color: '#5A5F6C', fontFamily: 'Poppins-Medium',marginRight:30 }}>
              $170
            </Text>
            <FormButton   buttonTitle="Enroll Now" height={windowHeight/23} fontSize={13}  width={windowWidth/4} onPress={() => navigation.navigate('SignUp')}  />
            </View>
            {/* <Text
              style={[
                styles.ratingstext,
                { textAlign: 'left', marginLeft: 0, fontSize: 12 },
              ]}
            >
              <Ionicons
                name="star"
                size={15}
                style={styles.icon}
                color="orange"
              />{' '}
              4.3 (3.7k) ratings
            </Text> */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Course;
