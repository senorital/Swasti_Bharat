import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../../../../components/header/Header';
import { styles } from '../style';
import Button from '../Form/Button';
import { useDispatch } from 'react-redux';
import { getHomeTutorTimeslot } from '../../../../redux/actions/user/homeTutor/homeTutor';
import TimeSlot from './TimeSlot';
import LocationModal from '../LocationModal';
import { COLORS, icons } from '../../../../components/constants';
import { StatusBar } from 'expo-status-bar';
import ImageCard from '../ImageCard';
import DateTimePicker from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker'; // Import the DatePicker component

const SCREEN_WIDTH = 360; // Replace with actual screen width or import from Dimensions if needed

const BookAppointment = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openStart, setOpenStart] = useState(false); // State for controlling Start Date picker visibility
  const [startDate, setStartDate] = useState(null);  // State for storing selected Start Date
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

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const res = await dispatch(getHomeTutorTimeslot(homeTutorId, formattedDate));

      if (res && res.success && res.data) {
        const tutorData = res.data.slote;
        const morning = tutorData.filter(slot => parseInt(slot.time.split(":")[0], 10) < 12);
        const afternoon = tutorData.filter(slot => parseInt(slot.time.split(":")[0], 10) >= 12);

        setMorningSlots(morning);
        setAfternoonSlots(afternoon);
        setHomeTutorInfo(res.data.homeTutor); // Set tutor info
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
  };


  const TutorInfo = () => {
    if (!homeTutorInfo) return null;

    return (
      <ScrollView>
      <View style={customStyles.tutorInfoContainer}>
        <Text style={styles.texts}>Tutor Information</Text>
        <Text style={styles.texts}>{homeTutorInfo.homeTutorName}</Text>
        <Text style={styles.vsmalltext}>Yoga For: {homeTutorInfo.yogaFor?.replace(/[\[\]\"]/g, '')}</Text>
        <Text style={styles.vsmalltext}>Languages: {homeTutorInfo.language?.replace(/[\[\]\"]/g, '')}</Text>
        <Text style={styles.vsmalltext}>Specializations: {homeTutorInfo.specilization?.replace(/[\[\]\"]/g, '')}</Text>
      </View>
      </ScrollView>
    );
  };

  const handleConfirm = useCallback((date) => {
    setSelectedDate(date);
    fetchData(date);
    setShowDatePicker(false);
  }, []);

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const handleSelectAddress = (address) => {
    setSelectedAddress(address); // Update the selected address state
    console.log('Selected Address:', address); // Log the selected address
    navigation.navigate('Payment'); // Change 'Payment' to the actual route name if it's different

  };
  const PaymentCard = ({ text, payment }) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' , marginVertical:10,fontFamily:'Poppins'}}>
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

  const handleSelectTime = (time) => {
    setSelectedTimeSlot(time);
    if (selectedLanguage) {
      setCanProceed(true);
    }
    setTimeSlotError(false);
  };

  console.log(selectedTimeSlot)

 
  const renderLanguageTabs = () => {
    return languages.map((language, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.languageTab,
          selectedLanguage === language && styles.selectedLanguageTab
        ]}
        onPress={() => {
          setSelectedLanguage(language);
          if (selectedTimeSlot) {
            setCanProceed(true);
          }
          setLanguageError(false);
        }}
      >
        <Text style={[styles.languageTabText, selectedLanguage === language && styles.selectedLanguageTabText]}>
          {language}
        </Text>
      </TouchableOpacity>
    ));
  };

  const handleProceed = () => {
    console.log('selectedDate: ', selectedDate);
    console.log('selectedTimeSlot: ', selectedTimeSlot);
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : 'No date selected';

    if (selectedAddress) {
      navigation.navigate('Payment', {
        date: formattedDate,
        timeSlot: selectedTimeSlot,
        location: selectedAddress,
        language: selectedLanguage,
        homeTutorName : homeTutorInfo?.homeTutorName,
        specilization : homeTutorInfo?.specilization,
        price: homeTutorInfo?.privateSessionPrice_Month || homeTutorInfo?.groupSessionPrice_Month,
      });   
    } else {
      console.log('No address selected, toggling modal');
      toggleModal(); 
    }
  };


  const toggleModal = () => {
    if (!selectedLanguage) {
      setLanguageError(true);
    }
    if (!selectedTimeSlot) {
      setTimeSlotError(true);
    }
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={customStyles.fullScreenContainer}>
      <View style={{ paddingTop: 20 }}>
        <Header title="Book Your Appointment" icon={icons.back} />
      </View>
      <StatusBar backgroundColor={COLORS.primary} style="light" />

      <ScrollView style={styles.container} showsHorizontalScrollIndicator={false}>
        <Text style={styles.texts}>Choose Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10, marginTop: 10 }}>
          {languages.length === 0 ? (
            <Text>No languages available</Text>
          ) : (
            renderLanguageTabs()
          )}
        </ScrollView>
        {languageError && (
          <Text style={styles.errorText}>* Please select a language</Text>
        )}

        <Text style={styles.medtext}>Select your visit date & Time</Text>
        <Text style={[styles.vsmalltext, { fontSize: 11, marginTop: -10 }]}>
          You can choose the date and time from the available Home tutor
        </Text>

        <Text style={styles.texts}>Choose Date</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>{selectedDate.toDateString()}</Text>
          <FontAwesome5 name="calendar-alt" size={15} color="#fff" />
        </TouchableOpacity>
        <DateTimePicker
          isVisible={showDatePicker}
          mode="date"
          display="default"
          onConfirm={handleConfirm}
          onCancel={() => setShowDatePicker(false)}
        />

        {/* Start Date Picker */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>
            Start Date
          </Text>
          <TouchableOpacity
            style={[styles.timePickerButton, { width: SCREEN_WIDTH / 2.2 }]}
            onPress={() => setOpenStart(true)} // Open Start Date Picker
          >
            <Text style={styles.buttonText}>
              {startDate ? startDate.toLocaleDateString() : 'Enter Start Date'}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openStart}
            date={startDate || new Date()}
            mode="date"
            onConfirm={(selectedDate) => {
              setOpenStart(false);
              setStartDate(selectedDate); // Set selected Start Date
            }}
            onCancel={() => setOpenStart(false)}
          />
        </View>

        {/* Morning and Afternoon Slots */}
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
          <View>
            <Text style={styles.texts}>Afternoon Slot</Text>
            <ScrollView horizontal style={{ marginTop: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                {renderTimeSlots(afternoonSlots)}
              </View>
            </ScrollView>
          </View>
        )}

        {morningSlots.length === 0 && afternoonSlots.length === 0 && (
          <Text style={customStyles.noslot}>No available time slots for the selected date.</Text>
        )}

        {timeSlotError && (
          <Text style={styles.errorText}>* Please select a time slot</Text>
        )}
        <TutorInfo />

        {selectedAddress ? (
        <Text style={{ fontFamily: 'Poppins', color: COLORS.black,  }}>
          Selected Address: {selectedAddress}
        </Text>
      ) : (
        <Text style={{ fontFamily: 'Poppins', color: COLORS.grey, margin: 10 }}>
          No address selected
        </Text>
      )}
        <View style={{ borderBottomWidth: 5, borderBottomColor: '#F3F4F6', marginVertical: 0 }} />
        {homeTutorInfo && (
          <>
            <Text style={styles.texts}>Consultation Fees</Text>
            {homeTutorInfo.privateSessionPrice_Day && homeTutorInfo.privateSessionPrice_Month !== 'N/A' && (
              <PaymentCard text="Price Per Month" payment={homeTutorInfo.privateSessionPrice_Month} />
            )}
            {homeTutorInfo.groupSessionPrice_Day && homeTutorInfo.groupSessionPrice_Month !== 'N/A' && (
              <PaymentCard text="Price Per Group" payment={homeTutorInfo.groupSessionPrice_Month} />
            )}
          </>
        )}
       
      </ScrollView>



      <View>
      <LocationModal isVisible={isModalVisible} toggleModal={toggleModal}  onSelectAddress={handleSelectAddress}    />
      
      </View>
      <View style={customStyles.fixedButtonsContainer}>
      <Button title={canProceed ? "Choose Location at next Step" : "Book Session"} onPress={handleProceed} />

    </View>
    </View>
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

export default BookAppointment;
