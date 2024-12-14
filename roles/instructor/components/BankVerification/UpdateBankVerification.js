import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
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
import {
  getBankDetails,
  addBankDetails,
  updateBankDetails, 
} from "../../../../redux/actions/auth/auth";

const UpdateBankVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const [inputs, setInputs] = useState({
    name: user.data.name || "",
    bankName: "",
    IFSCCode: "",
    accountNumber: "",
    isVerify: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isBankDetailsExist, setIsBankDetailsExist] = useState(false);
  const [bankId, setBankId] = useState(null); // Add state for bank ID

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  // Additional validation function
  const validateInputs = () => {
    let valid = true;

    // Validate bank name
    if (!inputs.bankName) {
      handleError("Bank Name is required", "bankName");
      valid = false;
    } else if (inputs.bankName.length < 3) {
      handleError("Bank Name should be at least 3 characters", "bankName");
      valid = false;
    }

    // Validate IFSC Code
    if (!inputs.IFSCCode) {
      handleError("IFSC Code is required", "IFSCCode");
      valid = false;
    
    }

    // Validate account number
    if (!inputs.accountNumber) {
      handleError("Account Number is required", "accountNumber");
      valid = false;
    } else if (!/^\d{9,18}$/.test(inputs.accountNumber)) {
      handleError("Account Number must be between 9 and 18 digits", "accountNumber");
      valid = false;
    }

    return valid;
  };

  const handleSave = async () => {
    const isValid = validateInputs();
    if (!isValid) return;

    try {
      setLoading(true);

      // If bank details already exist, update them
      if (isBankDetailsExist  && bankId) {
        const updatedInputs = {
          name: inputs.name,
          bankName: inputs.bankName,
          accountNumber: inputs.accountNumber,
          isVerify: true,
          IFSCCode : inputs.IFSCCode,
          id : bankId
        };
        const res = await dispatch(updateBankDetails(bankId,updatedInputs));
        if (res.success) {
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
          navigation.goBack();
        } else {
          ToastAndroid.show(res.message || "Failed to update bank details.", ToastAndroid.SHORT);
        }
      } else {
        // If bank details don't exist, add them
        const res = await dispatch(addBankDetails(inputs));
        if (res.success) {
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
          setIsBankDetailsExist(true);
          navigation.goBack();
        } else {
          ToastAndroid.show(res.message || "Failed to add bank details.", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error("Error adding/updating bank details:", error);
      ToastAndroid.show("An error occurred while adding/updating bank details.", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await dispatch(getBankDetails());
        if (res.success && res.data.length > 0) {
          const { bankName, IFSCCode, accountNumber, name, id } = res.data[0];
          setInputs((prevState) => ({
            ...prevState,
            bankName: bankName || "",
            IFSCCode: IFSCCode || "",
            accountNumber: accountNumber || "",
            name: name || prevState.name,
          }));
          setIsBankDetailsExist(true);
          setBankId(id); // Set the bank ID
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
        navigation.goBack();
        return true;
      }
      return false;
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
                maxlength={11}

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
                maxlength={18}
              />
            </View>
          </View>
          <Button title={isBankDetailsExist ? "Update" : "Save"} onPress={handleSave} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpdateBankVerification;
