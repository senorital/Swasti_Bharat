import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper'; // Ensure you have react-native-paper installed
import { COLORS } from '../../components/constants';
import Header from '../../components/header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch,useSelector } from 'react-redux';
import {getUserInstructor} from "../../redux/actions/auth/auth";
import { StatusBar } from 'expo-status-bar';
const Role = ({navigation}) => {
    const [selectedRole, setSelectedRole] = useState(null); // Track selected role

  const dispatch = useDispatch();

  const handleRoleSelect = async (role) => {
    try {
      // Log and set selected role
      console.log("handleRoleSelect: " + role);
      const selectedRole = role === "true" ? "Instructor" : "User";
      setSelectedRole(selectedRole);
      console.log('Selected Role: ' + selectedRole);
      
      // Create role data object
      const roleData = { isInstructor: role }; // Convert string to boolean
      console.log("Form Data being sent:", JSON.stringify(roleData, null, 2));
      
      // Call API and await response
      const response = await dispatch(getUserInstructor(roleData)); // Await and store response
       if (response.success == true) {
        await AsyncStorage.setItem("userRole", role);
        console.log("Roles screen :" + role)
        navigation.navigate("appStack", { role : role });

        console.log("Role stored in AsyncStorage.");

        // closeBottomSheet(); 
      }
      
     
  
    } catch (error) {
      console.error("Error in handleRoleSelect:", error);
    }
  };
  return (
    <View style={styles.container}>
     <StatusBar backgroundColor={COLORS.user_front_theme_color} style="dark" />

    <View style={{paddingTop:15}}>
      <Header
        title={"Select Your Role"}
        icon={require("../../assets/back.png")}
      />
      </View>
      <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How would you like to get started with Swasti Bharat ?</Text>

            <TouchableOpacity
              style={styles.card}
              onPress={() => handleRoleSelect("false")}
            >
              <View style={styles.radioContainer}>
                <RadioButton
                  value="User"
                  status={selectedRole === "User" ? "checked" : "unchecked"}
                  onPress={() => handleRoleSelect("false")}
                  color={COLORS.primary} // Customize the color
                />
                <View style={styles.textContainer}>
                <Text style={styles.cardText}>User</Text>
                <Text style={styles.subText}>For personal use or individual learning</Text> 
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => handleRoleSelect("true")}
            >
              <View style={styles.radioContainer}>
                <RadioButton
                  value="Instructor"
                  status={selectedRole === "Instructor" ? "checked" : "unchecked"}
                  onPress={() => handleRoleSelect("true")}
                  color={COLORS.primary} // Customize the color
                />
                <View style={styles.textContainer}>
                <Text style={styles.cardText}>Instructor</Text>
                <Text style={styles.subText}>For professionals offering courses or guidance</Text> 
                </View>
              </View>
            </TouchableOpacity>
          </View>
    </View>

  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#f8f8f9",
      },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    // borderRadius: 8,
    // elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
   fontFamily:'Poppins-Medium',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.user_front_theme_color,
    elevation: 2,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily:'Poppins-Medium'
  },
  subText: {
    fontSize: 12,
    color: '#000',
    width:'80%',
    fontFamily:'Poppins-Light'
  },
});

export default Role;
