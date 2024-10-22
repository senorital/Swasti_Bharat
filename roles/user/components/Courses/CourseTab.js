import React, {useState} from 'react';
import { View, Text, StyleSheet, ImageBackground , TouchableOpacity , useWindowDimensions, ScrollView} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style';
import AccordionWidget from '../acc_widget';
import { Avatar,SocialIcon } from "react-native-elements";

import ReviewsPage from '../Reviews';
const Description = () => (
  <View style={{ flex: 1 }} >
  <Text style={styles.medtext}>Details</Text>
  <Text style={styles.descstyle} >A bachelor of technology is a 4-year full-time undergraduate engineering degree. It is a university-level education that acts as a gateway for students to jump into their professional careers. A degree from reputed colleges like IITs and NITs can pave a long way ahead in the field.</Text>
  <Text style={styles.medtext}>What You'll Learn</Text>
  <Text style={styles.descstyle} >A bachelor of technology is a 4-year full-time undergraduate engineering degree. It is a university-level education that acts as a gateway for students to jump into their professional careers. A degree from reputed colleges like IITs and NITs can pave a long way ahead in the field.</Text>
  <Text style={styles.medtext}>Who this is Course For ?</Text>
  <Text style={styles.descstyle} >A bachelor of technology is a 4-year full-time undergraduate engineering degree. It is a university-level education that acts as a gateway for students to jump into their professional careers. A degree from reputed colleges like IITs and NITs can pave a long way ahead in the field.</Text>
 
  </View>

);

const Lessons = () => (
  <View style={{ flex: 1}}>
    <View style={{flexDirection:'row'}}>
    <Text style={[styles.medtext,{fontSize:16,textAlign:'center'}]}>Course Content</Text>
    <Text style={[styles.ratingstext,{flex:2,textAlign:'right',marginTop:13}]}>Expand Sections</Text>
    </View>
   <AccordionWidget/>

  </View>
);


const Reviews = () => (
  <View style={{ flex: 1}}>
      <View style={{flexDirection:'row'}}>
    <Text style={[styles.medtext,{fontSize:16,textAlign:'center'}]}>Overall Reviews</Text>
    <Text style={[styles.ratingstext,{flex:2,textAlign:'right',marginTop:13}]}>See all</Text>
    </View>
  <ReviewsPage/>
  </View>
);

const renderScene = SceneMap({
  first: Description,
  second: Lessons,
  third : Reviews
});
const renderTabBar = props => (
  <TabBar
  renderLabel={({ focused, route }) => {
    return (
   
      <Text style ={{ fontFamily: focused ? 'Poppins' : 'Poppins', fontWeight: focused ? 'bold' : 'normal',color : focused ? '#FC9D45':'#000' }}>
        {route.title}
      </Text>
      // </LinearGradient>

)}}
    	{...props}
        style={{
            marginTop: 5,
            borderTopWidth: 1,
            borderBottomWidth:1,
            backgroundColor: 'transparent',
            borderTopColor: '#eee', // Add top border with lightgrey color
            borderBottomColor: '#eee', // Add bottom border with lightgrey color
            shadowColor: 'transparent',
            elevation: 0,
          }}
          indicatorStyle={{ borderBottomColor: '#FC9D45', borderBottomWidth: 2 , 
          fontWeight:'400'}} // Set indicator color
          activeColor="#FC9D45"
  />
);


const CourseTab = () => {
  const [activeTab, setActiveTab] = useState(1);
  const navigation = useNavigation(); // Get the navigation object

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Description' },
    { key: 'second', title: 'Lessons' },
   { key: 'third', title: 'Reviews' },

  ]);
  const layout = useWindowDimensions();
  return (

    <TabView
    navigationState={{ index, routes }}
  renderScene={renderScene}
  renderTabBar={renderTabBar}
  onIndexChange={setIndex}
  initialLayout={{ width: layout.width }}
  showPageIndicator={true}
  style={{height:500}}

/>

   
  );
};

export default CourseTab;


