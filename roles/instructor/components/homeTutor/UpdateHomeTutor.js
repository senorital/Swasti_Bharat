import React, { useState, useEffect , useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  FlatList,ToastAndroid
} from "react-native";
import Toast from "react-native-toast-message";
import MultiSelect from "react-native-multiple-select";
import Header from "../../../../components/header/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import CheckBox from "react-native-check-box";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { Ionicons } from "@expo/vector-icons";
import {
  getTutorById,
  updateHomeTutor,
  getYogaForCategory
} from "../../../../redux/actions/instructor/homeTutor/homeTutor";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";

const data = [
  // { type: 'certification' },
  // { type: 'bio' },
  { type: 'specialisations' },
  { type: 'service' },
  { type: 'price' },
  { type: 'languages' },
  { type: 'yogaFor' },
];

const specialisationItems = [
  { id: "1", name: "Hatha Yoga" },
  { id: "2", name: "Vinyasa Yoga" },
  { id: "3", name: "Ashtanga Yoga" },
  { id: "4", name: "Bikram Yoga" },
  { id: "5", name: "Kundalini Yoga" },
  { id: "6", name: "Iyengar Yoga" },
  { id: "7", name: "Yin Yoga" },
  { id: "8", name: "Restorative Yoga" },
  { id: "9", name: "Power Yoga" },
  { id: "10", name: "Yoga Therapy" },
];

const language = [
  { id: '1', name: 'English' },
  { id: '2', name: 'Spanish' },
  { id: '3', name: 'French' },
  { id: '4', name: 'German' },
  { id: '5', name: 'Hindi' },
  { id: '6', name: 'Bengali' },
  { id: '7', name: 'Telugu' },
  { id: '8', name: 'Marathi' },
  { id: '9', name: 'Tamil' },
  { id: '10', name: 'Urdu' },
  { id: '11', name: 'Gujarati' },
  { id: '12', name: 'Malayalam' },
  { id: '13', name: 'Kannada' },
  { id: '14', name: 'Odia' },
  { id: '15', name: 'Punjabi' },
  { id: '16', name: 'Assamese' },
  { id: '17', name: 'Maithili' },
  { id: '18', name: 'Sanskrit' },
  { id: '19', name: 'Konkani' },
  { id: '20', name: 'Nepali' },
  { id: '21', name: 'Manipuri' },
  { id: '22', name: 'Sindhi' },
  { id: '23', name: 'Dogri' },
  { id: '24', name: 'Kashmiri' },
  { id: '25', name: 'Bodo' },
];


