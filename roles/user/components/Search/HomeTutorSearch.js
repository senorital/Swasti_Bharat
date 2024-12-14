import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler,TextInput, TouchableOpacity, Platform, UIManager, ScrollView, FlatList,ToastAndroid } from 'react-native';
import { Menu, Provider, TextInput as PaperTextInput, IconButton, Checkbox, RadioButton } from 'react-native-paper';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { windowHeight, windowWidth } from '../../../../utils/Dimensions';
import Slider from '@react-native-community/slider';
import { COLORS } from '../../../../components/constants';
import { Ionicons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CategoryBox = ({ text, children }) => {
  return (
    <View style={styles.boxContainer}>
      <View style={styles.header}>
        <Text style={styles.medtext}>{text}</Text>
      </View>
      <View>{children}</View>
    </View>
  );
};

const CustomHeader = ({ title, onClose }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButtons}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const HomeTutorSearch = ({ route,navigation }) => {
  const [yogaTherapistChecked, setYogaTherapistChecked] = useState(false);
  const [ageRange, setAgeRange] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [certification, setCertification] = useState('no');
  const [selectedLanguages, setSelectedLanguages] = useState(null);
  const [languageFilter, setLanguageFilter] = useState('');
  const [isSessionPersonal, setIsSessionPersonal] = useState(false);
  const [isSessionGroup, setIsSessionGroup] = useState(false);
  const [isPackageYearly, setIsPackageYearly] = useState(false);
  const [isPackageMonthly, setIsPackageMonthly] = useState(false);

  const availableLanguages = [
    'English', 'Spanish', 'French', 'German', 'Hindi', 'Bengali', 'Telugu',
    'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Malayalam', 'Kannada', 'Odia',
    'Punjabi', 'Assamese', 'Maithili', 'Sanskrit', 'Konkani', 'Nepali', 
    'Manipuri', 'Sindhi', 'Dogri', 'Kashmiri', 'Bodo'
  ];

  useEffect(() => {
    const backAction = () => {
       return true; 
    };

    // Add event listener for hardware back press
    BackHandler.addEventListener('hardwareBackPress', backAction);

    // Cleanup the event listener when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const handleApply = () => {
  
    // Prepare params object dynamically based on selected filters
    const params = {};
  
    if (yogaTherapistChecked) {
      params.yogaTherapistChecked = yogaTherapistChecked;
    }
  
    if (priceRange) { // Assuming 5000 is the default maximum price
      params.price = priceRange; // Use the maximum value in the range
    }
    if (certification !== 'no') { // Only include if certification is changed from default
      params.certification = certification;
    }
    if (selectedLanguages) { // Only include if any language is selected
      params.language = selectedLanguages;
    }
    if (isSessionPersonal) { // Only include if personal session is selected
      params.isPersonal = isSessionPersonal;
    }
    if (isSessionGroup) { // Only include if group session is selected
      params.isGroup = isSessionGroup;
    }
    if (isPackageYearly) { // Only include if yearly package is selected
      params.weekly = isPackageYearly;
    }
    if (isPackageMonthly) { // Only include if monthly package is selected
      params.monthly = isPackageMonthly;
    }
  
    params.experience = ageRange; 
  
  
    // Navigate with filtered params
    navigation.navigate('Index', { filterParams: params });
  };
  

  const handleReset = () => {
    setYogaTherapistChecked(false);
    setAgeRange(0);
    setPriceRange([0, 100]);
    setCertification('no');
    setSelectedLanguages('');
    setLanguageFilter('');
    setIsSessionPersonal(false);
    setIsSessionGroup(false);
    setIsPackageYearly(false);
    setIsPackageMonthly(false);
    ToastAndroid.show('Filter Reset Successfully', ToastAndroid.SHORT);

  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguages(language); // Set the selected language
    setLanguageFilter(''); // Clear the filter
  };

  const handleRemoveLanguage = (language) => {
    setSelectedLanguages(selectedLanguages.filter((item) => item !== language));
  };

  const handleCheckboxChange = (language) => {
    if (selectedLanguages.includes(language)) {
      handleRemoveLanguage(language);
    } else {
      handleLanguageSelect(language);
    }
  };

  const handleClose = () => {
    navigation.navigate('Index');

  };

  return (
    <Provider>
        <View style={styles.mainContainer}>
          <View style={{ paddingTop: 20 }}>
          <CustomHeader title="Filter" onClose={handleClose} />
          </View>
          <ScrollView>
          <View style={styles.container}>
            {/* <CategoryBox text="Location">
              <View style={stylesdetail.inputContainer}>
                <TextInput placeholder="Enter Location" style={styles.searchInput} editable={true} />
              </View>
            </CategoryBox>
            <CategoryBox text="Work Type">
              <CheckboxWithLabel
                label="Yoga Therapist"
                isChecked={yogaTherapistChecked}
                onChange={setYogaTherapistChecked}
              />
            </CategoryBox> */}
            <CategoryBox text="Experience">
              <View style={styles.sliderContainer}>
                <Text style={{fontFamily:'Poppins',fontSize:12}}>Age Range: {ageRange} years</Text>
                <View style={{width:'100%'}}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={20}
                  step={1}
                  value={ageRange}
                  onValueChange={(value) => setAgeRange(value)}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.primary}
                  thumbTintColor={COLORS.primary}
                />
                </View>
              </View>
            </CategoryBox>
            <CategoryBox text="Certification">
              <View style={styles.radioContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.radioOption, { marginLeft: 0 }]}>
                    <RadioButton
                      value="yes"
                      status={certification === 'yes' ? 'checked' : 'unchecked'}
                      onPress={() => setCertification('yes')}
                      color={COLORS.primary}
                    />
                    <Text style={styles.radioLabel}>Yes</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton
                      value="no"
                      status={certification === 'no' ? 'checked' : 'unchecked'}
                      onPress={() => setCertification('no')}
                      color={COLORS.primary}
                    />
                    <Text style={styles.radioLabel}>No</Text>
                  </View>
                </View>
              </View>
            </CategoryBox>
            <CategoryBox text="Price">
              <View style={styles.sliderContainer}>
                <Text style={{fontFamily:'Poppins',fontSize:12}}>Price Range : ₹{priceRange[0]}</Text>
              <MultiSlider
  values={priceRange}
  sliderLength={280}
  onValuesChange={(values) => {
    const lastValue = values[values.length - 1]; // Get the last value (max value of the range)
    setPriceRange([lastValue]); // Set only the max value in the price range
  }}
  min={100}
  max={5000}
  step={1}
  selectedStyle={{
    backgroundColor: COLORS.primary,
    marginLeft: 12,
  }}
  unselectedStyle={{
    backgroundColor: '#d3d3d3',
  }}
  markerStyle={{
    backgroundColor: COLORS.primary,
    marginLeft: 12,
  }}
/>

              </View>
            </CategoryBox>
            <CategoryBox text="Language">
           
            <SelectList
          setSelected={handleLanguageSelect}
          data={availableLanguages}
          save="value"
          fontFamily='Poppins'
          placeholder="Select Language"
        />
            </CategoryBox>
            <CategoryBox text="Session Offered">
              <CheckboxWithLabel
                label="Personal"
                isChecked={isSessionPersonal}
                onChange={setIsSessionPersonal}
              />
              <CheckboxWithLabel
                label="Group"
                isChecked={isSessionGroup}
                onChange={setIsSessionGroup}
              />
            </CategoryBox>
            {/* <CategoryBox text="Package Type">
              <CheckboxWithLabel
                label="Yearly"
                isChecked={isPackageYearly}
                onChange={setIsPackageYearly}
              />
              <CheckboxWithLabel
                label="Monthly"
                isChecked={isPackageMonthly}
                onChange={setIsPackageMonthly}
              />
            </CategoryBox> */}
            </View>
           
            </ScrollView>
            </View>
            <View style={styles.fixedButtonContainer}>
           <TouchableOpacity style={styles.button} onPress={handleApply}>
           <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
         
     
     
    </Provider>
  );
};

