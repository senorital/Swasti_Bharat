import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Image ,View} from 'react-native';
import { styles } from '../../components/style';
import { FirstScreenNavigator, FourthScreenNavigator, SecondScreenNavigator, ThirdScreenNavigator } from './CustomNavigation';

const Tab = createBottomTabNavigator();

const UserTabNavigator = () => {

  // useEffect(() => {
  //   const routeName = route.name;
  //   // Set status bar color based on the active route
  //   switch (routeName) {
  //     case 'Home':
  //       StatusBar.setBackgroundColor('red');
  //       break;
  //     case 'Batches':
  //       StatusBar.setBackgroundColor('#fff'); // Change to your desired color
  //       break;
  //     case 'My Course':
  //       StatusBar.setBackgroundColor('#fff'); // Change to your desired color
  //       break;
  //     case 'Account':
  //       StatusBar.setBackgroundColor('#fff'); // Change to your desired color
  //       break;
  //     default:
  //       StatusBar.setBackgroundColor('#fff');
  //   }
  // }, [route]);

  return (
    <View style={{flex:1,backgroundColor:'#E5F0F9'}}>
      <Tab.Navigator
        screenOptions={{
          elevation: 0, // Remove shadow on Android
          headerStatusBarHeight: 0,
          tabBarLabelStyle: {
            marginBottom: 2,
            fontFamily: 'Poppins-Medium',
            padding: 2,
            fontSize: 11, // Adjust the font size as needed
          },
          tabBarActiveTintColor: 'blue', // Set active text color to match the icon color
          tabBarInactiveTintColor: 'blue', // Set inactive text color
          tabBarStyle: {
            borderWidth: 1,
            borderColor: '#EEE9FF',
            backgroundColor: '#EEE9FF',
            borderTopLeftRadius: 30, // Adjust the radius value as needed
            borderTopRightRadius: 30, // Adjust the radius value as needed
            height: 60,
            elevation: 10, // Elevation for Android
            shadowColor: '#5F33E1', // Shadow color for iOS
            shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
            shadowOpacity: 0.6, // Shadow opacity for iOS
            shadowRadius: 3.84, // Shadow radius for iOS
          },
        }}>
        <Tab.Screen
          name="Home"
          component={FirstScreenNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? require('../../../../assets/group1.png') : require('../../../../assets/nav-icons/home-not.png')}
                style={styles.tabimage}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Classes"
          component={SecondScreenNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? require('../../../../assets/nav-icons/layer-active.png') : require('../../../../assets/nav-icons/layer.png')}
                style={styles.tabimage}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Instructors"
          component={ThirdScreenNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? require('../../../../assets/nav-icons/book-active.png') : require('../../../../assets/nav-icons/book.png')}
                style={styles.tabimage}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Contacts"
          component={FourthScreenNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? require('../../../../assets/nav-icons/profile-not.png') : require('../../../../assets/profile.png')}
                style={styles.tabimage}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default UserTabNavigator;
