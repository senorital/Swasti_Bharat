import React, { useState, useEffect, useCallback } from 'react';
import { View,ActivityIndicator, Text, TouchableOpacity, ScrollView, Alert,Modal, BackHandler ,TouchableWithoutFeedback, StyleSheet,Image,ToastAndroid } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../../../../components/header/Header';
import { styles } from '../style';
import Button from '../Form/Button';
import { useDispatch } from 'react-redux';
import { createBookingOrder, getHomeTutorTimeslot, verifyHtPayment } from '../../../../redux/actions/user/homeTutor/homeTutor';
import TimeSlot from './TimeSlot';
import LocationModal from '../LocationModal';
import { COLORS, icons } from '../../../../components/constants';
import { StatusBar } from 'expo-status-bar';
import ImageCard from '../ImageCard';
import {RAZORPAY_KEY_ID , RAZORPAY_SECRET_ID } from '@env'
import RazorpayCheckout from 'react-native-razorpay';

import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars'; // Import the calendar component
const SCREEN_WIDTH = 360; 
import { useSelector } from 'react-redux';



const BookAppointment = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageError, setLanguageError] = useState(false);
  const [timeSlotError, setTimeSlotError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const dispatch = useDispatch();
  const { homeTutorId, firstImage, yogaFor, languages } = route.params;
  const [selectedAddress, setSelectedAddress] = useState('');
  const [homeTutorInfo, setHomeTutorInfo] = useState(null);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false); // State for controlling calendar modal visibility
  const [selectedSessionType, setSelectedSessionType] = useState(null);
  const [packageType, setPackageType] = useState(null);  // State for selected package type
  const [packageOptions, setPackageOptions] = useState([]); // State to hold package options
  const user = useSelector((state) => state.auth.user);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

