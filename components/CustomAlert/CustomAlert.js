import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../components/constants';

const CustomAlertModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Hold on!</Text>
          <Text style={styles.modalMessage}>Are you sure you want to go back?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontFamily:'Poppins_Medium',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    marginBottom: 20,
    fontFamily:'Poppins'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 5,
    width:100,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign:'center',
    fontFamily:'Poppins'
  },
});

export default CustomAlertModal;
