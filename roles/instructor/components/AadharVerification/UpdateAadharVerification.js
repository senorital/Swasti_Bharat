import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  ToastAndroid
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "../../../../components/constants";
import { getKYC, addKYC } from "../../../../redux/actions/auth/auth"; // Import addKYC API
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const UpdateAadharVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const [inputs, setInputs] = useState({
    name: user.data.name || "",
    aadharNumber: "",
    address: "",
    isVerify: true

  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isKYCDetailsExist, setIsKYCDetailsExist] = useState(false);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleSave = async () => {
    let valid = true;

    if (!inputs.name) {
      handleError("Name is required", "name");
      valid = false;
    }

    if (!inputs.aadharNumber) {
      handleError("Aadhar Card Number is required", "aadharNumber");
      valid = false;
    }

    if (!inputs.address) {
      handleError("Address is required", "address");
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      setLoading(true);
      const res = await dispatch(addKYC(inputs));
      if (res.success) {
      ToastAndroid.show(res.message, ToastAndroid.SHORT);

        setIsKYCDetailsExist(true);
        navigation.goBack();
      } else {
     ToastAndroid.show(res.message || "Failed to add KYC details.", ToastAndroid.SHORT);

      }
    } catch (error) {
      console.error("Error adding KYC details:", error);
      ToastAndroid.show("An error occurred while adding bank details.", ToastAndroid.SHORT);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchKycDetails = async () => {
      try {
        const res = await dispatch(getKYC());
        if (res.success && res.data) {
          const { name, aadharNumber, address } = res.data;
          setInputs({
            name: name || user.data.name,
            aadharNumber: aadharNumber || "",
            address: address || "",
          });
          setIsKYCDetailsExist(true);
        } else {
          setIsKYCDetailsExist(false);
          console.log("KYC Details" + res.message);

          // Toast.show({
          //   type: "info",
          //   text1: res.message || "No KYC details found.",
          //   visibilityTime: 2000,
          //   autoHide: true,
          // });
        }
      } catch (error) {
        console.error("Error fetching KYC details:", error);
        ToastAndroid.show("An error occurred while adding bank details.", ToastAndroid.SHORT);

      } finally {
        setLoading(false);
      }
    };

    fetchKycDetails();

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
  }, [dispatch, navigation, user.data.name]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"KYC Details"} icon={icons.back} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 10 }}>
              <Input
                value={inputs.name}
                editable={false}
                onFocus={() => handleError(null, "name")}
                label="Name"
                placeholder="Enter Name"
                error={errors.name}
                isRequired={true}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              <Input
                value={inputs.aadharNumber}
                onChangeText={(text) => handleOnchange(text, "aadharNumber")}
                onFocus={() => handleError(null, "aadharNumber")}
                label="Aadhar Card Number"
                placeholder="Enter Aadhar Card Number"
                error={errors.aadharNumber}
                keyboardType="numeric"
                isRequired={true}
              />
              {/* {errors.aadharNumber && <Text style={styles.errorText}>{errors.aadharNumber}</Text>} */}
              <Input
                value={inputs.address}
                style={{ textAlignVertical: "top", paddingTop: 10 }}
                onChangeText={(text) => handleOnchange(text, "address")}
                onFocus={() => handleError(null, "address")}
                label="Address"
                multiline
                numberOfLines={5}
                placeholder="Enter Address"
                error={errors.address}
                isRequired={true}
              />
              {/* {errors.address && <Text style={styles.errorText}>{errors.address}</Text>} */}
            </View>
          </View>
          {!isKYCDetailsExist && (
            <Button
              title="Save"
              onPress={handleSave}
            />
          )}
        </ScrollView>
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
  label: {
    // marginVertical: 5,
    fontSize: 14,
    fontFamily: "Poppins",
  },
  errorText: {
    marginTop: 7,
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontFamily: "Poppins",
    height: 45,
    borderColor: "gray",
  },
  languageList: {
    flexDirection: "row", // Display items horizontally
    flexWrap: "wrap", // Wrap items to next row when needed
  },
  languageItem: {
    margin: 5, // Add some margin between items
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  cameraContainer: {
    width: wp(40),
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    // marginTop: 10,
    backgroundColor: "#fff",
  },
  cameraImage: {
    width: 30,
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  cameraText: {
    fontSize: hp(2),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  pdfContainer: {
    // flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pdfIcon: {
    width: 40,
    height: 40,
  },
  pdfText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpdateAadharVerification;
