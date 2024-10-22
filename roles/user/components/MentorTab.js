import React, {useState} from 'react';
import { View, Text, StyleSheet, ImageBackground , TouchableOpacity , useWindowDimensions, ScrollView, Image} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';
import AccordionWidget from './acc_widget';
import { Avatar,SocialIcon } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';
import ReviewsPage from './Reviews';
import { windowWidth } from '../utils/Dimensions';
const Courses = () => (
 <View style={{flexDirection:'column',marginTop:10,flex:1}} >
        <View style={styles.header}>
        <Image
        source={require('../assets/courses/c1.jpg')} // Replace with your image source
        style={styles.courseImage}
      />
            <View style={{flexDirection : 'column',marginLeft:20,width:windowWidth/1.8,marginRight:10}}>
            <Text style={styles.coursecontent}>Development</Text>
            <Text style={[styles.name]}>The Complete 2023 Future Web Developer Course</Text>
           
            <Text style={{fontSize:13,color:'black', fontFamily : 'Poppins'}}>$170</Text>
            
          <Text style={[styles.ratingstext,{textAlign:'left',marginLeft:0,fontSize:12}]}><Ionicons name="star" size={15} style={styles.icon} color="orange"/> 4.3 (3.7k) ratings</Text>
         
          </View>
          </View>

          <View style={{flexDirection:'column',marginTop:10,flex:1}} >
        <View style={styles.header}>
        <Image
        source={require('../assets/courses/c1.jpg')} // Replace with your image source
        style={styles.courseImage}
      />
            <View style={{flexDirection : 'column',marginLeft:20,width:windowWidth/1.8,marginRight:10}}>
            <Text style={styles.coursecontent}>Development</Text>
            <Text style={[styles.name]}>The Complete 2023 Future Web Developer Course</Text>
           
            <Text style={{fontSize:13,color:'black', fontFamily : 'Poppins'}}>$170</Text>
            
          <Text style={[styles.ratingstext,{textAlign:'left',marginLeft:0,fontSize:12}]}><Ionicons name="star" size={15} style={styles.icon} color="orange"/> 4.3 (3.7k) ratings</Text>
         
          </View>
          </View>
          </View>
          </View>


);

const Students = () => (
  <View style={styles.reviewContainer} >
  <View style={styles.header}>
      {/* <Ionicons name="star" size={20} color="gold" /> */}
      <Avatar
    rounded
    source={{
      uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    }}
    size={70}
  />   
      <View style={{flexDirection : 'column'}}>
      <Text style={[styles.name,{marginLeft : 50}]}>Pallavi Srivastava</Text>
      <View style={{flexDirection : 'row'}}>
      {/* <StarRating rating={4} size={14} color="#FC9D45"  style={{marginLeft : 50}}/> */}
      <Text style={{fontSize:13,color:'grey',marginLeft : 50, fontFamily : 'Poppins'}}>Student</Text>
      </View>
    </View>
    </View>

    <View style={styles.header}>
      {/* <Ionicons name="star" size={20} color="gold" /> */}
      <Avatar
    rounded
    source={{
      uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    }}
    size={70}
  />   
      <View style={{flexDirection : 'column'}}>
      <Text style={[styles.name,{marginLeft : 50}]}>Pallavi Srivastava</Text>
      <View style={{flexDirection : 'row'}}>
      {/* <StarRating rating={4} size={14} color="#FC9D45"  style={{marginLeft : 50}}/> */}
      <Text style={{fontSize:13,color:'grey',marginLeft : 50, fontFamily : 'Poppins'}}>Employee</Text>
      </View>
    </View>
    </View>
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
  first: Courses,
  second: Students,
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


const MentorTab = () => {
  const [activeTab, setActiveTab] = useState(1);
  const navigation = useNavigation(); // Get the navigation object

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Courses' },
    { key: 'second', title: 'Students' },
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

export default MentorTab;


 