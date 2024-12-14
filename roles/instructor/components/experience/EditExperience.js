
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useDispatch } from "react-redux";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { getExperience, updateExperience } from "../../../../redux/actions/instructor/experience/experience";
import { COLORS, icons } from "../../../../components/constants";
import MultiSelect from "react-native-multiple-select";

const EditExperience = ({ navigation, route }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    workHistory: "",
    role: "",
    department: "",
    organization: "",
  });
  const [errors, setErrors] = useState({});
  const [skills, setSkills] = useState([]); // Selected skills
  const [availableSkills, setAvailableSkills] = useState([]); // Options for skills dropdown
  const [isCalendarVisible, setCalendarVisibility] = useState(false);
  const [date, setDate] = useState("Select Date");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading1(true);
        const res = await dispatch(getExperience(id));
        if (res.success) {
          const {
            workHistory,
            role,
            department,
            organization,
            skills,
            joinDate,
          } = res.data;

          setInputs({ workHistory, role, department, organization });
          setSkills(Array.isArray(skills) ? skills : []);
          setDate(joinDate);

          // Fetch skill options from API or define statically
          setAvailableSkills([
            { id: "1", name: "JavaScript" },
            { id: "2", name: "React Native" },
            { id: "3", name: "Node.js" },
            { id: "4", name: "Python" },
            { id: "5", name: "Java" },
          ]);
        }
      } finally {
        setLoading1(false);
      }
    };

    fetchData();
  }, [dispatch, id]);
  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validate = async () => {
    let isValid = true;

    try {
      const fields = ["workHistory", "role", "organization", "department"];

      fields.forEach((field) => {
        if (!inputs[field]) {
          handleError(`Please input ${field.replace(/_/g, " ")}`, field);
          isValid = false;
        }
      });

      if (date === "Select Date") {
        handleError("Please select a join date", "date");
        isValid = false;
      }

      if (!isValid) return false;

      const data = {
        skills,
        joinDate: date,
        role: inputs.role,
        department: inputs.department,
        workHistory: inputs.workHistory,
        organization: inputs.organization,
        id,
      };

      setLoading(true);

      const res = await dispatch(updateExperience(data));

      if (res.success) {
        setErrors({});
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        throw new Error(res.message || "Failed to update experience");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }

    return isValid;
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

  const openCalendar = () => setCalendarVisibility(true);
  const closeCalendar = () => setCalendarVisibility(false);

  const handleDateSelect = (day) => {
    setDate(day.dateString);
    setErrors((prevState) => ({ ...prevState, date: "" }));
    closeCalendar();
  };
  const handleSkillsChange = (selectedItems) => {
    setSkills(selectedItems);
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Edit Experience"} icon={icons.back} />
      </View>
      {loading1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <Input
              onChangeText={(text) => handleOnchange(text, "workHistory")}
              onFocus={() => handleError(null, "workHistory")}
              label="Work History"
              placeholder="Work History"
              value={inputs.workHistory}
              error={errors.workHistory}
              isRequired={true}
            />
            <Input
              onChangeText={(text) => handleOnchange(text, "role")}
              onFocus={() => handleError(null, "role")}
              label="Role"
              placeholder="Role"
              error={errors.role}
              value={inputs.role}
              isRequired={true}
            />
            <Input
              onChangeText={(text) => handleOnchange(text, "organization")}
              onFocus={() => handleError(null, "organization")}
              label="Organization"
              placeholder="Organization"
              error={errors.organization}
              value={inputs.organization}
              isRequired={true}
            />
           
            <Text style={styles.label}>
              Join Date<Text style={{ color: "red" }}> *</Text>
            </Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={openCalendar}
            >
              <Text style={styles.dateText}>
                {date}
              </Text>
            </TouchableOpacity>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            <Modal
              visible={isCalendarVisible}
              transparent
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{
                    [date]: { selected: true, selectedColor: COLORS.primary },
                    [new Date().toISOString().split("T")[0]]: {
                      marked: true,
                      dotColor: COLORS.primary,
                      activeOpacity: 0,
                    },
                    
                  }}
                  maxDate={new Date().toISOString().split("T")[0]} // Disable future dates

                  theme={{
                    arrowColor: COLORS.primary,
                    todayTextColor: COLORS.primary,
                    textDayFontFamily: "Poppins",
                    textMonthFontFamily: "Poppins",
                    textDayHeaderFontFamily: "Poppins",
                    selectedDayBackgroundColor: COLORS.primary,
                    selectedDayTextColor: "#fff",
                  }}
                />
              </View>
            </Modal>
          
            <Text style={styles.label}>
  Skills<Text style={{ color: "red" }}> *</Text>
</Text>
<MultiSelect
  items={availableSkills}
  uniqueKey="id"
  onSelectedItemsChange={handleSkillsChange}
  selectedItems={skills}
  selectText="Select Skills"
  searchInputPlaceholderText="Search Skills..."
  tagRemoveIconColor="#ff0000"
  tagBorderColor={COLORS.primary}
  tagTextColor={COLORS.primary}
  selectedItemTextColor={COLORS.primary}
  selectedItemIconColor={COLORS.primary}
  itemTextColor="#000"
  displayKey="name"
  hideSubmitButton={true}
  searchInputStyle={{
    color: "#000",
    fontFamily: "Poppins", // Set custom font family for search input
  
  }}
  submitButtonColor={COLORS.primary}
  submitButtonText="Submit"
  styleListContainer={{
    height: 150,
    borderColor: COLORS.icon_background, // Border color for the dropdown list
    borderWidth: 1, // Border width for the dropdown list
    borderRadius: 5, // Optional: Add rounded corners to the dropdown list
  }}
  styleDropdownMenuSubsection={styles.dropdownMenuSubsection}

/>
{errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}

          </View>
          <Button
            title={loading ? <ActivityIndicator size="small" color="#ffffff" /> : "Update"}
            onPress={validate}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dropdownMenuSubsection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.icon_background,
    paddingLeft:10,
    height:45,
    // fontFamily:'Poppins'
  },    
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    // margin: 20,
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
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
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    height: 50,
    borderColor: COLORS.icon_background,
    marginBottom:15
  },
  dateText: {
    fontSize: 14,
    color: "gray",
    textAlign:'center',
    alignItems:'center',
    fontFamily: "Poppins",
    marginTop:10
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditExperience;
