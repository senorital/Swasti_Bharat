import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,Modal,ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import { SelectList } from "react-native-dropdown-select-list";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import {
  getCourseType,
  getInstitute,
  getCourseDurationType,
  getUniversity,
} from "../../../../redux/actions/instructor/institute/institute";
import { getInstructor } from "../../../../redux/actions/auth/auth";
import { addQualification } from "../../../../redux/actions/instructor/qualification/qualification";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "../../../../components/constants";
import CustomAlertModal from "../../../../components/CustomAlert/CustomAlertModal";
import { PDFDocument } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { zip } from 'react-native-zip-archive';

const qualificationItem = [
  // { key: "1", value: "YogaStudio" },
  { key: "1", value: "HomeTutor" },
  // { key: "3", value: "Therapy" },
];

const AddQualification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [onAlertOk, setOnAlertOk] = useState(() => () => {});
  const [inputs, setInputs] = useState({
      courseType: "",
    course: "",
    university_name: "",
    institute_collage : "",
    duration: "",
    certificationNumber: "",
    format: "",
    percentage: "",
    CGPA: "",
    document: "",
    qualificationIn: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [courseType, setCourseType] = useState([]);
  const [university, setUniversity] = useState([]);
  const [institute, setInstitute] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [durationOptions, setDurationOptions] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseDurationData, setCourseDurationData] = useState(null);
  const [image, setImage] = useState([]);
  const MAX_FILE_SIZE_MB = 1;
  const ALLOWED_FORMATS = "Image (jpg, png) or pdf";
  // const courseTypes = useSelector((state) => state.institute.courseType);
  const [boldText, setBoldText] = useState('');

  // const courseDurationType = useSelector(
  //   (state) => state.institute.courseDurationType
  // );
  // console.log(courseDurationType);

  // const pickImage = async () => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: ["image/*", "application/pdf"],
  //       multiple: false,
  //     });

  //     if (!result.canceled) {
  //       const file = result.assets[0];
  //       // console.log(result)
  //       setSelectedFile({
  //         uri: file.uri,
  //         type: file.mimeType || "application/octet-stream",
  //         name: file.name,
  //       });
  //       setImage(result.assets);
  //     } else {
  //       console.log("Document picking canceled or failed.");
  //     }
  //   } catch (error) {
  //     console.error("Error while picking a document:", error);
  //   }
  // };
  // Configure workerSrc for pdfjs-dist

  async function formatFileSize(sizeInBytes) {
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;
  
    if (sizeInMB >= 1) {
      return `${sizeInMB.toFixed(2)} MB`;
    } else {
      return `${sizeInKB.toFixed(2)} KB`;
    }
  }
  function base64EncodeChunked(uint8Array) {
    const CHUNK_SIZE = 0x8000; // 32768
    let index = 0;
    let result = '';
  
    while (index < uint8Array.length) {
      const slice = uint8Array.subarray(index, index + CHUNK_SIZE);
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
  
    return btoa(result);
  }

  function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  }
  
  const compressPDF = async (fileUri) => {
    try {
      console.log('Reading PDF file...');
      const existingPdfBytes = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      console.log('PDF file read successfully.');
  
      console.log('Converting Base64 to Uint8Array...');
      const pdfBytes = Uint8Array.from(atob(existingPdfBytes), c => c.charCodeAt(0));
      console.log('Conversion complete. PDF bytes length:', pdfBytes.length);
  
      console.log('Loading PDF document with ignoreEncryption option...');
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      console.log('PDF document loaded.');
  
      console.log('Saving PDF document...');
      const compressedPdfBytes = await pdfDoc.save();
      console.log('PDF document saved. Compressed bytes length:', compressedPdfBytes.length);
  
      const compressedPdfUri = `${FileSystem.cacheDirectory}compressed.pdf`;
  
      console.log('Converting compressed PDF bytes to Base64 in chunks...');
      const compressedPdfBase64 = base64EncodeChunked(compressedPdfBytes);
  
      console.log('Writing compressed PDF to file...');
      await FileSystem.writeAsStringAsync(compressedPdfUri, compressedPdfBase64, { encoding: FileSystem.EncodingType.Base64 });
      console.log('Compressed PDF written to file:', compressedPdfUri);
  
      console.log('Getting file info...');
      const compressedFileInfo = await FileSystem.getInfoAsync(compressedPdfUri);
      console.log('Compressed file info:', compressedFileInfo);
  
      return { uri: compressedPdfUri, size: compressedFileInfo.size };
  
    } catch (err) {
      console.error("Error compressing PDF: ", err);
      throw err;
    }
  };
  
  const pickImage = async () => {
    setLoading2(true); // Start loading indicator
    setErrors(''); // Clear any previous errors
  
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        multiple: false,
      });
  
      if (!result.canceled) {
        const file = result.assets[0];
        const formattedFileSize = await formatFileSize(file.size);
        console.log("File Size: " + formattedFileSize);
  
        const fileType = file.type || file.mimeType || 'application/octet-stream'; // Ensure file type is defined
  
        setSelectedFile({
          uri: file.uri,
          type: fileType,
          name: sanitizeFileName(file.name),
          size: file.size,
        });
  
        if (fileType === 'application/pdf') {
          console.log("Compressing PDF...");
  
          try {
            const compressedFile = await compressPDF(file.uri);
            const compressedFileSize = await formatFileSize(compressedFile.size);
            console.log("Compressed File Size: " + compressedFileSize);
  
            setSelectedFile({
              uri: compressedFile.uri,
              type: fileType,
              name: sanitizeFileName(file.name),
              size: compressedFile.size,
            });
          } catch (err) {
            console.log("Error compressing PDF: ", err);
            setErrors({ document: `Error compressing PDF: ${err.message}` });
          }
        }
          setImage(result.assets);
        
      } else {
        console.log("Document picking canceled or failed.");
      }
    } catch (error) {
      console.error("Error while picking a document:", error);
      setErrors("Error while picking a document");
    } finally {
      setLoading2(false); // End loading indicator
    }
  };
  // console.log(selectedFile)

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleErrors = (error, fieldName) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error
    }));
  };

