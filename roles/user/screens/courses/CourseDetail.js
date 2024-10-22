import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import { Avatar, SocialIcon } from 'react-native-elements';
import CourseTab from '../../components/Courses/CourseTab';
import { styles } from '../../components/style';
import { windowHeight, windowWidth } from '../../utils/Dimensions';
import ShareCourse from '../../components/Carousel';
import AccordionWidget from '../../components/AccordionWidget';
import YouTubeIframe from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons'; // Import the desired icon from the library
import { StatusBar } from 'expo-status-bar';

const CourseDetail = ({ navigation }) => {
  const faqData = [
    {
      question: 'What is React Native?',
      answer: 'React Native is a framework for building mobile apps using React.',
    },
    {
      question: 'How do I start a new project with Expo?',
      answer: 'You can create a new project using "expo init MyProject".',
    },
    {
      question: 'How do I start a new project with Expo?',
      answer: 'You can create a new project using "expo init MyProject".',
    },
    {
      question: 'How do I start a new project with Expo?',
      answer: 'You can create a new project using "expo init MyProject".',
    },
    // Add more FAQ items as needed
  ];

  return (
    <View style={styles.fullContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ borderRadius: 9, overflow: 'hidden' }}>
            <YouTubeIframe height={185} play={true} videoId={'Jy2rireNJBs'} />
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.design}>Design</Text>
            </View>
            <Text style={styles.courseRates}>$149 </Text>
          </View>
          <Text style={styles.text}>
            Responsive Design with Grids.A Guide for UI/UX Desginer
          </Text>
          <View style={styles.rowContainer}>
            <View style={styles.leftContainer}>
              <View style={styles.columnItem}>
                <Ionicons
                  name="people-outline"
                  size={18}
                  color={'black'}
                  style={styles.iconOutline}
                />
                <Text style={styles.ratingstext}>104.2k students</Text>
              </View>
              <View style={styles.columnItem}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={'black'}
                  style={styles.iconOutline}
                />
                <Text style={styles.ratingstext}>1h 30m</Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.columnItem}>
                <Ionicons
                  name="star"
                  size={18}
                  style={styles.icon}
                  color="orange"
                />
                <Text style={styles.ratingstext}>4.3 (3.7k) ratings</Text>
              </View>
              <View style={styles.columnItem}>
                <Ionicons name="language" size={18} style={styles.icon} />
                <Text style={styles.ratingstext}>English</Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: '#0C0404',
              fontSize: 18,
              textAlign: 'left',
              fontFamily: 'Poppins-Medium',
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            This Course Includes
          </Text>
          <View style={styles.rowContainer}>
            <View style={styles.leftContainer}>
              <View style={styles.rowItem}>
                <Ionicons
                  name="videocam-outline"
                  size={18}
                  color="black"
                  style={styles.iconOutline}
                />
                <Text style={styles.ratingstext}>
                  1.5 hours on Demand Video
                </Text>
              </View>
              <View style={styles.rowItem}>
                <Ionicons
                  name="infinite"
                  size={18}
                  color="black"
                  style={styles.iconOutline}
                />
                <Text style={styles.ratingstext}>Full Lifetime Access</Text>
              </View>
              <View style={styles.rowItem}>
                <Ionicons
                  name="tv-outline"
                  size={18}
                  color="black"
                  style={styles.iconOutline}
                />
                <Text style={styles.ratingstext}>
                  Access on Mobile, Desktop and TV
                </Text>
              </View>
              <View style={styles.rowItem}>
                <Ionicons
                  name="trophy-outline"
                  size={18}
                  color="black"
                  style={styles.iconOutline}
                />
                <Text style={styles.ratingstext}>Certificate of completion</Text>
              </View>
            </View>
          </View>

          {/* Mentor Profile */}
          <Text style={styles.medtext}>Mentor</Text>

          <TouchableOpacity onPress={() => navigation.navigate('MentorScreen')}>
            <View style={styles.container1}>
              <View style={styles.column}>
                {/* Place your profile icon here */}
                <Avatar
                  rounded
                  source={{
                    uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
                  }}
                  size={75}
                />
              </View>

              <View style={[styles.column, { marginRight: 20 }]}>
                {/* Place your content here */}
                <Text
                  style={{
                    color: '#0C0404',
                    fontSize: 14,
                    fontFamily: 'Poppins',
                  }}
                >
                  Pallavi
                </Text>
                <Text
                  style={{
                    color: '#0C0404',
                    fontSize: 12,
                    fontFamily: 'Poppins',
                  }}
                >
                  236 k followers
                </Text>

                <Text
                  style={[
                    styles.ratingstext,
                    {
                      textAlign: 'left',
                      marginLeft: 0,
                      fontSize: 10,
                      marginBottom: 6,
                    },
                  ]}
                >
                  <Ionicons
                    name="star"
                    size={12}
                    style={styles.icon}
                    color="orange"
                  />{' '}
                  4.3 (3.7k) ratings
                </Text>
              </View>

              {/* Column 3 */}

              {/* Place the name on the right */}
              <Text style={styles.followers}>Following</Text>

              {/* TabBar component */}
            </View>
          </TouchableOpacity>

          <CourseTab />

          <Text style={styles.medtext}>Share</Text>
          <View style={{ flexDirection: 'row' }}>
            <SocialIcon
              //Social Icon using react-native-elements
              type="facebook"
              //Type of Social Icon
              onPress={() => {
                //Action to perform onPress of the Icon
                alert('facebook');
              }}
            />

            <SocialIcon
              //Social Icon using react-native-elements
              type="whatsapp"
              //Type of Social Icon
              onPress={() => {
                //Action to perform onPress of the Icon
                alert('whatsapp');
              }}
            />

            <SocialIcon
              //Social Icon using react-native-elements
              type="twitter"
              //Type of Social Icon
              onPress={() => {
                //Action to perform onPress of the Icon
                alert('twitter');
              }}
            />

            <SocialIcon
              //Social Icon using react-native-elements
              type="linkedin"
              //Type of Social Icon
              onPress={() => {
                //Action to perform onPress of the Icon
                alert('linkedin');
              }}
            />
          </View>
          <Text style={styles.medtext}>Students Also Brought</Text>
          <ShareCourse />
          <Text style={styles.medtext}>FAQs</Text>
          <AccordionWidget faqData={faqData} />
        </View>
      </ScrollView>
      <View style={styles.buttonContainerFixed}>
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default CourseDetail;
