import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Header from "../../../../components/header/Header";
import { COLORS } from "../../../../components/constants";

const Class = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "upcoming", title: "Upcoming" },
    { key: "past", title: "Past" },
  ]);

  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 1, title: "Math Class", time: "10:00 AM", avatars: [], numStudents: 5 },
    // Add more upcoming classes here
  ]);

  const [pastClasses, setPastClasses] = useState([
    { id: 2, title: "Science Class", time: "2:00 PM", avatars: [], numStudents: 8 },
    // Add more past classes here
  ]);

  const handleStartClass = (classId) => {
    // Functionality to start the class with the given ID
  };

  const handleBookClass = () => {
   
    navigation.navigate('Index')
  };


  const renderClassList = (classes, noClassesCallback) => {
    if (classes.length < 2) {
      return (
        <View style={styles.noClassesContainer}>
          {noClassesCallback()}
        </View>
      );
    }
  
    return classes.map((cls) => (
      <View key={cls.id} style={styles.cardContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.historyText}>{cls.title}</Text>
          <Text style={styles.timeText}>{cls.time}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={styles.avatarsContainer}>
              {cls.avatars.map((avatar, index) => (
                <Image
                  key={index}
                  source={avatar}
                  style={[styles.avatar, index !== 0 && { marginLeft: -15 }]}
                />
              ))}
              <Text style={styles.studentsText}>+{cls.numStudents} Students</Text>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => handleStartClass(cls.id)}
            >
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };
 // Define different callbacks for "no classes found"
const noUpcomingClassesCallback = () => (
  <View style={styles.noClassesBox}>
  <Text style={styles.noClassesText}>You don't have any class scheduled</Text>
   <TouchableOpacity style={styles.bookButton} onPress={handleBookClass}>
    <Text style={styles.bookButtonText}>Get Enroll in Course</Text>
  </TouchableOpacity>
</View>
);

const noPastClassesCallback = () => (
<View style={styles.noClassesBox}>
  <Text style={styles.noClassesText}>You don't have any class scheduled</Text>
   <TouchableOpacity style={styles.bookButton} onPress={handleBookClass}>
    <Text style={styles.bookButtonText}>Schedule 1-on-1 session</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.bookButton} onPress={handleBookClass}>
    <Text style={styles.bookButtonText}>Schedule Group Class</Text>
  </TouchableOpacity>
</View>
);

// Updated Routes
const UpcomingRoute = () => (
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{ flex: 1 }}>{renderClassList(upcomingClasses, noUpcomingClassesCallback)}</View>
  </ScrollView>
);

const PastRoute = () => (
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{ flex: 1 }}>{renderClassList(pastClasses, noPastClassesCallback)}</View>
  </ScrollView>
);
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 20 }}>
        <Header title={"My Classes"} icon={require("../../../../assets/back.png")} />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          upcoming: UpcomingRoute,
          past: PastRoute,
        })}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  noClassesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noClassesBox: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderColor:COLORS.black,
    borderStyle:'dashed',
    borderWidth:1,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  noClassesText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },
  cardContainer: {
    margin: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  leftContainer: {
    flex: 1,
  },
  historyText: {
    fontSize: 16,
    fontFamily:'Poppins'
  },
  bookButton: {
    backgroundColor: COLORS.user_front_theme_color,
    borderRadius: 8,
  
    paddingVertical:10,
    paddingHorizontal: 50,
    marginTop:10
  },
  bookButtonText: {
    color: "#000",
    fontSize: 13,
    width:'100%',
    fontFamily: "Poppins-Medium",
  },
  timeText: {
    fontSize: 14,
    color: "#555",
  },
  avatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  studentsText: {
    fontSize: 14,
    marginLeft: 10,
    color: "#555",
  },
  startButton: {
    backgroundColor: "#4caf50",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabBar: {
    backgroundColor: "#f9f9f9",
    marginHorizontal:20,
    borderRadius:8
  },
  tabLabel: {
    fontSize: 14,
    color: "#000",
    fontFamily:'Poppins-Medium',
    textTransform:'capitalize'
  },
  indicator: {
    backgroundColor: COLORS.primary,
    height: 2,
    
   
  },
});

export default Class;
