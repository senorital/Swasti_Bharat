import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const CustomAlertModal = ({ visible, greeting, boldText, message, onCancel, onOk }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.greeting}>
            {greeting} <Text style={styles.boldText}>{boldText}</Text>
          </Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
          
          
            <TouchableOpacity style={styles.button} onPress={onOk}>
              <Text style={styles.buttonText}>Okay</Text>
            </TouchableOpacity>
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
  alertBox: {
    width: '80%',
    padding: 13,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#000',
  },
  boldText: {
    fontSize: 15,
    fontFamily: 'Poppins_Medium',
    textAlign: 'center',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  buttonRow: {
    width: '100%',
    justifyContent:'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 5,
    borderRadius: 5,
    width: '40%',
    justifyContent:'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});

export default CustomAlertModal;