let razorpayKeyId = RAZORPAY_KEY_ID;
let razorpayKeySecret = RAZORPAY_SECRET_ID;
const userId = user.id;

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  const fetchData = useCallback(async (date) => {

    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const res = await dispatch(getHomeTutorTimeslot(homeTutorId, formattedDate));
  
      if (res && res.success && res.data) {
        const tutorData = res.data.slote;
  
        // Filter the slots based on time and package type
        const morning = tutorData.filter(slot => {
          const hour = parseInt(slot.time.split(":")[0], 10);
          return hour < 12; // Filter for morning slots
        });
  
        const afternoon = tutorData.filter(slot => {
          const hour = parseInt(slot.time.split(":")[0], 10);
          return hour >= 12; // Filter for afternoon slots
        });
  
        setMorningSlots(morning);
        setAfternoonSlots(afternoon);
        setHomeTutorInfo(res.data.homeTutor);
  
        // Set package options dynamically (e.g., pricing or duration types)
        if (res.data.slote.length > 0) {
          const prices = res.data.slote.map(slot => ({
            key: slot.hTPrices.id,
            value: slot.hTPrices.durationType,
          }));
          setPackageOptions(prices);
        }
  
        // Handle no available slots
        if (morning.length === 0 && afternoon.length === 0) {
          Alert.alert('No Available Time Slots', 'There are no available time slots for the selected date.');
        }
      } else {
        console.error('No data found');
        Alert.alert('No data found', 'Could not find any data for this tutor.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, homeTutorId]);
  
  // Fetch time slots for today's date on component mount or when package type changes
  useEffect(() => {
    fetchData(new Date()); // Fetch slots for the selected package type
  }, [packageType]); // Fetch data when packageType changes
  



  // Function to get today's date in ISO format
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Return today's date in 'YYYY-MM-DD' format
  };
  const handleDayPress = (day) => {
    const selected = new Date(day.dateString);
    setSelectedDate(selected);
    fetchData(selected); // Fetch data for the selected date
    setCalendarModalVisible(false); // Close calendar modal after date selection
    
  };

  const showCalendarModal = () => {
    setCalendarModalVisible(true); // Open calendar modal
  };
 
  const TextIcon = ({ yogaForItems, icon }) => (
    <View style={{marginTop:5}}>
      {yogaForItems.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Ionicons name={icon} size={15} color={COLORS.primary} style={{ marginRight:3 }} />
          <Text style={styles.cardtext} >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
  

  const TutorInfo = () => {
    if (!homeTutorInfo) return null;
    const defaultImage = require('../../../../assets/dAvatar.jpg'); // Update with your default image path

    return (
      <View style={{}}>
        <Text style={[styles.texts,{marginBottom:9}]}>Tutor Information</Text>
        <View style={styles.rowContainer}>
        <Image
            source={firstImage ? { uri: firstImage } : defaultImage}
            style={{width:90,height:90,borderRadius:10}}
          />
          <View style={{marginLeft:10}}>
          
          <Text style={styles.nameText}>{homeTutorInfo.homeTutorName}</Text>
          <TextIcon icon="checkmark-sharp" yogaForItems={JSON.parse(homeTutorInfo.yogaFor)} /> 
          </View>
        
        </View>
        
        </View>
    );
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address); 
    setIsAddressSelected(true); 
  };
  const PaymentCard = ({ text, payment }) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' , marginVertical:5,fontFamily:'Poppins'}}>
        <Text style={[styles.titletext]}>{text}</Text>
        <Text style={styles.titletext}>₹ {payment}</Text>
      </View>
    );
  };

  const renderTimeSlots = (slots) => {
    return slots.map((slot, index) => (
      <TimeSlot
        key={index}
        slot={slot}
        onSelectTime={handleSelectTime}
        selectedTimeSlot={selectedTimeSlot}
      />
    ));
  };

    useEffect(() => {
    if (isAddressSelected) {
    }
  }, [isAddressSelected]);
  const handleSelectTime = (id, priceDetails) => {
    setSelectedTimeSlot(id); 
    setSelectedPrice(priceDetails); 
    setTimeSlotError(false); 
  };



  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };
  
  const handlePayment = async () => {
    try {
      const bookingDetails = {
        amount: String(1 * 100 || 0),
        currency: selectedPrice?.currency || 'INR',
        receipt: 'Receipt_001',
        couponCode: 'COUPON123',
        hTSlotId: selectedTimeSlot,
        totalPeople: '1',
        userId,
      };
  
      setLoading(true); // Start loading
  
      const response = await dispatch(createBookingOrder(bookingDetails));
  
      if (!response.success) {
        showToast(response?.data?.message || 'Unable to create order. Please try again.');
        return; 
      }
  
      const orderId = response?.data?.id;
      const order_amount = response?.data?.amount;
  
      const localImageUri = 'https://play-lh.googleusercontent.com/p9Q6yy5OLbLlXHsgGjdcAWr4_WQgXuhGWs3qhmgOvgk-CLkd_ySGtzMurP2HCYgDIg=w480-h960-rw';
  
      const options = {
        description: 'Book HomeTutor',
        image: localImageUri,
        currency: "INR",
        key: razorpayKeyId,
        amount: order_amount, // Correct amount in paise
        name: 'Swasti Bharat',
        order_id: orderId, // Replace this with an order_id created using Orders API.
        prefill: {
          email: user.email,
          contact: user.phoneNumber,
          name: user.name,
        },
        theme: { color: COLORS.primary },
      };
  
      const result = await RazorpayCheckout.open(options);
  
      if (result.razorpay_payment_id) {
        console.log("Payment Successful: " + JSON.stringify(result));
  
        // Call verifyHtPayment with the payment result
        const verify_payment = await dispatch(verifyHtPayment(result));
  
        // Log the response from verifyHtPayment
        console.log("Payment Verification Response: ", verify_payment.data);
  
        // Check if payment verification is successful
        if (verify_payment.success) {
          console.log("Payment Verified Successfully");
            navigation.navigate('ConfirmOrder');
        } else {
          console.log("Payment Verification Failed");
  
          // Show toast message for payment verification failure
          showToast(verify_payment.data.message || 'Unable to verify payment. Please try again.');
        }
      } else {
        console.log("Payment failed: " + JSON.stringify(result));
        showToast('Payment process was not completed. Please try again.');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'An error occurred during payment. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleProceed = () => {
  
    if (selectedAddress && selectedPrice && selectedTimeSlot) {
      handlePayment();
 
    }else {
      if(selectedPrice && selectedTimeSlot){
      toggleModal(); 
      }
    }
  };
  
  const toggleModal = () => {
    let canOpenModal = true;

    if (canOpenModal) {
      setModalVisible(!isModalVisible);
    }
  };

  

  return (
    <View style={customStyles.fullScreenContainer}>
      <View style={{ paddingTop: 20 }}>
        <Header title="Book Your Appointment" icon={icons.back} />
      </View>
      <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
             <View style={styles.white}>
        <Text style={styles.medtext}>Reserve your Yoga session slot/date and timing</Text>
        <Text style={[styles.vsmalltext, { fontSize: 11, marginTop: -10 }]}>
          You can choose the date and time from the available Home tutor
        </Text>

        {/* <Text style={styles.texts}>Choose Date</Text> */}
        <TouchableOpacity onPress={showCalendarModal} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>{selectedDate.toDateString()}</Text>
          <FontAwesome5 name="calendar-alt" size={15} color="#fff" />
        </TouchableOpacity>
       

         {/* Calendar Modal */}
         <Modal visible={calendarModalVisible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={() => setCalendarModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Calendar
              // current={'2024-11-01'} // Set the calendar to display November 2024
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: COLORS.primary, // Highlight selected date with primary color
                },
                [getToday()]: {
                  selected: true,
                  selectedColor: COLORS.primary, // Highlight today's date with primary color
                  selectedTextColor: 'white', // White text on today's date
                },
              }}
              onDayPress={handleDayPress}
              monthFormat={'yyyy MM'}
              style={styles.calendar}
              theme={{
                arrowColor: COLORS.primary, // Set the arrow icon color to primary
              }}
              minDate={new Date().toISOString().split("T")[0]}
              />

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
      
    {/* <Text style={[styles.medtext,{marginVertical:10}]}>Select Package Type</Text> */}
    {/* <SelectList
            setSelected={setPackageType} // Set the selected value
            data={packageOptions} // Options populated dynamically
            save="key" // Saving the unique key for the selected option
            label="value" // Displaying the value (priceName) in the dropdown
            placeholder="Select Package"
          /> */}
      {morningSlots.length > 0 && (
  <View>
    <Text style={styles.texts}>Morning Slot</Text>
    <ScrollView horizontal style={{ marginTop: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {renderTimeSlots(morningSlots)}
      </View>
    </ScrollView>
  </View>
)}

{afternoonSlots.length > 0 && (
  <View style={{ paddingVertical: 5 }}>
    <Text style={styles.texts}>Afternoon Slot</Text>
    <ScrollView horizontal style={{ marginTop: 5 }}>
      <View style={{ flexDirection: 'row' }}>
        {renderTimeSlots(afternoonSlots)}
      </View>
    </ScrollView>
  </View>
)}

        {/* {morningSlots.length === 0 && afternoonSlots.length === 0 && (
          <Text style={customStyles.noslot}>No available time slots for the selected date.</Text>
        )} */}

        {timeSlotError && (
          <Text style={styles.errorText}>* Please select a time slot</Text>
        )}

        </View>

        <View style={styles.white}>
        <TutorInfo />
        </View>
       

{/* <View style={{ marginVertical: 0 }} /> */}
{selectedTimeSlot && selectedPrice && (
  
   <View style={styles.white}>
    <Text style={styles.texts}>Consultation Fees</Text>
<PaymentCard text="Price Per Day Per Person" payment={selectedPrice.pricePerPerson} />
</View>

  
)}

      

        {selectedAddress ? (
            <View style={styles.white}>
        <Text style={{ fontFamily: 'Poppins', color: COLORS.black,  }}>
          Selected Address: {selectedAddress}
        </Text>
        </View>
      ) : (
        <Text style={{ fontFamily: 'Poppins', color: COLORS.grey,}}>
          {/* No address selected */}
        </Text>
      )}
      
            
       
      </ScrollView>



      <View>
      <LocationModal isVisible={isModalVisible} toggleModal={toggleModal}  onSelectAddress={handleSelectAddress}    />
      
      </View>
      <View style={customStyles.fixedButtonsContainer}>
      <Button
        title={loading ? '' : canProceed ? "Choose Location at next Step" : "Book Session"} // Conditionally change button text
        onPress={handleProceed}
        disabled={loading} // Disable button while loading
      >
        {loading && <ActivityIndicator size="small" color="#fff" />}  
      </Button>
    </View>
      {/* <View style={customStyles.fixedButtonsContainer}>
        {/* Total Price Display */}
        {/* {selectedAddress && (
          <View style={customStyles.totalPriceContainer}>
            <Text style={customStyles.totalPrice}>Total Price: $200</Text>
          </View>
        )} */}

        {/* Button */}
        {/* <View style={[customStyles.buttonContainer, selectedAddress && customStyles.buttonShifted]}> */}
         {/* <TouchableOpacity onPress={handleProceed}  style={[customStyles.buttonContainer, selectedAddress && customStyles.buttonShifted]}>
          <Text>Book</Text>
         </TouchableOpacity> */}
        {/* </View> */}
      {/* </View> */}
    </View> 
  );
};

const customStyles = StyleSheet.create({
  totalPriceContainer: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  totalPrice: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '40%',
  },
  buttonShifted: {
    alignItems: 'flex-start', // Shift button to the right
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  fixedButtonsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  
    // backgroundColor: '#fff',
    borderTopWidth: 1,
    width:'100%',
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

export default BookAppointment;
