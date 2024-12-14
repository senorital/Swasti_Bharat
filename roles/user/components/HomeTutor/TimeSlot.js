import React, { useState } from 'react';
import { Text, TouchableOpacity, Alert, View } from 'react-native';
import { styles } from '../style';

const TimeSlot = ({ slot, onSelectTime, selectedTimeSlot }) => {
  const isSelected = selectedTimeSlot === slot.id;
  const [noOfPeople, setNoOfPeople] = useState(slot.availableSeat);
  const maxNoOfPeople = slot.availableSeat; // Assuming this comes from the API

  const handleIncrement = () => {
    if (noOfPeople < maxNoOfPeople) {
      setNoOfPeople(noOfPeople + 1);
    } else {
      Alert.alert('Maximum number reached', `Maximum number of people (${maxNoOfPeople}) reached.`);
    }
  };

  const handleDecrement = () => {
    if (noOfPeople > 1) {
      setNoOfPeople(noOfPeople - 1);
    } else {
      Alert.alert('Minimum number reached', 'Number of people cannot be less than 1.');
    }
  };

  const formattedTime = slot.time.replace(/[AP]M/g, '');

  // Price details
  const pricePerPerson = slot.hTPrices.private_PricePerDayPerRerson;
  const totalPrice = slot.hTPrices.private_totalPricePerPerson;

  // Handle deselecting the time slot
  const handleSelectTime = () => {
    if (isSelected) {
      onSelectTime(null, null); // Deselect if already selected
    } else {
      onSelectTime(slot.id, { pricePerPerson, totalPrice }); // Pass the price when selected
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={[styles.timeslotButton, isSelected && styles.activeTimeslotButton]}
        onPress={handleSelectTime}
      >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={[styles.timeslotButtonText, isSelected && styles.activeButtonText]}>
    {formattedTime}
  </Text>
  <Text
    style={[
      styles.timeslotButtonText,
      isSelected && styles.activeButtonText,
      { marginLeft: 10,fontSize:12 }, // Adjust spacing here
    ]}
  >
    ({slot.durationType})
  </Text>
</View>
        <Text style={[styles.timeslotInfoText, isSelected && styles.activeButtonText]}>
          {slot.serviceType === 'Group' ? (
            <>
              {slot.serviceType} Session - {noOfPeople} people
            </>
          ) : (
            `${slot.serviceType} Session - ${slot.availableSeat} people`
          )}
        </Text>
      </TouchableOpacity>

      {/* Increment and Decrement buttons within TouchableOpacity */}
      {isSelected && slot.serviceType === 'Group' && (
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={handleDecrement}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{noOfPeople}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TimeSlot;
