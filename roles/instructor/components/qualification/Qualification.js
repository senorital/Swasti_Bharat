import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
  Alert,
  BackHandler,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomHeader from "../../../../components/CustomHeader/CustomHeader";
import { useDispatch } from "react-redux";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import { COLORS, icons } from "../../../../components/constants";
import { useFocusEffect } from "@react-navigation/native";
import { deleteQualification } from "../../../../redux/actions/instructor/qualification/qualification";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const Qualification = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getInstructor());
      setData(res.data.data.qualifications);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  const handleDeletePress = async (qualificationId) => {
    try {
      const res = await dispatch(deleteQualification(qualificationId));
      if (res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);
    }
  };

  const handleEditPress = (qualificationId) => {
    navigation.navigate("EditQualification", { id: qualificationId });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const showAlert = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Ensures the ScrollView takes the full height
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          // Shimmer placeholders for loading
          Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.shimmerCard}>
              <ShimmerPlaceHolder style={styles.shimmerTitle} />
              <ShimmerPlaceHolder style={styles.shimmerSubtitle} />
              <ShimmerPlaceHolder style={styles.shimmerSubtitle} />
            </View>
          ))
        ) : data.length > 0 ? (
          data.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.cardContainer}
              onPress={() => showAlert(cls.id)}
            >
              <View
                style={[
                  styles.rightContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.historyText}>{cls.course}</Text>
                  <Text style={styles.dateText}>
                    {cls.institute_collage + `(` + cls.university_name + `)`} 
                  </Text>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateText}>{cls.year}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleEditPress(cls.id)}
                  style={styles.editButton}
                >
                  <Image style={styles.editIcon} source={icons.edit} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showAlert(cls.id)}
                  style={styles.editButton}
                >
                  <Image style={styles.editIcon} source={icons.deletes} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <View style={styles.imageContainer}>
              <Image style={{ width: 100, height: 100 }} source={icons.imagebg} />
              <Text style={styles.text}>No data found!</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up the full height of the screen
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    position: "relative",
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  historyText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
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
    marginLeft: 12,
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.primary,
  },
  shimmerCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  shimmerTitle: {
    height: 20,
    width: "60%",
    marginBottom: 10,
    borderRadius: 5,
  },
  shimmerSubtitle: {
    height: 15,
    width: "80%",
    marginBottom: 8,
    borderRadius: 5,
  },
  noDataContainer: {
    flex: 1, // Ensures it takes up the entire available space in ScrollView
    justifyContent: "center",
    alignItems: "center",
    height: hp("100%"), // Ensures it fills the full screen height
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Qualification;
