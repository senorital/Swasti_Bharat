import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomDropdown = ({
  data = [],
  selectedItems = [],
  onSelect,
  placeholder = 'Select an option',
  error = null,
  styles = {},
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSelect = (id) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <View>
      <Text style={styles.label}>
        Select your Languages <Text style={{ color: 'red' }}>*</Text>
      </Text>

      {/* Touchable TextInput */}
      <TouchableOpacity onPress={toggleDropdown}>
        <TextInput
          value={selectedItems.length > 0 ? `${selectedItems.length} selected` : ''}
          editable={false}
          style={styles.textInput}
          placeholder={placeholder}
        />
      </TouchableOpacity>

      {/* Dropdown List */}
      {showDropdown && (
        <View
          style={[
            styles.dropdownContainer,
            error ? styles.errorBorder : styles.defaultBorder,
          ]}
        >
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemContainer,
                { backgroundColor: selectedItems.includes(item.id) ? '#E0F7FA' : '#FFF' },
              ]}
              onPress={() => handleSelect(item.id)}
            >
              <View style={styles.itemTextContainer}>
                {selectedItems.includes(item.id) && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="blue"
                    style={styles.tickIcon}
                  />
                )}
                <Text
                  style={{
                    color: selectedItems.includes(item.id) ? 'blue' : '#000',
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomDropdown;
