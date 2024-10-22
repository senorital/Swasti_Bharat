import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView
} from 'react-native';
import Header from '../../components/Header';
import { Avatar,SocialIcon } from "react-native-elements";
import MentorTab from '../../components/MentorTab';
import { styles } from '../../components/style';
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';


const ColoredCircleIcon = ({ iconName, iconColor, icolor, coursetext,text }) => {
  return (
    <View style={{alignItems :'center'}}>
    <View style={[styles.circle, { backgroundColor: iconColor, borderColor :iconColor,borderWidth:10,borderColor:'#FEF4ED' }]}>
      <Icon name={iconName} size={30} color={icolor} />
     
    </View>
    <Text style={[styles.medtext,{marginTop:0,marginBottom:0}]}>{text}</Text>
    <Text style={[styles.ratingstext,{marginTop:0}]}>{coursetext}</Text>
    </View>
  );
};

const MentorScreen = () => {

  return (
    <View>
    <StatusBar  backgroundColor="#fff" />

      <ScrollView>

      <View style={styles.container}>


    {/* Mentor Profile */}
     <View style={styles.container1}>
      <View style={styles.column}>
        <Avatar
          rounded
          source={{
            uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          }}
          size={75}
        />
      </View>
      
      {/* Column 2 */}
      <View style={styles.column}>
        <Text style={{flex:1,color:'#0C0404',fontSize:15,fontFamily:'Poppins-Medium',fontWeight:'500'}}>Pallavi</Text>
             <Text style={{flex:2,color:'#0C0404',fontSize:13,fontFamily:'Poppins-Medium'}}>236 k followers</Text>

             <Text style={{color:'grey',fontSize:13,fontFamily:'Poppins'}}>Development</Text>

      </View>

      {/* Column 3 */}
           <View style={[styles.column,{marginBottom:3,alignItems:'flex-end'}]}>

        <TouchableOpacity
      style={{
        width: 40, // Adjust the width and height as needed
        height: 32,
        borderRadius : 3,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
           <Icon name="user-plus" size={20} color="white" />
    </TouchableOpacity>

    <TouchableOpacity
      style={{
        marginTop: 10,
        width: 40, // Adjust the width and height as needed
        height: 32,
        borderRadius : 3,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
           <Icon name="message-circle" size={20} color="black" />
    </TouchableOpacity>

      </View>
    </View>
    <View style={styles.hr}></View>
    <View style={{flexDirection:'row',marginBottom:20,marginLeft:-10}}>
        <ColoredCircleIcon iconName="play-circle" iconColor="#FEF4ED" icolor="#F97920" text="2" coursetext ="Courses" />
        <ColoredCircleIcon iconName="award" iconColor="#FEF4ED" icolor="#F97920" text="10+" coursetext ="Experience" />
        <ColoredCircleIcon iconName="users" iconColor="#FEF4ED" icolor="#F97920" text="245k"  coursetext ="Students"/>
        <ColoredCircleIcon iconName="star" iconColor="#FEF4ED"  icolor="#F97920" text="4.8" coursetext ="Rating"/>

      </View>
    <MentorTab/>
   

    </View>
    </ScrollView>
    </View>

  );
};

export default MentorScreen;
