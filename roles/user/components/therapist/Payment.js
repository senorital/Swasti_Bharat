import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../Header';
import { styles } from '../style';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import Button from '../Form/Button';
import ImageCard from '../ImageCard';
import { RadioButton } from 'react-native-paper';
import { windowHeight, windowWidth } from '../../utils/Dimensions';
import Confirmation from './Confirmation';

const PaymentMethod = ({ image, text, onPress, checked }) => {
  const [selectedValue, setSelectedValue] = useState('option1');

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
      <Text style={[styles.timeslotButtonText, { color: '#5A5A62', marginLeft: 0, marginVertical: 12 }]}>{text}</Text>
      <Text style={styles.smalltext}>{payment}</Text>
    </View>
  );
};

const Payment = ({navigation}) => {
  const [selectedPayment, setSelectedPayment] = useState('Credit Card');

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <Header title="Payment" icon="chevron-left" />
      <View style={styles.container}>
        <ImageCard title="Dr. Stone Gaze" subtitle="Ear, Nose & Throat specialist" image={require('../../assets/therapist/doctor.png')} onPress={() => handleCardPress('CategoryDetail')} text={null} />
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 0 }} />
        <Text style={styles.texts}>Schedule Date</Text>
        <ImageCard title="Appointment" subtitle="Wednesday, 10 Jan 2024, 11:00" image={require('../../assets/therapist/payment.png')} onPress={() => handleCardPress('CategoryDetail')} text={null} />
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 0 }} />
        <Text style={styles.texts}>Select Payment Methods</Text>
        <PaymentMethod
          image={require('../../assets/payment/bca.png')}
          text="Credit Card"
          onPress={() => handlePaymentChange('Credit Card')}
          checked={selectedPayment}
        />
        <PaymentMethod
          image={require('../../assets/payment/mandri.png')}
          text="Debit Card"
          onPress={() => handlePaymentChange('Debit Card')}
          checked={selectedPayment}
        />
        <PaymentMethod
          image={require('../../assets/payment/visa.png')}
          text="PayPal"
          onPress={() => handlePaymentChange('PayPal')}
          checked={selectedPayment}
        />
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 0 }} />
        <Text style={styles.texts}>Total Payment</Text>
        <Calc text={'Consultation Fee'} payment={200} />
        <Calc text={'Admin'} payment={'Free'} />
        <View style={{ borderBottomWidth: 30, borderBottomColor: '#F3F4F6', marginVertical: 0 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between',padding:12 }}>
          <View style={{ flex:1}}>
            <Text style={[styles.ratingstext,{textAlign:'left',marginLeft:0,marginVertical:0}]}>Total</Text>
            <Text style={[styles.settingstext,{marginTop:0,marginBottom:4}]}>200</Text>
          </View>
          <Pressable  onPress={() => navigation.navigate(Confirmation)}>
          <LinearGradient
          colors={['#FC9D45', '#FC9C45']}
          style={[styles.appButton,{width:windowWidth/2,height:50}]}>
          <Text style={styles.appButtonText}>Pay</Text>
        </LinearGradient>
        </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Payment;
