import React, { useState,useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, StatusBar,BackHandler, ActivityIndicator, Modal, TouchableWithoutFeedback, ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { addExperience } from "../../../../redux/actions/instructor/experience/experience";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import { Calendar } from "react-native-calendars";
import MultiSelect from "react-native-multiple-select";
import CustomDropdown from "../../../../components/CustomDropDown/customDropdown";

const AddExperience = ({ navigation }) => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    workHistory: "",
    role: "",
    department: "",
    organization: "",
  });
  const [errors, setErrors] = useState({});
  const [skills, setSkills] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Select Date");
  const [loading, setLoading] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const skillOptions = [
    { id: "1", name: "JavaScript" },
    { id: "2", name: "React Native" },
    { id: "3", name: "Redux" },
    { id: "4", name: "Node.js" },
    { id: "5", name: "MongoDB" },
  ];

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleMonthSelect = (day) => {
    const formattedDate = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setSelectedMonth(day.dateString);
    setIsCalendarVisible(false); 
    handleError(null, "date"); 
  };
  const validate = async () => {
    try {
      let isValid = true;
      const fields = ["workHistory", "role", "organization", "department"];

      fields.forEach((field) => {
        if (!inputs[field]) {
          handleError(`Please input ${field.replace(/_/g, " ")}`, field);
          isValid = false;
        }
      });

      if (selectedMonth === "Select Date") {
        handleError("Please select a join Date", "date");
        isValid = false;
      }

      if (skills.length === 0) {
        handleError("Please select at least one skill", "skills");
        isValid = false;
      }

      if (!isValid) return false;
      
      const data = {
        skills : skills,
        joinDate: selectedDate,
        role: inputs.role,
        department: inputs.department,
        workHistory: inputs.workHistory,
        organization: inputs.organization,
      };

      setLoading(true);
      const res = await dispatch(addExperience(data));
      if (res.success) {
        setErrors({});
        ToastAndroid.show(res.message, ToastAndroid.SHORT)
        navigation.navigate("Experience");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      Toast.show({ type: "error", text1: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
    return isValid;
  };

  const onSkillSelect = (selectedSkills) => {
    setSkills(selectedSkills);
    handleError(null, "skills");
  };

  const renderDropdownItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.dropdownItem}>
        <Text style={styles.dropdownItemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Add Experience"} icon={icons.back} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
        <View style={{ flex: 1 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "workHistory")}
            onFocus={() => handleError(null, "workHistory")}
            label="Work History"
            placeholder="Work History"
            error={errors.workHistory}
            isRequired={true}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "role")}
            onFocus={() => handleError(null, "role")}
            label="Role"
            placeholder="Role"
            error={errors.role}
            isRequired={true}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "organization")}
            onFocus={() => handleError(null, "organization")}
            label="Organization"
            placeholder="Organization"
            error={errors.organization}
            isRequired={true}
          />
          <Text style={styles.label}>
            Join Month<Text style={{ color: "red" }}> *</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setIsCalendarVisible(true)}
            style={styles.selectMonthButton}
          >
            <Text style={styles.selectMonthText}>{selectedMonth}</Text>
          </TouchableOpacity>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

          <View style={{ marginTop: 10 }}>
            <Input
              onChangeText={(text) => handleOnchange(text, "department")}
              onFocus={() => handleError(null, "department")}
              label="Department"
              placeholder="Department"
              error={errors.department}
              isRequired={true}
            />
          </View>

          <Text style={styles.label}>
            Skills<Text style={{ color: "red" }}> *</Text>
          </Text>
          <MultiSelect
            items={skillOptions}
            uniqueKey="id"
            onSelectedItemsChange={onSkillSelect}
            selectedItems={skills}
            selectText="Select Items"
            searchInputPlaceholderText="Search Items..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#333"
            itemTextStyle={styles.itemTextStyle}
            styleListContainer={styles.listContainer}
            styleDropdownMenuSubsection={styles.dropdownMenuSubsection}
            selectedItemTextStyle={styles.selectedItemTextStyle}
            // selectedItemIconColor="#CCC"
            submitButtonColor="#CCC"
            searchInputStyle={{
              color: '#000',
              fontFamily: 'Poppins',
            }}
            altFontFamily="Poppins"

            submitButtonText="Submit"
            hideSubmitButton={true} // If MultiSelect has a submit button prop
            selectedItemIconColor={COLORS.primary} // Green tick color
            selectedItemTextColor={COLORS.primary} // Change selected item text color (white)
            itemTextColor="#0000FF" // Change default item text color (blue)
       
            renderDropdownItem={renderDropdownItem} // Custom item renderer
           />
          {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}
            {/* <CustomDropdown
        data={languages}
        selectedItems={selectedLanguages}
        onSelect={onSkillSelect}
        placeholder="Select your Language"
        error={errors}
        styles={dropdownStyles}
      /> */}
          <Button
            title={
              loading ? (
                <ActivityIndicator size="small" color="#ffffff" style={styles.indicator} />
              ) : (
                "Save"
              )
            }
            onPress={validate}
          />
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      {isCalendarVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCalendarVisible}
          onRequestClose={() => setIsCalendarVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsCalendarVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <Calendar
                  onDayPress={(day) => handleMonthSelect(day)}
                  monthFormat={"yyyy MMM"}
                  markedDates={{
                    [selectedMonth]: { selected: true, selectedColor: COLORS.primary },
                  }}
                  maxDate={new Date().toISOString().split("T")[0]}
                  theme={{
                    selectedDayBackgroundColor: COLORS.primary,
                    selectedDayTextColor: "#fff",
                    todayTextColor: COLORS.primary,
                    arrowColor: COLORS.primary,
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // dropdownMenu: {
  //   marginTop: 10,
  //   borderWidth: 1,
  //   borderColor: COLORS.icon_background,
  //   borderRadius: 10,
  //   paddingHorizontal: 10,
  //   height: 50,
  //   justifyContent: "center",
  // },
  dropdownMenuSubsection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.icon_background,
    paddingLeft:10,
    height:45
  },
  listContainer: {
    maxHeight: 200, // Limit the height of the dropdown list
    borderColor: COLORS.icon_background,
    borderRadius: 10,
    borderWidth:1,
    padding:20
  },
  itemTextStyle: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "red",
    paddingVertical: 10,
  },
  selectedItemTextStyle: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: COLORS.primary,
    
  },
  searchInputStyle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#333",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    // marginVertical: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: COLORS.primary,
  },
  errorText: {
    marginTop: 7,
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  selectMonthButton: {
    height: 45,
    borderColor: COLORS.icon_background,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  selectMonthText: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: COLORS.grey,
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: COLORS.primary,
    marginBottom: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: {
    fontFamily: "Poppins", // Apply the Poppins font family
    fontSize: 16,
    color: "red",
  },
});

export default AddExperience;