const UpdateHomeTutor = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { id } = route.params;
  const [yogaItems, setYogaItems] = useState([]);

  const [selectedSpecialisations, setSelectedSpecialisations] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedYogaFor, setSelectedYogaFor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [bio, setBio] = useState("");
  const [certification, setCertification] = useState("");
  const [privateSessionPerDay, setPrivateSessionPerDay] = useState('');
  const [privateSessionPerMonth, setPrivateSessionPerMonth] = useState('');
  const [groupClassPerDay, setGroupClassPerDay] = useState('');
  const [groupClassPerMonth, setGroupClassPerMonth] = useState('');
  const [yogaFor, setYogaFor] = useState([]);
  const [tutorName, setTutorName] = useState("");
  const [isPrivateSO, setIsPrivateSO] = useState(false);
  const [isGroupSO, setIsGroupSO] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
  const [dropdownOpen, setDropdownOpen] = useState(false);

 

  useEffect(() => {
    const YogaForCategory = async () => {
      try {
        const response = await dispatch(getYogaForCategory());
        
        if (response.success) {
          setYogaItems(response.data); 
        } else {
          console.error("Failed to fetch yoga categories:", response.message);
        }
      } catch (error) {
        console.error("Failed to fetch yoga categories:", error);
      }
    };

    YogaForCategory();
  }, [dispatch]); // Added dispatch to dependencies

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading1(true);
        const res = await dispatch(getTutorById(id));

        setTutorName(res.data.homeTutorName);
        setBio(res.data.instructorBio);

      const parsedLanguages = JSON.parse(res.data.language || "[]");
      const languageIds = parsedLanguages.map(lang => language.find(item => item.name === lang)?.id);
      setSelectedLanguage(languageIds.filter(Boolean) || []);

      // Parse and set specialisation data
      const parsedSpecialisations = JSON.parse(res.data.specilization || "[]");
      const specialisationIds = parsedSpecialisations.map(spec => specialisationItems.find(item => item.name === spec)?.id);
      setSelectedSpecialisations(specialisationIds.filter(Boolean) || []);

      // Parse and set yogaFor data
      const parsedYogaFor = JSON.parse(res.data.yogaFor || "[]");
      const yogaForIds = parsedYogaFor.map(yoga => yogaItems.find(item => item.yogaFor === yoga)?.id);
      setSelectedYogaFor(yogaForIds.filter(Boolean) || []);

      setIsGroupSO(res.data.isGroupSO);
    

      setIsPrivateSO(res.data.isPrivateSO);
     
       } finally {
        setLoading1(false);
      }
    };

    fetchData();
  }, [dispatch, id,yogaItems]);



  const specialisationIdToName = specialisationItems.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  const languageIdToName = language.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  const yogaForIdToName = yogaItems.reduce((acc, item) => {
    acc[item.id] = item.yogaFor;
    return acc;
  }, {});

  const stepOneValidationSchema = Yup.object().shape({
    bio: Yup.string().required("Bio is required"),
    specialisations: Yup.array().min(1, "At least one specialisation is required"),
    isPrivateSO: Yup.boolean(),
    isGroupSO: Yup.boolean(),
    language: Yup.array().min(1, "At least one language is required"),
    yogaFor: Yup.array().min(1, "At least one select field is required"),
  });

  const multiSelectRef = useRef(null);

  // Generalized handleSelection function

  const renderItem = ({ item, handleChange, handleBlur, values, touched, errors, setFieldValue,itemType,  selectedItems, 
  }) => {
    const getItems = () => {
      switch (item.type) {
        case 'specialisations':
          return specialisationItems;
        case 'languages':
          return language;
        case 'yogaFor':
          return yogaItems;
        default:
          return [];
      }};
      const items = getItems();
      if (!items) return null; 

    switch (item.type) {
    
      case 'yogaFor':
        return (
          <>
          <Text style={styles.label}>Giving Yoga Sessions For<Text style={{ color: "red" }}>*</Text></Text>
          <MultiSelect
            hideTags
            items={yogaItems}
            uniqueKey="id"
            onSelectedItemsChange={(newSelectedItems) => {
              setSelectedYogaFor(newSelectedItems);
              setFieldValue('yogaFor', newSelectedItems);
            }}
            selectedItems={selectedYogaFor}
            selectText="Select Yoga For"
            searchInputPlaceholderText="Search Items..."
            altFontFamily="Poppins"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#000', fontFamily: 'Poppins', paddingHorizontal: 0 }}
            submitButtonColor="#000"
            submitButtonText=""
            hideSubmitButton={true}
            styleInputGroup={styles.styleInputGroup}
            styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
            styleDropdownMenu={styles.styleDropdownMenu}
            styleMainWrapper={styles.styleMainWrapper}
            flatListProps={{
              renderItem: ({ item }) => {
                const isSelected = selectedYogaFor.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[
                      { padding: 10, margin: 2, borderRadius: 10 },
                      { backgroundColor: isSelected ? '#EEEEEE' : '#fff' }
                    ]}
                    onPress={() => {
                      const newSelectedItems = isSelected
                        ? selectedYogaFor.filter(id => id !== item.id)
                        : [...selectedYogaFor, item.id];
                      setSelectedYogaFor(newSelectedItems);
                      setFieldValue('yogaFor', newSelectedItems);
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[
                        styles.itemText,
                        { color: isSelected ? COLORS.primary : '#000', fontFamily: 'Poppins' }
                      ]}>
                        {item.yogaFor}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#000" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }
            }}
          />
          <View style={styles.tabsContainer}>
            {selectedYogaFor.map(itemId => {
              const item = yogaItems.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <View key={item.id} style={styles.tab}>
                  <Text style={styles.tabText}>{item.yogaFor}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      const updatedItems = selectedYogaFor.filter(id => id !== itemId);
                      setSelectedYogaFor(updatedItems);
                      setFieldValue('yogaFor', updatedItems);
                    }}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
        )
    
      case 'specialisations':
        const removeItem = (itemId) => {
          const updatedItems = safeSelectedItems.filter(id => id !== itemId);
          setSelectedItems(updatedItems);
          setFieldValue(itemType, updatedItems);
        };
      
        return (
        
          <>
          <Text style={styles.label}>Specialisation <Text style={{ color: "red" }}>*</Text></Text>
          <MultiSelect
            hideTags
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={(newSelectedItems) => {
              setSelectedSpecialisations(newSelectedItems);
              setFieldValue('specialisations', newSelectedItems);
            }}
            selectedItems={selectedSpecialisations}
            selectText="Select Your Specialisation"
            searchInputPlaceholderText="Search Items..."
            altFontFamily="Poppins"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#000', fontFamily: 'Poppins', paddingHorizontal: 0 }}
            submitButtonColor="#000"
            submitButtonText=""
            hideSubmitButton={true}
            styleInputGroup={styles.styleInputGroup}
            styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
            styleDropdownMenu={styles.styleDropdownMenu}
            styleMainWrapper={styles.styleMainWrapper}
            flatListProps={{
              renderItem: ({ item }) => {
                const isSelected = selectedSpecialisations.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[
                      { padding: 10, margin: 2, borderRadius: 10 },
                      { backgroundColor: isSelected ? '#EEEEEE' : '#fff' }
                    ]}
                    onPress={() => {
                      const newSelectedItems = isSelected
                        ? selectedSpecialisations.filter(id => id !== item.id)
                        : [...selectedSpecialisations, item.id];
                      setSelectedSpecialisations(newSelectedItems);
                      setFieldValue('specialisations', newSelectedItems);
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[
                        styles.itemText,
                        { color: isSelected ? COLORS.primary : '#000', fontFamily: 'Poppins' }
                      ]}>
                        {item.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#000" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }
            }}
          />
          <View style={styles.tabsContainer}>
            {selectedSpecialisations.map(itemId => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <View key={item.id} style={styles.tab}>
                  <Text style={styles.tabText}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      const updatedItems = selectedSpecialisations.filter(id => id !== itemId);
                      setSelectedSpecialisations(updatedItems);
                      setFieldValue('specialisations', updatedItems);
                    }}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          </>
        
  );
      case 'service':
        return (
          <>
        <View style={{ paddingVertical: 10 }}>
        <Text style={styles.label}>
          Service Offered <Text style={{ color: "red" }}>*</Text>
        </Text>

        <View style={{ flexDirection: "row" }}>
                <View style={[styles.switchContainer, { marginRight: 20 ,marginTop:5}]}>
                  <View style={{ transform: [{ scale: 0.9 }]}}>
                <CheckBox
          isChecked={values.isPrivateSO}
          onClick={() => setFieldValue("isPrivateSO", !values.isPrivateSO)}
          checkBoxColor={COLORS.unchecked} // Color when unchecked
          checkedCheckBoxColor={COLORS.primary} // Color when checked
        />
        </View>
                  <Text style={[,{marginLeft:5,fontFamily:'Poppins',marginTop:5}]}>Individual </Text>
                </View>
                <View style={[styles.switchContainer,{marginTop:5}]}>
                <View style={{ transform: [{ scale: 0.9 }]}}>
                  <CheckBox
                    isChecked={values.isGroupSO}
                    onClick={() =>
                      setFieldValue("isGroupSO", !values.isGroupSO)
                    }
                    checkBoxColor={COLORS.unchecked} // Color when unchecked
                    checkedCheckBoxColor={COLORS.primary} // Color when checked
                 
                   
                  />
                  </View>
                  <Text style={[{marginLeft:5,fontFamily:'Poppins',marginTop:5}]}>Group</Text>
                </View>
              </View>
            </View>

          </>
        );
 
        case 'languages':
          return (
    
            <>
            
            <Text style={styles.label}>Languages<Text style={{ color: "red" }}>*</Text></Text>
          <MultiSelect
            hideTags
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={(newSelectedItems) => {
              setSelectedLanguage(newSelectedItems);
              setFieldValue('language', newSelectedItems);
            }}
            selectedItems={selectedLanguage}
            selectText="Select Your Language"
            searchInputPlaceholderText="Search Items..."
            altFontFamily="Poppins"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#000', fontFamily: 'Poppins', paddingHorizontal: 0 }}
            submitButtonColor="#000"
            submitButtonText=""
            hideSubmitButton={true}
            styleInputGroup={styles.styleInputGroup}
            styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
            styleDropdownMenu={styles.styleDropdownMenu}
            styleMainWrapper={styles.styleMainWrapper}
            flatListProps={{
              renderItem: ({ item }) => {
                const isSelected = selectedLanguage.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[
                      { padding: 10, margin: 2, borderRadius: 10 },
                      { backgroundColor: isSelected ? '#EEEEEE' : '#fff' }
                    ]}
                    onPress={() => {
                      const newSelectedItems = isSelected
                        ? selectedLanguage.filter(id => id !== item.id)
                        : [...selectedLanguage, item.id];
                      setSelectedLanguage(newSelectedItems);
                      setFieldValue('language', newSelectedItems);
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[
                        styles.itemText,
                        { color: isSelected ? COLORS.primary : '#000', fontFamily: 'Poppins' }
                      ]}>
                        {item.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#000" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }
            }}
          />
          <View style={styles.tabsContainer}>
            {selectedLanguage.map(itemId => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <View key={item.id} style={styles.tab}>
                  <Text style={styles.tabText}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      const updatedItems = selectedLanguage.filter(id => id !== itemId);
                      setSelectedLanguage(updatedItems);
                      setFieldValue('language', updatedItems);
                    }}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
          );
    
        
        
      default:
        return null;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const specialisationsd = values.specialisations.map(id => specialisationIdToName[id]);
    const languages = values.language.map(id => languageIdToName[id]);
    const yogaFors = values.yogaFor.map(id => yogaForIdToName[id]);

    const tutorData = {
      instructorBio: values.bio,
      language: languages,
      isGroupSO: values.isGroupSO,
      isPrivateSO: values.isPrivateSO,
      specilization: specialisationsd,
      yogaFor: yogaFors,
      homeTutorName: values.tutorName,
    id
    };

   
    try {
      const res = await dispatch(updateHomeTutor(tutorData));
     
      ToastAndroid.show(res.message,ToastAndroid.SHORT)

      navigation.goBack();
    } catch (error) {
      console.error("Error updating home tutor:", error);
   
      ToastAndroid.show("An error occurred. Please try again.",ToastAndroid.SHORT)

    } finally {
      setSubmitting(false);
    }
  };

  if (loading1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} />
        <View style= {{paddingTop:20}}>
        <Header title="Update Your Profile" icon={icons.back} />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inner}
        >
          <Formik
            initialValues={{
              bio: bio,
              yogaFor: selectedYogaFor || [],
              specialisations: selectedSpecialisations || [],
              isPrivateSO: isPrivateSO,
              isGroupSO: isGroupSO,
              language: selectedLanguage || [],
              tutorName: tutorName,
            }}
            onSubmit={handleSubmit}
          >
           {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue, isSubmitting }) => (
            <FlatList
              data={data}
              renderItem={({ item }) => {
                return renderItem({ item, handleChange, handleBlur, values, touched, errors, setFieldValue });
              }}
              keyExtractor={(item) => item.type}
              contentContainerStyle={[styles.stepContainer,{paddingBottom:70}]}
              ListFooterComponent={
                <View style={{ paddingVertical: 0 }}>
                <Button
                  title={
                    isSubmitting ? (
                      <ActivityIndicator
                        size="small"
                        color="#ffffff"
                        style={styles.indicator}
                      />
                    ) : (
                      "Submit"
                    )
                  }
                  onPress={handleSubmit}
                  disabled={isSubmitting}
              
                />
                </View>
              }
            />
          )}
        </Formik>
        </KeyboardAvoidingView>
      </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  tab: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 5,
    marginTop:3,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabText: {
    color: '#000',
    fontSize: 13,
    fontFamily:'Poppins'
  },
  removeButton: {
    marginLeft: 5,
    padding: 5,
    marginTop:-5,
    borderRadius: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#000'
  },
  styleDropdownMenu: {
    borderWidth: 0, // Remove underline from dropdown menu
    // paddingVertical:10,

  },
  item: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemText: {
   borderRadius:10,
    fontSize: 13
  },
  checkmark: {
    fontSize: 16,
    color: '#000',
    textAlign:'right'
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: '600',
    color:COLORS.primary,
    marginBottom:5
  },
  input: {
    // borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    fontFamily: "Poppins",
    color: "#000",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  customAddButton: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 10,
    padding: 5,
    // color: COLORS.timeslottext,
    // width:'90%',
    alignItems: "center",
    justifyContent:'center',
    marginVertical: 10,
  },
  customAddButtonText: {  
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: "Poppins",
  },
  autocompleteContainer: {
    zIndex: 1,
    width: "100%",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  distanceButton: {
    padding: 10,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selectedDistanceButton: {
    backgroundColor: "rgba(102, 42, 178, 1)",
    borderColor: "rgba(102, 42, 178, 1)",
  },
  unselectedDistanceButton: {
    backgroundColor: "#fff",
    borderColor: "lightgray",
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
   
  },
  activeSubmitButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    padding: 10,
  },
  inactiveSubmitButton: {
    backgroundColor: "#CCC",
    borderRadius: 10,
    padding: 10,
  },
  distanceButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  selectedDistanceButtonText: {
    color: "#fff",
  },
  unselectedDistanceButtonText: {
    color: "#000",
  },
  distanceList: {
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  styleInputGroup: {
    borderWidth: 0, // Remove underline from input group
    borderBottomWidth : 0,
    paddingVertical:10,
   marginLeft:0,
  //  padding:8,
   paddingHorizontal :0
  },
  styleDropdownMenuSubsection: {
    borderWidth: 0, // Remove underline from dropdown menu subsection
    borderBottomWidth : 0,
    paddingVertical:10,
    paddingHorizontal:0
  },
  styleMainWrapper: {
    borderWidth: 1,
    borderColor: COLORS.icon_background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical:0
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  styleSelectorContainer: {
    borderBottomWidth: 0, // Remove the default bottom border
  },
  progressBar: {
    backgroundColor: "#ccc",
    height: 5,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 5,
  },
  progressBarActive: {
    backgroundColor: "#5F33E1",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    textAlign:'center'
  },
});

export default UpdateHomeTutor;