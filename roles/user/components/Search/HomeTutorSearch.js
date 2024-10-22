import React, { useState } from 'react';
import { View, Text, StyleSheet,TextInput, TouchableOpacity, Platform, UIManager, ScrollView, FlatList } from 'react-native';
import { Menu, Provider, TextInput as PaperTextInput, IconButton, Checkbox, RadioButton } from 'react-native-paper';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Header from '../../../../components/header/Header';
import { StatusBar } from 'expo-status-bar';
import { windowHeight, windowWidth } from '../../../../utils/Dimensions';
import Slider from '@react-native-community/slider';

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

const HomeTutorSearch = ({ route }) => {
  const [yogaTherapistChecked, setYogaTherapistChecked] = useState(false);
  const [ageRange, setAgeRange] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [certification, setCertification] = useState('no');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const [languageFilter, setLanguageFilter] = useState('');

  const availableLanguages = ['English', 'Spanish', 'French', 'German'];

  const handleApply = () => {
    console.log('Apply filters');
  };

  const handleReset = () => {
    setYogaTherapistChecked(false);
    setAgeRange(0);
    setPriceRange([0, 100]);
    setCertification('no');
    setSelectedLanguages([]);
    setLanguageFilter('');
  };

  const handleLanguageSelect = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language]);
    }
    setLanguageMenuVisible(false);
    setLanguageFilter('');
  };

  const handleRemoveLanguage = (language) => {
    setSelectedLanguages(selectedLanguages.filter(item => item !== language));
  };

  const handleCheckboxChange = (language) => {
    if (selectedLanguages.includes(language)) {
      handleRemoveLanguage(language);
    } else {
      handleLanguageSelect(language);
    }
  };

  return (
    <Provider>
      <ScrollView>
        <View style={styles.mainContainer}>
          <StatusBar backgroundColor="#fff" />

          <Header title={'Filter Options'} icon={'x'} />
          <View style={styles.container}>
            <CategoryBox text="Location">
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
            </CategoryBox>
            <CategoryBox text="Experience">
              <View style={styles.sliderContainer}>
                <Text>Age Range: {ageRange} years</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={20}
                  step={1}
                  value={ageRange}
                  onValueChange={(value) => setAgeRange(value)}
                  minimumTrackTintColor="#FC9C45"
                  maximumTrackTintColor="#FC9C45"
                  thumbTintColor="#FC9C45"
                />
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
                      color="#FC9C45"
                    />
                    <Text style={styles.radioLabel}>Yes</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton
                      value="no"
                      status={certification === 'no' ? 'checked' : 'unchecked'}
                      onPress={() => setCertification('no')}
                      color="#FC9C45"
                    />
                    <Text style={styles.radioLabel}>No</Text>
                  </View>
                </View>
              </View>
            </CategoryBox>
            <CategoryBox text="Price">
              <View style={styles.sliderContainer}>
                <Text>Price Range: ${priceRange[0]} - ${priceRange[1]}</Text>
                <MultiSlider
                  values={priceRange}
                  sliderLength={280}
                  onValuesChange={(values) => setPriceRange(values)}
                  min={0}
                  max={100}
                  step={1}
                  selectedStyle={{
                    backgroundColor: "#FC9C45",
                  }}
                  unselectedStyle={{
                    backgroundColor: "#d3d3d3",
                  }}
                  markerStyle={{
                    backgroundColor: "#FC9C45",
                  }}
                />
              </View>
            </CategoryBox>
            <CategoryBox text="Language">
              {/* <View style={styles.container}> */}
                <Menu
                  visible={languageMenuVisible}
                  onDismiss={() => setLanguageMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setLanguageMenuVisible(true)}>
                      <PaperTextInput
                        label="Select Language"
                        value={languageFilter}
                        mode="outlined"
                        theme={{
                          roundness: 10,
                          colors: {
                            primary: '#FC9C45',
                            placeholder: '#A9A9A9',
                          },
                        }}
                        style={styles.searchInput}
                        underlineColor="transparent"
                        editable={false}
                      />
                    </TouchableOpacity>
                  }
                  contentStyle={styles.menuContent}
                  style={styles.menuStyle} // Added style for the menu width
                >
                  <View style={styles.menuSearchContainer}>
                    <TextInput
                      placeholder="Search..."
                      value={languageFilter}
                      onChangeText={(text) => setLanguageFilter(text)}
                      style={styles.menuSearchInput}
                    />
                  </View>
                  <FlatList
                    data={availableLanguages.filter((language) =>
                      language.toLowerCase().includes(languageFilter.toLowerCase())
                    )}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <Menu.Item
                        onPress={() => handleCheckboxChange(item)}
                        title={
                          <View style={styles.menuItemContent}>
                            <Checkbox
                              status={selectedLanguages.includes(item) ? 'checked' : 'unchecked'}
                              onPress={() => handleCheckboxChange(item)}
                              color="#FC9C45"
                            />
                            <Text>{item}</Text>
                          </View>
                        }
                        style={styles.menuItem}
                      />
                    )}
                  />
                </Menu>
                <View style={styles.selectedLanguagesContainer}>
                  {selectedLanguages.map((language) => (
                    <View key={language} style={styles.languageTab}>
                      <Text style={styles.languageTabText}>{language}</Text>
                      <IconButton
                        icon="close"
                        color="#fff"
                        size={16}
                        onPress={() => handleRemoveLanguage(language)}
                        style={styles.closeButton}
                      />
                    </View>
                  ))}
                </View>
              {/* </View> */}
            </CategoryBox>
            <CategoryBox text="Session Offered">
              <View style={{ flexDirection: 'row' }}>
                <CheckboxWithLabel
                  label="Personal"
                  isChecked={yogaTherapistChecked}
                  onChange={setYogaTherapistChecked}
                />
                <CheckboxWithLabel
                  label="Group"
                  isChecked={yogaTherapistChecked}
                  onChange={setYogaTherapistChecked}
                />
              </View>
            </CategoryBox>
            <CategoryBox text="Package Type">
              <View style={{ flexDirection: 'row' }}>
                <CheckboxWithLabel
                  label="Yearly"
                  isChecked={yogaTherapistChecked}
                  onChange={setYogaTherapistChecked}
                />
                <CheckboxWithLabel
                  label="Monthly"
                  isChecked={yogaTherapistChecked}
                  onChange={setYogaTherapistChecked}
                />
              </View>
            </CategoryBox>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleApply}>
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
};

const CheckboxWithLabel = ({ label, isChecked, onChange }) => (
  <TouchableOpacity onPress={() => onChange(!isChecked)} style={styles.checkboxContainer}>
    <Checkbox status={isChecked ? 'checked' : 'unchecked'} onPress={() => onChange(!isChecked)} color="#FC9C45" />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);


const stylesdetail = StyleSheet.create({
  inputContainer: {
    width: '90%',
    backgroundColor: '#fff',
    height: windowHeight / 15,
    borderColor: '#E3E5E5',
    borderWidth: 1,
    margin: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  boxContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  medtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    marginVertical: 10,
  },
  slider: {
    width: '100%',
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
    fontSize: 16,
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
  },
  selectedLanguagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  languageTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FC9C45',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 5,
  },
  languageTabText: {
    color: '#fff',
    marginRight: 5,
  },
  closeButton: {
    margin: 0,
    padding: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#FC9C45',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default HomeTutorSearch;
