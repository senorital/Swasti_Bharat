import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  BackHandler,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";
import Header from "../../../../components/header/Header";
import { COLORS, icons } from "../../../../components/constants";
import { getYogaForCategory } from "../../../../redux/actions/user/authActions";

const CategoryCard = ({ text1, text2, path, navigation, image, style }) => {
  const handlePress = () => {
    if (text1) {
      navigation.navigate("CategoryDetail", { category: text1 });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.cardContainer, style]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.categoryImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.categoryText}>{text1}</Text>
        <Text style={styles.smallText}>{text2}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Category = ({ navigation }) => {
  const [yogaCategories, setYogaCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchYogaCategories = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getYogaForCategory());
      setYogaCategories(response.data); // Assuming response.data contains the categories
      setFilteredCategories(response.data); // Set filtered data initially to the full data
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYogaCategories();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredCategories(yogaCategories); // Reset to full list when search is empty
    } else {
      const filtered = yogaCategories.filter((item) =>
        item.yogaFor.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const renderCategory = ({ item, index }) => {
    const isEvenCard = (index + 1) % 2 === 0;

    return (
      <CategoryCard
        text1={item.yogaFor}
        text2={item.description}
        image={item.path}
        path={item.path}
        navigation={navigation}
        style={isEvenCard ? { marginLeft: 14 } : null}
      />
    );
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

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor={COLORS.user_front_theme_color} />
      <View style={{ paddingTop: 20 }}>
        <Header title="Explore Categories" icon={icons.back} />
      </View>
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput
          placeholder="Search Categories"
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        ) : (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    fontFamily:'Poppins',
    marginBottom: 10,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
  },
  imageContainer: {
    width: "100%",
    height: 100,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 8,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: "Poppins",
    marginHorizontal: 5,
  },
  smallText: {
    fontSize: 10,
    color: "grey",
    fontFamily: "Poppins",
    marginHorizontal: 5,
  },
});

export default Category;
