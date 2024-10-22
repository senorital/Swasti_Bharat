import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  BackHandler,Alert,
  ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomHeader from "../../../../components/CustomHeader/CustomHeader";
import { useDispatch } from "react-redux";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import { COLORS, icons } from "../../../../components/constants";
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";
import { deleteQualification } from "../../../../redux/actions/instructor/qualification/qualification";

const Qualification = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getInstructor());
      console.log(res);
      setData(res.data.data.qualifications);
    } finally {
      setLoading(false);
    }
  };



  const handleQualificationPress = (qualificationId) => {
    navigation.navigate("QualificationDetails", { id: qualificationId });
  };

  const handleDeletePress = async (qualificationId) => {
    try {
      const res = await dispatch(deleteQualification(qualificationId));
      console.log(res);
      if (res.success) {
        // Toast.show({
        //   type: "success",
        //   text1: res.message,
        //   visibilityTime: 2000,
        //   autoHide: true,
        // });
        ToastAndroid.show(res.message,ToastAndroid.SHORT);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      const msg = error.response.data.message;
      // Toast.show({
      //   type: "error",
      //   text1: msg || "An error occurred. Please try again.",
      //   visibilityTime: 2000,
      //   autoHide: true,
      // });
      ToastAndroid.SHORT('An error occurred. Please try again.')

    }
  };

  const handleEditPress = (qualificationId) => {
    // Add logic for edit action here
    navigation.navigate("EditQualification", { id: qualificationId });

    console.log("Edit qualification with ID:", qualificationId);
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, [dispatch]);
  
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


  const showAlert = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeletePress(id),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <CustomHeader
          title="Qualification"
          icon={icons.back}
          buttonText="Add New"
          destination="AddQualification"
        />
      </View>
      <ScrollView>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : data.length > 0 ? (
        <>
          {data.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.cardContainer}
              // onPress={() => handleQualificationPress(cls.id)}
            >
              {/* <View style={{flexDirection:'row',justifyContent:'space-between'}}> */}
              <View style={[styles.rightContainer,{flexDirection:'row',justifyContent:'space-between'}]}>
                <View style={styles.textContainer}>
                  <Text style={styles.historyText}>{cls.course}</Text>
                  <Text style={styles.dateText}>{cls.institute_collage + `(` + cls.university_name + `)`}</Text>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateText}>{cls.year}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleEditPress(cls.id)} style={styles.editButton}>
                  <Image
                    style={styles.editIcon}
                    source={icons.edit} 
                  />
                </TouchableOpacity>
                <TouchableOpacity   onPress={() => showAlert(cls.id)}
              style={styles.editButton}>
                  <Image
                    style={styles.editIcon}
                    source={icons.deletes} 
                  />
                </TouchableOpacity>
              </View>
              {/* </View> */}
            </TouchableOpacity>
          ))}
        </>
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
      </ScrollView>
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
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 10,
    position: "relative", // Make sure card is positioned relative to place the edit icon absolutely
  },

  rightContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    // flex: 1,
  },

  textContainer: {
    flex: 1,
  },

  historyText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.grey,
    fontFamily: "Poppins",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    // padding: 10,
  marginLeft:12
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.primary, // Adjust color as needed
  },
});

export default Qualification;
