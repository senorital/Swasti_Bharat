import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  StatusBar,
  BackHandler,
  ToastAndroid
} from "react-native";
import { COLORS, icons } from "../../../../components/constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import Header from "../../../../components/header/Header";
import Button from "../../../../components/button/Button";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { addTutorPhoto } from "../../../../redux/actions/instructor/homeTutor/homeTutor";

const AddTutorPhoto = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { id } = route.params;
 console.log("AddTutorPhoto : " + id);
  const validationSchema = Yup.object().shape({
    images: Yup.array()
      .of(
        Yup.object().shape({
          uri: Yup.string().required("Image is required"),
        })
      )
      .min(1, "At least one image is required")
      .max(3, "You can upload up to 3 images"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      console.log(id)
      values.images.forEach((img, index) => {
        formData.append("hTutorImages", {
          uri: img.uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      console.log("FormData:", formData);

      const res = await dispatch(addTutorPhoto(formData,id));
      console.log(res.status);
      console.log(res.success);
      if (res) {
        // Toast.show({
        //   type: "success",
        //   text1: res.message,
        //   visibilityTime: 2000,
        //   autoHide: true,
        // });
        ToastAndroid.show("Home Tutor Images Added Successfully",ToastAndroid.SHORT)
        navigation.goBack();
      } else {
        console.error("Unexpected response:", res);
      }
    } catch (error) {
      console.error("Error occurred while registering user:", error);
      const msg = error.response.message;
      // Toast.show({
      //   type: "error",
      //   text1: msg ||"An error occurred. Please try again.",
      //   visibilityTime: 2000,
      //   autoHide: true,
      // });
      ToastAndroid.show(msg ||"An error occurred. Please try again.",ToastAndroid.SHORT);

    } finally {
      setSubmitting(false);
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

  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets);
    if (!result.cancelled) {
      setFieldValue("images", result.assets);
    }
  };

  const handleRemoveImage = (index, values, setFieldValue) => {
    const newImages = [
      ...values.images.slice(0, index),
      ...values.images.slice(index + 1),
    ];
    setFieldValue("images", newImages);
  };

  return (
    <View style={styles.container}>
          <StatusBar backgroundColor={COLORS.primary} style="light" />
          <View style={{ paddingTop: 20 }}>
        <Header title={"Add Photos"} icon={icons.back} />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
      >
        <View >
          <View style={{ flex: 1 }}>
            <Text style={styles.textHeading}>Add Your Yoga Asanas Photos</Text>
            <Text style={styles.fontSize}>* Maximum 3 photos can be selected</Text>

            <Formik
              initialValues={{ images: [] }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                setFieldValue,
                handleSubmit,
                isSubmitting,
              }) => (
                <View>
                 
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => pickImage(setFieldValue)}
                        style={styles.cameraContainer}
                      >
                        <View style={styles.cameraButton}>
                          <Image
                            style={styles.cameraImage}
                            source={require("../../../../assets/camera.png")}
                          />
                          <Text style={styles.cameraText}>Add Your Yoga Asanas Photos</Text>
                        </View>
                      </TouchableOpacity>
                      {errors.images && touched.images && (
                        <Text style={styles.errorText}>{errors.images}</Text>
                      )}
                    </View>
                    <View
                      style={{ width: wp(90), marginTop: 10, marginRight: 10 }}
                    >
                      <FlatList
                        data={values.images}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveImage(index, values, setFieldValue)
                            }
                          >
                            <Image
                              source={{ uri: item.uri }}
                              style={{
                                width: wp(40),
                                height: hp(20),
                                borderRadius: 5,
                                marginHorizontal: 5,
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  
                  <Button
                    title={
                      isSubmitting ? (
                        <ActivityIndicator
                          size="small"
                          color="#ffffff"
                          style={styles.indicator}
                        />
                      ) : (
                        "Save"
                      )
                    }
                    onPress={handleSubmit}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textHeading: {
    fontFamily: "Poppins",
    fontSize: hp(2.3),
    fontWeight: "500",
    marginVertical: 10,
  },
  fontSize :{
    fontSize: hp(2),  
    fontFamily: "Poppins",
    color:'red'
  },
  label: {
    fontSize: hp(2),
    fontFamily: "Poppins",
  },
  errorText: {
    marginTop: 7,
    color: "red",
    fontSize: hp(1.6),
    fontFamily: "Poppins",
  },
  cameraContainer: {
    width: wp(90),
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle :'dashed',
    marginTop: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  cameraImage: {
    width: 30,
    height: 30,
  },
  cameraText: {
    fontSize: hp(2),
    fontFamily: "Poppins_Medium",
    textAlign: "center",
    marginTop:12,
    color:COLORS.primary
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
});

export default AddTutorPhoto;
