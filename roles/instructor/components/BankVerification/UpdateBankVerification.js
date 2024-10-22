import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  BackHandler,ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "../../../../components/constants";
import { getBankDetails, addBankDetails } from "../../../../redux/actions/auth/auth"; // Import addBankDetails API

const UpdateBankVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const [inputs, setInputs] = useState({
    name: user.data.name || "",
    bankName: "",
    IFSCCode: "",
    accountNumber: "",
    isVerify: true

  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [isBankDetailsExist, setIsBankDetailsExist] = useState(false);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleSave = async () => {
    let valid = true;

    if (!inputs.bankName) {
      handleError("Bank Name is required", "bankName");
      valid = false;
    }

    if (!inputs.IFSCCode) {
      handleError("IFSC Code is required", "IFSCCode");
      valid = false;
    }

    if (!inputs.accountNumber) {
      handleError("Account Number is required", "accountNumber");
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      setLoading(true);
      const res = await dispatch(addBankDetails(inputs));
      if (res.success) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);

        setIsBankDetailsExist(true);
        navigation.goBack();

      } else {
          ToastAndroid.show(res.message || "Failed to add bank details.", ToastAndroid.SHORT);

      }
    } catch (error) {
      console.error("Error adding bank details:", error);
      ToastAndroid.show("An error occurred while adding bank details.", ToastAndroid.SHORT);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await dispatch(getBankDetails());
        if (res.success && res.data.length > 0) {
          const { bankName, IFSCCode, accountNumber, name } = res.data[0];
          setInputs((prevState) => ({
            ...prevState,
            bankName: bankName || "",
            IFSCCode: IFSCCode || "",
            accountNumber: accountNumber || "",
            name: name || prevState.name,
          }));
          setIsBankDetailsExist(true);
        } else {
          setIsBankDetailsExist(false);
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        Toast.show({
          type: "error",
          text1: "An error occurred while fetching bank details.",
          visibilityTime: 2000,
          autoHide: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();

    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack(); // Go back if the current screen is focused
        return true; // Prevent default behavior (exiting the app)
      }
      return false; // If not focused, allow default behavior (exit the app)
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Your Bank Details"} icon={icons.back} />
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
                value={inputs.bankName}
                onChangeText={(text) => handleOnchange(text, "bankName")}
                onFocus={() => handleError(null, "bankName")}
                label="Bank Name"
                placeholder="Enter Bank Name"
                error={errors.bankName}
                isRequired={true}
              />
              <Input
                value={inputs.name}
                editable={false}
                onFocus={() => handleError(null, "name")}
                label="Name"
                placeholder="Enter Name"
                error={errors.name}
                isRequired={true}
              />
              <Input
                value={inputs.IFSCCode}
                onChangeText={(text) => handleOnchange(text, "IFSCCode")}
                onFocus={() => handleError(null, "IFSCCode")}
                label="IFSC Code"
                placeholder="Enter IFSC Code"
                error={errors.IFSCCode}
                keyboardType="text"
                isRequired={true}
              />
              <Input
                value={inputs.accountNumber}
                onChangeText={(text) => handleOnchange(text, "accountNumber")}
                onFocus={() => handleError(null, "accountNumber")}
                label="Account Number"
                placeholder="Enter Account Number"
                error={errors.accountNumber}
                keyboardType="numeric"
                isRequired={true}
              />
            </View>
          </View>
          {!isBankDetailsExist && (
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

export default UpdateBankVerification;
