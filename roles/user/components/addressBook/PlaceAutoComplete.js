// PlaceAutocomplete.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// Replace this with your actual API key
const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const PlaceAutocomplete = () => {
  const handleLocationSelect = (data, details) => {
    console.log("Selected Location:", data); // Log the selected location
    console.log("Location Details:", details); // Log additional details if needed
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search by location"
        onPress={handleLocationSelect}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: 'en',
        }}
        fetchDetails={true}
        textInputProps={{
          style: styles.textInput,
        }}
        styles={{
          container: { flex: 0,zIndex:1000 },
          listView: { zIndex: 1000 },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom:30
  },
  textInput: {
    borderColor: "#000",
    borderWidth: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default PlaceAutocomplete;
