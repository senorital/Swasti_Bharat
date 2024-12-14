import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { COLORS } from "../constants";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const CustomDatePicker = ({ isVisible, onClose, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("calendar"); // 'calendar', 'month', 'year'

  const handleDatePress = (day) => {
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
    onClose();
  };

  const renderItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <Text style={styles.listText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          {view === "calendar" && (
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setView("month")}>
                  <Text style={styles.headerText}>
                    {months[selectedMonth]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("year")}>
                  <Text style={styles.headerText}>{selectedYear}</Text>
                </TouchableOpacity>
              </View>

              <Calendar
                current={`${selectedYear}-${String(selectedMonth + 1).padStart(
                  2,
                  "0"
                )}-01`}
                onDayPress={handleDatePress}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: COLORS.primary },
                }}
                maxDate={new Date().toISOString().split("T")[0]}
                theme={{
                  textDayFontFamily:'Poppins',  
                  arrowColor: COLORS.primary,
                  selectedDayBackgroundColor: COLORS.primary,
                }}
              />
            </>
          )}

          {view === "month" && (
            <FlatList
              data={months}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) =>
                renderItem({
                  item,
                  onPress: () => {
                    setSelectedMonth(index);
                    setView("calendar");
                  },
                })
              }
            />
          )}

{view === "year" && (
  <View style={{ margin: 16, height: SCREEN_HEIGHT/1.5 }}> 
    <FlatList
      data={years}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) =>
        renderItem({
          item,
          onPress: () => {
            setSelectedYear(item);
            setView("calendar");
          },
        })
      }
      contentContainerStyle={{ paddingVertical: 8 }} 
      showsVerticalScrollIndicator={false}
    />
  </View>
)}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
   
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  headerText: {
    fontSize: 18,
    fontFamily:'Poppins-Medium',
    color: COLORS.primary,
  },
  listItem: {
    padding: 10,
    // height:'20%',
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listText: {
    fontSize: 16,
    fontFamily:'Poppins-Medium',
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily:'Poppins-Medium'
  },
});

export default CustomDatePicker;
