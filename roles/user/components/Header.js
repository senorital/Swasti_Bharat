import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';

const   Header = ({ title, icon }) => {
    const navigation = useNavigation();
    return (
        <View>
        <View style={styles.header}>
                <StatusBar style="dark" backgroundColor="#fff" />

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image source={icon} style={styles.back} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            
        </View>

        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    back: {
        width: 20,
        height: 20,
      },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    
        // paddingLeft: 10,
        marginTop: 50,
     paddingBottom: 20
    },
    backBtn: {
        marginLeft:20,
         },
    title: {
        // flex: 1, // Take up remaining space
        fontSize: 18,
        // marginRight:20,
        // marginLeft : 15,
        fontFamily: 'Poppins-SemiBold',
    }
});