const handleSelectChange = async (val, input) => {
  setInputs(prevState => ({
    ...prevState,
    [input]: val,
  }));
  setErrors(prevState => ({ ...prevState, [input]: "" }));

  if (input === "university_name") {
    try {
      // Get the selected university ID
      const selectedUniversity = university.find(
        uni => uni.value === val
      );
      const selectedUniversityId = selectedUniversity?.key;

      if (selectedUniversityId) {
        // Fetch institutes based on the selected university
        const response = await dispatch(getInstitute(val));
        const institutesData = response.data;
        setInstitute(institutesData.map(institute => ({
          key: institute.id.toString(),
          value: institute.institute_collage
        })));
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  }

  if (input === 'institute_collage') {
    try {
      // Get the selected institute ID
      const selectedInstitute = institute.find(inst => inst.key);
      const selectedInstituteId = selectedInstitute?.key;
      console.log("selectedInstituteId:", selectedInstituteId);

      // Fetch course duration types based on the selected course type
      console.log(val);
      const response = await dispatch(getCourseDurationType(selectedInstituteId));
      const courseDurationData = response.data;

      setCourseDurationData(courseDurationData);

      // Filter and set course options based on the selected institute
      const filteredCourses = courseDurationData
        .filter(course => {
          console.log("Course University ID:", course.universityId); // Log university ID from course response
          console.log("Filtering based on ID:", selectedInstituteId); // Log selected university ID
          return course.universityId === selectedInstituteId;
        })
        .map(course => ({
          key: course.id.toString(),
          value: course.courseName.toUpperCase()
        }));
      setCourseOptions(filteredCourses);


    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  if (input === 'course') {
    try {
      // Get the selected course details
      const selectedCourse = courseDurationData.find(course => course.courseName.toUpperCase() === val);

      if (selectedCourse) {
        setInputs(prevState => ({
          ...prevState,
          courseType: selectedCourse.courseType,
          duration: selectedCourse.courseDuration,
        }));
      }
    } catch (error) {
      console.error("Error setting course details:", error);
    }
  }


};

  
  
  


  
  const format = [
    { key: "1", value: "Percentage(%)" },
    { key: "2", value: "CGPA" },
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const instructorRes = await dispatch(getInstructor());
        const userName = instructorRes.data.name;
        const profileComplete = instructorRes.data.profileComplete;
        setBoldText(userName);

        if (!profileComplete) {
          setBoldText(userName);
          setAlertMessage("Please complete your profile.");
          setShowAlert(true);
          setOnAlertOk(() => () => {
            setShowAlert(false);
            navigation.navigate('EditProfile');
          });
        } else {
      
          const res1 = await dispatch(getUniversity());
          setUniversity(res1.data.map(university => ({
            key: university.id.toString(),
            value: university.university_name
          })));
        }
          // const res1 = await dispatch(getInstitute());
          // setUniversity(res1.data.map(institute => ({
          //   key: institute.id.toString(),
          //   value: institute.instituteName
          // })));
        
      } catch (error) {
        console.error("Error fetching data:", error);
        const msg = error.response?.data?.message;
        setBoldText(userName);
        setAlertMessage(msg || "An error occurred. Please try again.");
        setShowAlert(true);
        setOnAlertOk(() => () => {
          navigation.navigate('EditProfile');
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);



  useEffect(() => {
    if (university && university.data) {
      setUniversity(university.data.map(university => ({
        key: university.id.toString(),
        value: university.university_name
      })));
    }
  }, [university]);



  const validate = async (event) => {
    event.preventDefault();
  
    try {
      let isValid = true;
      const fields = [
        "courseType",
        "course",
        "university_name",
        "institute_collage",
        "duration",
        "certificationNumber",
        "format",
        "qualificationIn",
      ];
  
      // Check if any field is empty
      fields.forEach((field) => {
        if (!inputs[field]) {
          handleError(`Please select/input ${field.replace(/_/g, " ")}`, field);
          isValid = false;
          console.log(`Validation failed: ${field} is empty`);
        }
      });
  
      console.log("Selected file:", selectedFile);

    // Check if file is selected and validate
    if (!selectedFile) {
      handleError("Please select a document", "document");
      isValid = false;
      console.log("Validation failed: No document selected");
    } else {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      console.log("Selected file type:", selectedFile.type);
      console.log("Selected file size:", selectedFile.size);

      if (!validTypes.includes(selectedFile.type)) {
        handleError("Invalid file type. Only images and PDFs are allowed.", "document");
        isValid = false;
        console.log("Validation failed: Invalid file type");
      } else if (selectedFile.size > 1024 * 1024) { // 1MB = 1024 * 1024 bytes
        handleError("File exceeds 1 MB. Please upload an image under 1 MB.", "document");
        isValid = false;
        console.log("Validation failed: File size exceeds 1MB");
      }
    }

      if (inputs.format === "Percentage(%)" && !inputs.percentage) {
        handleError("Please input percentage", "percentage");
        isValid = false;
        console.log("Validation failed: Percentage format selected but no percentage input");
      }
      if (inputs.format === "CGPA" && !inputs.CGPA) {
        handleError("Please input CGPA", "CGPA");
        isValid = false;
        console.log("Validation failed: CGPA format selected but no CGPA input");
      }
  
      // If any validation failed, stop further execution
      if (!isValid) {
        console.log("Form validation failed. Aborting submission.");
        return;
      }
  

      setLoading1(true);
      // Form data creation
      const formData = new FormData();
      formData.append("courseType", inputs.courseType);
      formData.append("course", inputs.course);
      formData.append("university_name", inputs.university_name);
      formData.append("institute_collage", inputs.institute_collage);
      formData.append("year", inputs.duration);
      formData.append("certificationNumber", inputs.certificationNumber);
      formData.append("marksType", inputs.format || null);
      // formData.append("marksType", selectedFormat || "");

      formData.append("qualificationIn", inputs.qualificationIn);
  
  
      if (inputs.format === "Percentage(%)") {
        formData.append("marks", selectedFormat === "Percentage(%)" ? inputs.percentage : null);
      } else if (inputs.format === "CGPA") {
        // formData.append("marks", inputs.CGPA);
        formData.append("marks", selectedFormat === "CGPA" ? inputs.CGPA : null);

      }
  
     
        console.log("selectedFile.size :" + selectedFile.uri)
        formData.append("qualificationFile", {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.name,
          size : selectedFile.size
        });
      

  
      // Log FormData for debugging
      console.log("FormData:", formData);
      // console.log("FormData:", formData.marks);

      // Submit form data
      const res = await dispatch(addQualification(formData));
      console.log("Response:", res);
  
      if (res.success) {
        setErrors({});
        setAlertMessage("Qualification Added Successfully");
  setShowAlert(true);
  setOnAlertOk(() => () => {
    setShowAlert(false);
    navigation.navigate('Home');
  });
        navigation.navigate("Home");
      } else {
    ToastAndroid.show(res.message || 'An error occurred. Please try again.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      const msg = error.response?.data?.message || "An error occurred. Please try again.";
    ToastAndroid.show(msg, ToastAndroid.SHORT);
    } finally {
      setLoading1(false);
    }
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
        <Header
          title={"Add Qualification"}
          icon={icons.back}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
        >
          <View style={{ flex: 1 }}>
            <View style={{  }}>
              <Text style={styles.label}>
                Add Qualification For<Text style={{ color: "red" }}> *</Text>
              </Text>
              <SelectList
                setSelected={(text) =>
                  handleSelectChange(text, "qualificationIn")
                }
                data={qualificationItem}
                defaultOption={inputs.qualificationIn}
                save="value"
                fontFamily="Poppins"
                onFocus={() => handleError(null, "qualificationIn")}
              />
            </View>
            {errors.qualificationIn && (
              <Text style={styles.errorText}>{errors.qualificationIn}</Text>
            )}
             <View style={{ }}>
              <Text style={styles.label}>
                University <Text style={{ color: "red" }}> *</Text>
              </Text>
              <SelectList
                setSelected={(text) =>
                  handleSelectChange(text, "university_name")
                }
                data={university}
                save="value"
                fontFamily="Poppins"
                onFocus={() => handleError(null, "university_name")}
              />
         
              {errors.university_name && (
                <Text style={styles.errorText}>
                  {errors.university_name}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>
                Institute <Text style={{ color: "red" }}> *</Text>
              </Text>
              <SelectList
                setSelected={(text) =>
                  handleSelectChange(text, "institute_collage")
                }
                data={institute}
                save="value"
                fontFamily="Poppins"
                onFocus={() => handleError(null, "institute_collage")}
              />
         
              {errors.institute_collage && (
                <Text style={styles.errorText}>
                  {errors.institute_collage}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Course<Text style={{ color: "red" }}> *</Text>
            </Text>
              <SelectList
                setSelected={(text) => handleSelectChange(text, "course")}
                 data={courseOptions}
                defaultOption={inputs.course}
                save="value"
                fontFamily="Poppins"
                onFocus={() => handleError(null, "course")}
              />
            </View>
            {errors.course && (
              <Text style={styles.errorText}>{errors.course}</Text>
            )}
          <View style={{ marginTop: 10 }}>
  <Text style={styles.label}>
    Course Type <Text style={{ color: "red" }}> *</Text>
  </Text>
  <Text style={styles.readOnlyText}>   {inputs.courseType || "Please select a course first"}
  </Text>
</View>

<View style={{ marginTop: 10 }}>
  <Text style={styles.label}>
    Course Duration <Text style={{ color: "red" }}> *</Text>
  </Text>
  <Text style={styles.readOnlyText}>   {inputs.duration || "Please select a course first"}</Text>
</View>
            {/* <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>
                Course Type<Text style={{ color: "red" }}> *</Text>
              </Text>
              <SelectList
              setSelected={(text) =>
                handleSelectChange(text, "courseType")
              }
              data={courseType}
              defaultOption={inputs.courseType}
              save="value"
              fontFamily="Poppins"
              onFocus={() => handleError(null, "courseType")}
            />
          </View>
          {errors.courseType && (
            <Text style={styles.errorText}>{errors.courseType}</Text>
          )}
         
           
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>
                Course Duration <Text style={{ color: "red" }}> *</Text>
              </Text>
            <SelectList
                 setSelected={(val) => handleSelectChange(val, "duration")}
                 data={durationOptions}
                 placeholder="Select Duration"
                fontFamily="Poppins"
                onFocus={() => handleError(null, "duration")}
              />
             
             {errors.duration && (
                <Text style={styles.errorText}>
                  {errors.duration}
                </Text>
              )}
            </View> */}
            <View style={{ marginTop: 15 }}>
            <Input
              onChangeText={(text) =>
                handleOnchange(text, "certificationNumber")
              }
              onFocus={() => handleError(null, "certificationNumber")}
              label="Certification Number"
              placeholder="Certification Number"
              error={errors.certificationNumber}
              isRequired={true}
            />
  </View>
  {inputs.courseType !== 'Certification Course' && (
    <>
      <Text style={styles.label}>
        Format<Text style={{ color: "red" }}> *</Text>
      </Text>
      <SelectList
        setSelected={(text) => {
          handleSelectChange(text, "format");
          setSelectedFormat(text);
        }}
        data={format}
        save="value"
        fontFamily="Poppins"
        onFocus={() => handleError(null, "format")}
      />
      {/* {errors.format && (
        <Text style={styles.errorText}>{errors.format}</Text>
      )} */}

      {selectedFormat === "Percentage(%)" && (
        <View style={{ marginTop: 10 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "percentage")}
            onFocus={() => handleError(null, "percentage")}

            label="Percentage"
            placeholder="Percentage"
            error={errors.percentage}
            isRequired={true}
            keyboardType="numeric"
          />
          {errors.percentage && (
            <Text style={styles.errorText}>{errors.percentage}</Text>
          )}
        </View>
      )}
      {selectedFormat === "CGPA" && (
        <View style={{ marginTop: 10 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "CGPA")}
            onFocus={() => handleError(null, "CGPA")}
 
            label="CGPA"
            placeholder="CGPA"
            error={errors.CGPA}
            isRequired={true}
            keyboardType="numeric"
          />
          {errors.CGPA && (
            <Text style={styles.errorText}>{errors.CGPA}</Text>
          )}
        </View>
      )}
    </>
  )}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>
                Document Upload<Text style={{ color: "red" }}> *</Text>
              </Text>
              <View style={styles.cameraContainer}>
    {loading2 ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>
          Processing {selectedFile?.type === 'application/pdf' ? `${selectedFile.name}` : ''}...
        </Text>
      </View>
    ) : selectedFile ? (
      <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
        {selectedFile.type.includes("image") ? (
          <Image
            source={{ uri: selectedFile.uri }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
            }}
          />
        ) : (
          <View style={styles.pdfContainer}>
            <Image
              source={require("../../../../assets/pdf.png")}
              style={styles.pdfIcon}
            />
            <Text style={styles.pdfText}>{selectedFile.name}</Text>
          </View>
        )}
      </TouchableOpacity>
    ) : (
      <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
        <View style={styles.cameraButton}>
          <Image
            style={styles.cameraImage}
            source={require("../../../../assets/camera.png")}
          />
          <Text style={styles.cameraText}>Add File</Text>
        </View>
      </TouchableOpacity>
    )}
  </View>
      </View>

      {/* Loading Modal */}
      {/* <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.modalText}>Processing...</Text>
        </View>
      </Modal> */}

            {errors.document && (
              <Text style={styles.errorText}>{errors.document}</Text>
            )}
              <Text style={styles.infoText}>
        Allowed formats: {ALLOWED_FORMATS} {"\n"}
        Max file size: {MAX_FILE_SIZE_MB} MB
      </Text>
          </View>
          <Button
            title={
              loading1 ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Save"
              )
            }
            onPress={validate}
          />
        </ScrollView>
      )}
           <CustomAlertModal
        visible={showAlert}
        greeting="Hello ,"
        boldText={boldText}
        message={alertMessage}
        onCancel={() => setShowAlert(false)}
        onOk={onAlertOk}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  readOnlyText: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    color: '#333',
    fontFamily: 'Poppins',
    fontSize: 13,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  label: {
    marginVertical: 5,
    color:COLORS.primary,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
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
    fontSize: 10,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily:'Poppins',
    color: '#666',
  },
  loadingContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },

});

export default AddQualification;
  // setAlertMessage("Qualification Added Successfully");
  // setShowAlert(true);
  // setOnAlertOk(() => () => {
  //   setShowAlert(false);
  //   navigation.navigate('MyProfile');
  // });

  // const handleSelectChange = (value, fieldName) => {
  //   setInputs(prevInputs => ({
  //     ...prevInputs,
  //     [fieldName]: value
  //   }));
  // };
