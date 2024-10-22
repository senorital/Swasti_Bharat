  import React from 'react';
  import { View, Text, Image, TouchableOpacity } from 'react-native';
  import { styles } from './style';
  import { StatusBar } from 'expo-status-bar';
import { icons } from '../../../components/constants';

  const ImageCard = ({  title, subtitle, path, screenConfig,text , navigation}) => {
    const { showArrowIcon = false } = screenConfig || {}; 
    const appointmentStyles = {
      titleStyle: { fontSize: 14, fontFamily:'Poppins-Medium',color: '#71717A' }, // Example styles
      subtitleStyle: { fontSize: 16, fontStyle: 'italic', color: 'grey' } // Example styles
    };

    const handlePress = () => {
      navigation.navigate(path);
    };
  
    // Check if the title is "apointment"
    let titleStyle = styles.titletext; // Default title style
    let subtitleStyle = styles.vsmalltext; // Default subtitle style
    if (title === "Appointment") {
      // Use appointment styles
      titleStyle = styles.titletext;
      subtitleStyle = styles.vsmalltext;
      // Change title and subtitle
      title = "Appointment"; // Change title
      // subtitle = "Your next appointment"; // Change subtitle
    }


    return (
      <TouchableOpacity style={{marginTop:10}} onPress={handlePress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Image source={image} style={{ width: 50, height: 50, marginRight: 10,marginBottom:15}} /> */}
            <View>
             
            <Text style={[titleStyle, { marginBottom: 0 }]}>{title}</Text>
            <Text style={[subtitleStyle]}>{subtitle}</Text>

              <Text style={[styles.medtext]}>{text}</Text>

            </View>
          </View>
          {showArrowIcon && (
          <TouchableOpacity onPress={() => { /* Handle arrow button press */ }}>
            <Image source={icons.arrow_right} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        )}

        </View>

      </TouchableOpacity>
    );
  };

  export default ImageCard;
