import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { styles } from '../style';
import ImageCard from '../ImageCard';
import Button from '../../components/Form/Button';
import { windowWidth } from '../../../../utils/Dimensions';
import { COLORS } from '../../../../components/constants';

const ConfirmOrder = ({route}) => {
  const { homeTutorName, specilization, timeSlot, date } = route.params;

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
      ]}
    >
     
      <View style={cstyles.container}>
        <View style={cstyles.notch}>
        <View style={cstyles.notchBackground}>
     <Image
    source={require('../../../../assets/icons/double-check.png')}
    style={{ width: 40, height: 40,transform: [{ rotate: '180deg' }]  }} // Adjust width and height as needed
  />
    </View>
          <View style={cstyles.notchCorner}>
            <View style={cstyles.notchSquare} />
            <View style={cstyles.notchCircle} />
            <View style={[cstyles.notchSquare, { right: -40 }]} />
            <View style={[cstyles.notchCircle, { right: -30 }]} />
          </View>
        </View>
        <View style={cstyles.cardContent}>
          <Text style={[styles.medtext, { textAlign: 'center' }]}>You have successfully Booked your Session</Text>
          <Text style={[styles.vsmalltext, { textAlign: 'center' }]}>The session confirmation has been sent to your email.
          </Text>
          {/* <Image source={require('../../../../assets/therapist/doctor.png')} style={{ width: 50, height: 50 }} /> */}
          <Text style={[styles.settingstext, { textAlign: 'center', marginTop: 20 }]}>{homeTutorName}</Text>
          <Text style={[styles.vsmalltext, { textAlign: 'center', marginVertical: 5, marginBottom: 15 }]}>{specilization}</Text>
          {/* Replace the ImageCard component with your actual component */}
          <ImageCard title="Appointment" subtitle="Wednesday, 10 Jan 2024, 11:00"   text={null} />
        </View>
      
      </View>
    </View>
  );
};

const cstyles = StyleSheet.create({
  container: {
    borderRadius: 20,
    // overflow: 'hidden',
    backgroundColor: '#fff',
    // marginHorizontal: 10,
    alignItems: 'center',
    height: 520,
    width: 320,
    marginTop:40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  notch: {
    position: 'absolute',
    top: -20,
    left: '38%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 55,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
    transform: [{ rotate: '180deg' }],
  },
  notchBackground: {
    position: 'absolute',
    bottom: -22, // Adjust this value to move it further upwards
    borderRadius: 15,
    alignItems: 'center',
    width: 65,
    height: 70,
    backgroundColor: '#fff',
    zIndex: 1,
    justifyContent: 'center', // Added to center the image vertically
  },
  notchCorner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notchSquare: {
    width: 10,
    height: 10,
    position: 'relative',
    top: 3,
    right: 20,
    backgroundColor: COLORS.primary,
    transform: [{ rotate: '180deg' }],
  },
  notchCircle: {
    width: 20,
    height: 20,
    position: 'relative',
    top: -3,
    right: 40,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  cardContent: {
    padding: 20,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});

export default ConfirmOrder;