// export default HomeTutorSearch;

const CheckboxWithLabel = ({ label, isChecked, onChange }) => (
  <TouchableOpacity onPress={() => onChange(!isChecked)} style={styles.checkboxContainer}>
    <Checkbox status={isChecked ? 'checked' : 'unchecked'} onPress={() => onChange(!isChecked)} color={COLORS.primary} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);


const stylesdetail = StyleSheet.create({
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    // height: windowHeight / 15,
    borderColor: '#E3E5E5',
    borderWidth: 1,
    marginVertical:10,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
    fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  boxContainer: {
    marginVertical: 10,
    // padding: 10,
    borderColor:'#eee',
    borderWidth:1,
    paddingVertical:10,
    paddingHorizontal:10,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  header: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  medtext: {
    fontSize: 16,
    fontFamily:'Poppins-Medium',
  //  color: '#333',
  },
  searchInput: {
    // height: 40,
    fontSize: 14,
    fontFamily:'Poppins',
    margin:5,
    marginLeft:12,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    marginVertical: 10,
  },
  slider: {
    // width: '100%',
    height: 40,
    
  },
  radioContainer: {
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  radioLabel: {
    fontSize: 14,
    fontFamily:'Poppins'
  },
  menuContent: {
    backgroundColor: '#fff',
    padding: 0,
    marginTop:20,
    borderRadius: 10,
    maxHeight: 300,
  },
  menuStyle: {
    width: '90%',
    paddingLeft:20
  },
  menuSearchContainer: {
    padding: 10,
  },
  menuSearchInput: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    paddingLeft: 10,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    fontFamily:'Poppins'
  },
  selectedLanguagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  languageTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 5,
  },
  languageTabText: {
    color: '#fff',
    fontFamily:'Poppins'
  },
  closeButton: {
    margin: 0,
    padding: 0,
    color:'#fff'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily:'Poppins-Medium'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,

  },
  checkbox: {
    // marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily:'Poppins'
  },
  closeButtons :{
    padding:10
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      // elevation: 0.1,
      paddingHorizontal: 15,
      marginTop: 20,
      marginHorizontal:10,
  //  paddingBottom: 10,
   justifyContent:'space-between'

  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium', // Use your preferred font family
    color: 'black',
  },

});

export default HomeTutorSearch;
