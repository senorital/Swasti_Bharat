import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, Image,StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../../../components//header/Header';
import { styles } from '../style';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/Form/Button';
import ImageCard from '../ImageCard';
import { RadioButton } from 'react-native-paper';
import { windowHeight, windowWidth } from '../../../../utils/Dimensions';
import { icons } from '../../../../components/constants';
import { COLORS } from '../../../../components/constants';
const PaymentMethod = ({ image, text, onPress, checked }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={image} />
        <Text style={[styles.ratingstext, { marginLeft: 12, fontSize: 14, fontFamily: 'Poppins-Medium', color: '#000' }]}>
          {text}
        </Text>
      </View>
      <RadioButton.Android value={text} status={checked === text ? 'checked' : 'unchecked'} onPress={onPress} color="#FC9D45" />
    </View>
  );
};

const Calc = ({ text, payment }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={[styles.timeslotButtonText, { color: '#5A5A62', marginLeft: 0, marginVertical: 12 }]}>{text}

      </Text>
      <Text style={styles.smalltext}>{payment}</Text>
    </View>
  );
};


const Payment = ({ navigation, route }) => {
  const [selectedPayment, setSelectedPayment] = useState('Credit Card');
  const { date, timeSlot, location, language, price,specilization,homeTutorName } = route.params || {}; 
  console.log('price' + price)
  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };
  // const formattedDate = date ? date.toLocaleDateString() : 'No date selected';
  const onPay = () => {
    navigation.navigate('ConfirmOrder', {
      homeTutorName: homeTutorName,
      specilization: specilization,
      timeSlot: timeSlot,
      date: date,
    });
  };
  return (
    <ScrollView style={[styles.mainContainer, { marginTop: 0 }]}>
      <View style={{ paddingTop: 20 }}>
        <Header title="Payment" icon={icons.back} />
      </View>
      <View style={styles.container}>
        <View style={{ borderBottomWidth: 5, borderBottomColor: COLORS.primary, marginVertical: 0 }} />
        
        <Text style={styles.texts}>Schedule Date</Text>
        <Calc text={'Date'} payment={date} /> 
        <Calc text={'Time'} payment={timeSlot} />
        
        
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 0 }} />
        
        <Text style={styles.texts}>Total Payment</Text>
        <Calc text={'Payment'} payment={price || 200} /> 
  
        <View style={{ borderBottomWidth: 30, borderBottomColor: '#F3F4F6', marginVertical: 0 }} />

        <View style={{ }}>
         
           <View style={customStyles.fixedButtonsContainer}>
      <Button title={"Pay"} onPress={onPay}  />

    </View>
        </View>
      </View>
    </ScrollView>
  );
};

const customStyles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  fixedButtonsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  noslot :{
  fontSize : 12,
  marginTop:5,
  color: COLORS.purered,
  fontFamily:'Poppins',  
  }
 
});
export default Payment;



    {/* <Text style={styles.texts}>Select Payment Method</Text>
        <PaymentMethod
          image={require('../../../../assets/payment/bca.png')}
          text="Credit Card"
          onPress={() => handlePaymentChange('Credit Card')}
          checked={selectedPayment}
        />
        <PaymentMethod
          image={require('../../../../assets/payment/mandri.png')}
          text="Debit Card"
          onPress={() => handlePaymentChange('Debit Card')}
          checked={selectedPayment}
        />
        <PaymentMethod
          image={require('../../../../assets/payment/visa.png')}
          text="PayPal"
          onPress={() => handlePaymentChange('PayPal')}
          checked={selectedPayment}
        />
        */}