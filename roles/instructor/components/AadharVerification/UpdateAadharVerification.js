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
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "../../../../components/constants";
import { getKYC, addKYC, updateKYC } from "../../../../redux/actions/auth/auth"; // Add updateKYC API
import NetInfo from "@react-native-community/netinfo"; // Import NetInfo


const UpdateAadharVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const [inputs, setInputs] = useState({
    name: user.data.name || "",
    aadharNumber: "",
    address: "",
    isVerify: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isKYCDetailsExist, setIsKYCDetailsExist] = useState(false);
  const [kycId, setKycId] = useState(null); // Store KYC id
  const [isConnected, setIsConnected] = useState(true); // State to track the network connection status

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validateInputs = () => {
    let valid = true;

    if (!inputs.name || inputs.name.trim().length <= 3) {
      handleError("Name must be more than 3 characters", "name");
      valid = false;
    }

    if (!inputs.aadharNumber || !/^\d{12}$/.test(inputs.aadharNumber)) {
      handleError("Aadhar Card Number must be exactly 12 digits", "aadharNumber");
      valid = false;
    }

    if (!inputs.address) {
      handleError("Address is required", "address");
      valid = false;
    }

    return valid;
  };

  const handleSave = async () => {
    const isValid = validateInputs();

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      // Log the data to be sent for updating or adding KYC details
    

      if (isKYCDetailsExist && kycId) {
        
        const updatedInputs = {
          name: inputs.name,
          aadharNumber: inputs.aadharNumber,
          address: inputs.address,
          isVerify: true,
          id : kycId
        };
     console.log("updatedInputs :" + updatedInputs)

        const res = await dispatch(updateKYC(kycId,updatedInputs));
        if (res.success) {
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
          navigation.goBack();
        } else {
          ToastAndroid.show(res.message || "Failed to update KYC details.", ToastAndroid.SHORT);
        }
      } else {
          const res = await dispatch(addKYC(inputs));
        if (res.success) {
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
          setIsKYCDetailsExist(true);
          navigation.goBack();
        } else {
          ToastAndroid.show(res.message || "Failed to add KYC details.", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error("Error saving KYC details:", error);
      ToastAndroid.show("An error occurred while saving KYC details.", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchKycDetails = async () => {
  //     try {
  //       const res = await dispatch(getKYC());
  //       if (res.success && res.data) {
  //         const { name, aadharNumber, address, id } = res.data;
  //         setInputs({
  //           name: name || user.data.name,
  //           aadharNumber: aadharNumber || "",
  //           address: address || "",
  //         });
  //         setKycId(id); // Set the KYC id
  //         setIsKYCDetailsExist(true);
  //       } else {
  //         setIsKYCDetailsExist(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching KYC details:", error);
  //       ToastAndroid.show("An error occurred while fetching KYC details.", ToastAndroid.SHORT);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchKycDetails();

  //   const handleBackPress = () => {
  //     if (navigation.isFocused()) {
  //       navigation.goBack();
  //       return true;
  //     }
  //     return false;
  //   };

  //   BackHandler.addEventListener("hardwareBackPress", handleBackPress);

  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  //   };
  // }, [dispatch, navigation, user.data.name]);

  useEffect(() => {
    // Check network connection when the component mounts
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected); // Update state based on network connection status
    });

    const fetchKycDetails = async () => {
      if (!isConnected) {
        ToastAndroid.show("No internet connection. Please try again later.", ToastAndroid.SHORT);
        return;
      }

      try {
        const res = await dispatch(getKYC());
        if (res.success && res.data) {
          const { name, aadharNumber, address, id } = res.data;
          setInputs({
            name: name || user.data.name,
            aadharNumber: aadharNumber || "",
            address: address || "",
          });
          setKycId(id); // Set the KYC id
          setIsKYCDetailsExist(true);
        } else {
          setIsKYCDetailsExist(false);
        }
      } catch (error) {
        console.error("Error fetching KYC details:", error);
        ToastAndroid.show("An error occurred while fetching KYC details.", ToastAndroid.SHORT);
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
      unsubscribe(); // Clean up the NetInfo listener when the component unmounts
    };
  }, [dispatch, navigation, user.data.name, isConnected]);

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
                onChangeText={(text) => handleOnchange(text, "name")}
                onFocus={() => handleError(null, "name")}
                label="Name"
                placeholder="Enter Name"
                error={errors.name}
                isRequired={true}
              />
              <Input
                value={inputs.aadharNumber}
                onChangeText={(text) => handleOnchange(text, "aadharNumber")}
                onFocus={() => handleError(null, "aadharNumber")}
                label="Aadhar Card Number"
                placeholder="Enter Aadhar Card Number"
                error={errors.aadharNumber}
                keyboardType="numeric"
                isRequired={true}
                maxLength={12}  // Limit the input to 12 characters
              />
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
            </View>
          </View>
          <Button
            title={isKYCDetailsExist ? "Update" : "Save"}
            onPress={handleSave}
          />
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

export default UpdateAadharVerification;
