import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  BackHandler
} from "react-native";
import CustomHeader from "../../../../components/CustomHeader/CustomHeader";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';

const Experience = ({ navigation }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getInstructor());
      setData(res.data.data.experience);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  function formatDate(dateString) {
    const dateParts = dateString.split("-");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JavaScript
    const year = parseInt(dateParts[2], 10);

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (year === 2024) {
      return `${months[month]}, Present`;
    } else {
      return `${months[month]}, ${year}`;
    }
  }

  const handlePress = (experienceId) => {
    navigation.navigate("EditExperience", { id: experienceId });
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <CustomHeader
          title="Experience"
          icon={icons.back}
          buttonText="Add New"
          destination="AddExperience"
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : data.length > 0 ? (
        data.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            style={styles.cardContainer}
            // onPress={() => handlePress(cls.id)}
          >
            <View style={[styles.rightContainer,{flexDirection:'row',justifyContent:'space-between'}]}>
             <View style={{flex:1}}>
              <Text style={styles.historyText}>{cls.workHistory}</Text>
              <Text style={styles.dateText}>{cls.department}</Text>
              <View style={styles.dateTimeContainer}>
                <FontAwesome5 name="dot-circle" size={15} color={COLORS.primary} style={{marginRight:12}} />
                <Text style={styles.dateText}>
                  {formatDate(cls.joinDate)}
                </Text>
              </View>
              </View>
              <TouchableOpacity  onPress={() => handlePress(cls.id)}  >
                  <Image
                    style={styles.editIcon}
                    source={require("../../../../assets/icons/edit.png")} // Path to your edit icon image
                  />
                </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.content}>
          <View
            style={{
              width: 255,
              height: 255,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "gray",
              backgroundColor: "rgba(212, 220, 219, 0.5)",
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                style={{ width: 100, height: 100 }}
                source={icons.imagebg}
              />
              <Text style={styles.text}>No data found!</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.primary, // Adjust color as needed
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 10,
  },

  rightContainer: {
    // flex: 1,
    padding: 12,
  },

  historyText: {
    fontSize: 14,
    fontFamily: "Poppins_Medium",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Experience;
