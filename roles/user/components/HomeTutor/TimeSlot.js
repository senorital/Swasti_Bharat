import React, { useState } from 'react';
import { Text, TouchableOpacity, Alert, View } from 'react-native';
import { styles } from '../style';

const TimeSlot = ({ slot, onSelectTime, selectedTimeSlot }) => {
  const isSelected = selectedTimeSlot === slot.time;
  const [noOfPeople, setNoOfPeople] = useState(slot.noOfPeople);
  const maxNoOfPeople = slot.noOfPeople; // Assuming this comes from the API

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

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={[styles.timeslotButton, isSelected && styles.activeTimeslotButton]}
        onPress={() => onSelectTime(slot.time)}
      >
        <Text style={[styles.timeslotButtonText, isSelected && styles.activeButtonText]}>
          {formattedTime}
        </Text>
        <Text style={[styles.timeslotInfoText, isSelected && styles.activeButtonText]}>
          {slot.serviceType === 'Group' ? (
            <>
              {slot.serviceType} Session - {noOfPeople} people
            </>
          ) : (
            `${slot.serviceType} Session - ${slot.noOfPeople} people`
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
