// src/components/Index.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList,BackHandler, StyleSheet,ActivityIndicator,TouchableOpacity } from 'react-native';
import Cards from '../Card';
import Toast from 'react-native-toast-message';
import { styles } from '../style';
import SearchResult from '../Search/SearchResult';
import { Ionicons } from '@expo/vector-icons';
import HomeTutorSearch from '../Search/HomeTutorSearch';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeTutor } from '../../../../redux/actions/user/homeTutor/homeTutor';
import { COLORS} from '../../../../components/constants';
import {icons} from '../../../../components/constants';
import Header from '../../../../components/header/Header';
const CategoryDetail = ({ navigation,route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const {category} = route.params;
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

  const renderTutor = ({ item }) => (
    <Cards tutor={item} />
  );



  return (
    <View style={[styles.mainContainer,{marginTop:0}]}>
        <StatusBar backgroundColor={COLORS.primary} style="light" />
        <View style={{ paddingTop: 20 }}>
        <Header title={category} icon={icons.back} />
      </View>
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
              color={COLORS.primary}
              onPress={handleFilterPress}
            />
          </View>
        </View>
      </View>
      {loading ? (
        <View style={stylesx.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : data.length === 0 ? ( // Check if data is empty
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

export default CategoryDetail;

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
    textAlign: 'center',
  },
});