import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../Header';
import { styles } from '../style';
import { Picker } from '@react-native-picker/picker';
import Button from '../Form/Button';
import Payment from './Payment';
import Confirmation from './Confirmation';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i); // Change range of years as needed

const DateTab = ({ day, date, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.tabButton, selected && styles.activeTabButton]}
      onPress={onSelect}>
      <Text style={[styles.tabDateButtonText, selected && styles.activeTabdateButtonText]}>
        {day}
      </Text>
      <Text style={[styles.tabButtonText, selected && styles.activeTabButtonText]}>
        {date}
      </Text>
    </TouchableOpacity>
  );
};

const TimeSlot = ({ time, onSelectTime, selectedTimeSlot }) => {
  const isSelected = selectedTimeSlot === time;
  return (
    <TouchableOpacity
      style={[styles.timeslotButton, isSelected && styles.activeTimeslotButton]}
      onPress={() => onSelectTime(time)}>
      <Text style={[styles.timeslotButtonText, isSelected && styles.activeButtonText]}>{time}</Text>
    </TouchableOpacity>
  );
};

const LanguageTab = ({ language, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.languageTabButton, selected && styles.activeLanguageTabButton]}
      onPress={onSelect}>
      <Text style={[styles.languageTabButtonText, selected && styles.activeLanguageTabButtonText]}>
        {language}
      </Text>
    </TouchableOpacity>
  );
};

const BookAppointment = ({ navigation, route }) => {
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState(currentDay); // Initialize with current day
  const [monthsToShow, setMonthsToShow] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();

    if (selectedYear === currentYear) {
      // If selected year is the current year, start from the current month
      setMonthsToShow(months.slice(currentMonthIndex));
      setSelectedMonth(currentMonthIndex);
    } else {
      // If selected year is not the current year, show all months
      setMonthsToShow(months);
      setSelectedMonth(0); // Select the first month
    }
  }, [selectedYear]);

  useEffect(() => {
    // Update months to show whenever selected year changes
    setMonthsToShow(months);
    setSelectedMonth(0); // Select the first month
  }, [selectedYear]);

  useEffect(() => {
    if (selectedDate !== null) {
      setSelectedMonthYear(`${months[selectedMonth]}, ${selectedYear}`);
    } else {
      setSelectedMonthYear('');
    }
  }, [selectedDate, selectedMonth, selectedYear]);

  const renderDates = () => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    const selectedDateObject = new Date(selectedYear, selectedMonth, 1);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dates = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(selectedYear, selectedMonth, i);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()];
      if (
        currentDate >= today ||
        (currentDate.getDate() === todayDate &&
          currentDate.getMonth() === todayMonth &&
          currentDate.getFullYear() === todayYear)
      ) {
        dates.push(
          <DateTab
            key={i}
            day={dayName}
            date={i}
            selected={selectedDate === i}
            onSelect={() => setSelectedDate(i)}
          />
        );
      }
    }

    return dates;
  };

  const renderTimeSlots = () => {
    // Define your time slots here
    const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

    return timeSlots.map((time, index) => (
      <TimeSlot
        key={index}
        time={time}
        onSelectTime={setSelectedTimeSlot}
        selectedTimeSlot={selectedTimeSlot}
      />
    ));
  };

  const renderLanguageTabs = () => {
    return languages.map((language, index) => (
      <LanguageTab
        key={index}
        language={language}
        selected={selectedLanguage === language}
        onSelect={() => setSelectedLanguage(language)}
      />
    ));
  };

  return (
    <View>
      <Header title="Book Appointment" icon="chevron-left" />
      <View style={styles.container}>
      <Text style={styles.medtext}>Select Language</Text>
        <ScrollView horizontal>
          <View style={{ flexDirection: 'row' }}>
            {renderLanguageTabs()}
          </View>
        </ScrollView>

        <Text style={styles.medtext}>Select your visit date & Time</Text>
        <Text style={styles.vsmalltext}>
          You can choose the date and time from the available doctor's schedule
        </Text>

        
        <View style={styles.row}>
          <Picker
            selectedValue={selectedMonth}
            style={[styles.dropdown, { flex: 1 }]}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
            {monthsToShow.map((month, index) => (
              <Picker.Item key={index} label={month} value={index} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedYear}
            style={[styles.dropdown, { flex: 1 }]}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}>
            {years.map((year, index) => (
              <Picker.Item key={index} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>

        <ScrollView horizontal>
          <View style={{ flexDirection: 'row' }}>
            {renderDates()}
          </View>
        </ScrollView>
        <Text style={styles.texts}>Morning Set</Text>
        {selectedDate && (
          <ScrollView horizontal style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              {renderTimeSlots()}
            </View>
          </ScrollView>
        )}

        <Text style={styles.texts}>Afternoon Set</Text>
        {selectedDate && (
          <ScrollView horizontal style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              {renderTimeSlots()}
            </View>
          </ScrollView>
        )}
      </View>
      <View style={{ flex: 1 }} />
      <Pressable
        style={[styles.appButtonContainer, { justifyContent: 'flex-end' }]}
        onPress={() => navigation.navigate(Payment)}>
        <Button text="Confirm" />
      </Pressable>
    </View>
  );
};

export default BookAppointment;
