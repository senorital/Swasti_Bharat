// src/components/Index.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet,ActivityIndicator,TouchableOpacity,BackHandler } from 'react-native';
import Cards from './Cards';
import Toast from 'react-native-toast-message';
import { styles } from '../style';
import Icon from 'react-native-vector-icons/Feather';
import SearchResult from '../Search/SearchResult';
import { Ionicons } from '@expo/vector-icons';
import HomeTutorSearch from '../Search/HomeTutorSearch';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeTutor } from '../../../../redux/actions/user/homeTutor/homeTutor';
import { COLORS } from '../../../../components/constants';
const Index = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);


  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        // Check if the current screen is focused
        navigation.goBack(); // Go back if the current screen is focused
        return true; // Prevent default behavior (exiting the app)
      }
      return false; // If not focused, allow default behavior (exit the app)
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(getHomeTutor());
        console.log(res)
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        const msg = error.response.data.message;
        Toast.show({
          type: "error",
          text1: msg,
          visibilityTime: 2000,
          autoHide: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleFilterPress = () => {
    navigation.navigate(HomeTutorSearch);
  };

  const renderTutor = ({ item }) => (
    <Cards tutor={item} />
  );

  const CustomHeader = ({ title, subtitle,icon }) => {
    return (
        <View>
        <View style={stylesx.header}>

         <TouchableOpacity style={stylesx.backBtn} onPress={() => navigation.goBack()}>
          <Icon name={icon} size={25} color={'#573353'} />
          </TouchableOpacity>
          <View style={{marginLeft:12}}>
         <Text style={stylesx.title}>{title}</Text>
         <Text style={styles.vsmalltext}>{subtitle}</Text>
         </View>

        </View>

        </View>
    );
}

  return (
    <View style={[styles.mainContainer,{marginTop:0}]}>
        <StatusBar backgroundColor={COLORS.primary} style="light" />
        <CustomHeader title={"Explore Home Tutor"}  subtitle = {"Wide range of yoga experts"} icon="chevron-left"  />
      <View style={[styles.container]}>
        <View style={[styles.inputContainer]}>
          <View style={[styles.input, { flex: 1, flexDirection: 'row', backgroundColor: '#fff' }]}>
            <View style={{ marginRight: 10 }}>
              <Ionicons name="search" size={24} color="grey" />
            </View>
            <TextInput placeholder="Search Here" style={{ fontSize: 17 }} />
          </View>
          <View style={styles.filterIcon}>
            <Ionicons
              name="filter"
              size={24}
              color="#FC9D45"
              onPress={handleFilterPress}
            />
          </View>
        </View>
      </View>
      {loading ? (
        <View style={stylesx.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : data.length === 0 ? ( // Check if no data found
        <View style={stylesx.noResultsContainer}>
          <Text style={stylesx.noResultsText}>No results found</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderTutor}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default Index;

const stylesx = StyleSheet.create({
  header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 0.1,
      // paddingLeft: 10,
      marginTop: 50,
   paddingBottom: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
      marginLeft:20,
      marginBottom:20
  },
  title: {
      fontSize: 20,
      marginRight:20,
      fontFamily: 'Poppins-SemiBold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#888',
    fontFamily:'Poppins',
    textAlign: 'center',
  },
  
});