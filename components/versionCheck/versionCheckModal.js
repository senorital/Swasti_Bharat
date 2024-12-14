import React from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../button/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

const VersionCheckModal = ({ isVisible, onClose, onUpdate }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Required</Text>
          <Text style={styles.modalMessage}>Please update the app to the Latest version.</Text>
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={onUpdate} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 18,
    borderColor:COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1
  },
  modalTitle: {
    fontSize: 18,
    textAlign:'left',
    fontFamily: 'Poppins-Medium',
    marginTop: 10, // Adjust for spacing with close button
  },
  modalMessage: {
    marginTop: 5,
    fontSize: 15,
    fontFamily: 'Poppins',
    justifyContent:'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:'50%',
    justifyContent:'flex-end'
  },
});

export default VersionCheckModal;
