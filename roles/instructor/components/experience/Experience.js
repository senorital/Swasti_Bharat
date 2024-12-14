import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Alert,
  ToastAndroid,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import CustomHeader from "../../../../components/CustomHeader/CustomHeader";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../../../../components/constants";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { useFocusEffect } from "@react-navigation/native";
import { deleteExperience } from "../../../../redux/actions/instructor/experience/experience";

const Experience = ({ navigation }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To check if more data exists
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  const fetchData = async (pageNumber = 1) => {
    try {
      setLoading(pageNumber === 1); 
      setLoadingMore(pageNumber > 1); 
      const res = await dispatch(getInstructor(pageNumber)); // Assuming your API supports pagination
      const fetchedData = res.data.data.experience;
      
      if (pageNumber === 1) {
        setData(fetchedData); // Set the initial data
      } else {
        setData((prevData) => [...prevData, ...fetchedData]); // Append new data
      }

      if (fetchedData.length < 10) { 
        setHasMore(false); 
      } else {
        setHasMore(true); 
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false); 
    }
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
    const month = parseInt(dateParts[1], 10) - 1;
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

  const handleDeletePress = async (id) => {
    try {
      const res = await dispatch(deleteExperience(id));
      if (res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        fetchData(); // Re-fetch the data after deleting
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prevPage) => {
        const newPage = prevPage + 1;
        fetchData(newPage); // Fetch the next page
        return newPage;
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1); // Reset page to 1 when refreshing
    fetchData(1); // Fetch data from the first page
  };

  const renderFooter = () => {
    return loadingMore ? (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    ) : null;
  };

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
        <View style={styles.shimmerContainer}>
          {[...Array(3)].map((_, index) => (
            <ShimmerPlaceHolder
              key={index}
              style={styles.shimmerPlaceholder}
            />
          ))}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={styles.cardContainer}
              onPress={() => handlePress(item.id)}
            >
              <View
                style={[
                  styles.rightContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyText}>{item.workHistory}</Text>
                  <Text style={styles.dateText}>{item.department}</Text>
                  <View style={styles.dateTimeContainer}>
                    <FontAwesome5
                      name="dot-circle"
                      size={15}
                      color={COLORS.primary}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={styles.dateText}>
                      {formatDate(item.joinDate)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => handlePress(item.id)}>
                  <Image
                    style={styles.editIcon}
                    source={require("../../../../assets/icons/edit.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showAlert(item.id)}
                  style={styles.editButton}
                >
                  <Image
                    style={styles.editIcon}
                    source={require("../../../../assets/icons/delete.png")}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    marginHorizontal: 20,
  },
  shimmerPlaceholder: {
    width: "100%",
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  footer: {
    padding: 10,
    alignItems: "center",
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
    tintColor: COLORS.primary,
  },
  editButton: {
    marginLeft: 12,
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
    padding: 12,
    fontFamily: "Poppins",
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
