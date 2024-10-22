import React from 'react';
import { View, Text, Image,TouchableOpacity } from 'react-native';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import { styles } from '../components/style';
import { StatusBar } from 'expo-status-bar';
import ImageSlider from '../components/ImageSlider';
const homeImages = [
    require('../assets/therapist/promocard.png'),
    require('../assets/therapist/promocard.png'),
    require('../assets/therapist/promocard.png'),
  ];

const SquareBox = ({ color, image, title, subtitle , onPress}) => {
  return (
    <TouchableOpacity
    style={{
        width: windowWidth / 2.35,
        height: windowHeight / 3.8,
        backgroundColor: color,
        borderRadius: 12,
        borderColor: color,
        borderWidth: 1.5,
        marginBottom: 20,
        padding: 6,
    }}
    onPress={onPress}>    
      <Image source={image} style={{ width: '27%', height: '20%', resizeMode: 'cover', margin: 5 }} />
      <Text style={[styles.settingstext, { padding: 3,fontSize:17 }]}>{title}</Text>
      <Text style={[styles.additionalText,{fontSize :14}]}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const TherapistScreen = ({navigation}) => {
  const navigateToNextScreen = (screenName) => {
    navigation.navigate(screenName);
};
  return (
    <View style={[styles.mainContainer]}>
    <StatusBar  backgroundColor="#fff" />

      <View style={styles.container}>
        <View style={{ flexDirection: 'row', marginTop: 70, alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.boldText}>Hi Dwiky!</Text>
          <View style={{ backgroundColor: '#F9FAFB', padding: 6, borderRadius: 5 }}>
            <Image
              source={require('../assets/nav-icons/notify.png')}
              style={{ width: 23, height: 23 }}
            />
          </View>
        </View>
        <Text style={styles.smalltext}>May you always be in good condition</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',marginTop:20 }}>
          <SquareBox color="#F9F5FF" title="Book an Appointment" image={require('../assets/therapist/calendar.png')} subtitle="Find a Doctor or specialist"  onPress={() => navigateToNextScreen('Appointment')}  />
          <SquareBox color="#EDFCF2" title="Appointment with QR" image={require('../assets/therapist/bar.png')} subtitle="Queuing without the hustle"  onPress={() => navigateToNextScreen('QRAppointment')} />
          </View>
         <ImageSlider images={homeImages} />

      </View>
      
    </View>
  );
};

export default TherapistScreen;
