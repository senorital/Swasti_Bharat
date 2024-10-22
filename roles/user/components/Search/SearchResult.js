import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../Header';
import { styles } from '../style';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Filter from '../Courses/Filter';

const SearchResult = ({ route }) => {
  const bottomSheetRef = useRef(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [index, setIndex] = useState(0); // State for current tab index

  // Scenes for TabView
  const FirstRoute = () => (
    <View style={{}}>
      <Filter />
    </View>
  );
  const SecondRoute = () => (
    <View style={{}}><Text>Second Route</Text></View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const handleFilterPress = () => {
    bottomSheetRef.current.expand();
    setBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current.collapse();
    setBottomSheetOpen(false);
  };

  const handleSheetLayout = (height) => {
    setBottomSheetHeight(height);
  };

  const renderTabBar = props => (
    <TabBar
      renderLabel={({ focused, route }) => {
        return (
          <Text
            style={{
              fontSize: 15,
              fontFamily:'Poppins-Medium',
              color: focused ? 'white' : 'black', // White color when focused, black otherwise
              backgroundColor: focused ? '#FC9D45' : 'transparent', // Orange background when focused, transparent otherwise
              paddingHorizontal: 25,
              paddingVertical:5,
              borderRadius: 8
            }}
          >
            {route.title}
          </Text>
        );
      }}
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={[
        styles.tabstyle,
        { backgroundColor: 'white', marginBottom: 4 },
      ]}
    />
  );
  

  return (
    <View style={{ flex:1 }}>
     {/* <Header title={'Search'} icon={'chevron-left'} /> */}

      <View style={[styles.container]}>
        <View style={[styles.input,{width:'100%',backgroundColor:'#fff'}]}>
          <View style={{ marginRight: 10 }}>
            <Ionicons name="search" size={24} color="black" />
          </View>
          <TextInput placeholder="Search Here" style={{ fontSize: 17, flex: 1 }} />
          <Ionicons
            name="filter"
            size={24}
            color="#FC9D45"
            onPress={handleFilterPress}
            style={{}}
          ></Ionicons>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['40%', '50%', '60%']} // Add negative values for upward dragging
        backgroundComponent={({ style }) => (
          <View style={[style, StyleSheet.absoluteFill]} />
        )}
        borderRadius={20}
        onChange={(newIndex) => {
          if (newIndex === -1) {
            setBottomSheetOpen(false);
          } else {
            setBottomSheetOpen(true);
          }
        }}
        onLayout={({ nativeEvent }) => handleSheetLayout(nativeEvent.layout.height)}

      >
        <View style={{
          flex: 1, // Ensure the container expands to fill available space
          backgroundColor: 'white',
          margin: 12,
          padding: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
          <Text style={[styles.medtext, { textAlign: 'center' }]}>Filter</Text>
          <TabView
            navigationState={{ index, routes: [{ key: 'first', title: 'Courses' }, { key: 'second', title: 'Mentors' }] }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: useWindowDimensions().width }}
            renderTabBar={renderTabBar}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default SearchResult;
