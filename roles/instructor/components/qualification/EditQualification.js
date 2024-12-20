import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,Alert,Linking,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,ToastAndroid
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS, icons } from "../../../../components/constants";
import { useSelector, useDispatch } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import { SelectList } from "react-native-dropdown-select-list";
import Header from "../../../../components/header/Header";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import * as FileSystem from 'expo-file-system';
import { PDFDocument } from 'pdf-lib';

import {
  getCourseType,
  getInstitute,
  getCourseDurationType,
  getUniversity,
} from "../../../../redux/actions/instructor/institute/institute";
import {
  getQualification,
  updateQualification,
} from "../../../../redux/actions/instructor/qualification/qualification";

const EditQualification = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    courseType: "",
    course: "",
    university_name: "",
    institute_collage: "",
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
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseDurationData, setCourseDurationData] = useState(null);
  const MAX_FILE_SIZE_MB = 50;
  const ALLOWED_FORMATS = "Image (jpg, png) or pdf";
  const [image, setImage] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const courseTypes = useSelector((state) => state.institute.courseType);
  const [institute, setInstitute] = useState([]);


  
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
      const existingPdfBytes = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      const pdfBytes = Uint8Array.from(atob(existingPdfBytes), c => c.charCodeAt(0));
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const compressedPdfBytes = await pdfDoc.save();
  
      const compressedPdfUri = `${FileSystem.cacheDirectory}compressed.pdf`;
      const compressedPdfBase64 = base64EncodeChunked(compressedPdfBytes);
  
      await FileSystem.writeAsStringAsync(compressedPdfUri, compressedPdfBase64, { encoding: FileSystem.EncodingType.Base64 });
  
      const compressedFileInfo = await FileSystem.getInfoAsync(compressedPdfUri);
  
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
  
        const fileType = file.type || file.mimeType || 'application/octet-stream'; // Ensure file type is defined
  
        setSelectedFile({
          uri: file.uri,
          type: fileType,
          name: sanitizeFileName(file.name),
          size: file.size,
        });
  
        if (fileType === 'application/pdf') {
  
          try {
            const compressedFile = await compressPDF(file.uri);
            const compressedFileSize = await formatFileSize(compressedFile.size);
  
            setSelectedFile({
              uri: compressedFile.uri,
              type: fileType,
              name: sanitizeFileName(file.name),
              size: compressedFile.size,
            });
          } catch (err) {
            setErrors({ document: `Error compressing PDF: ${err.message}` });
          }
        }
          setImage(result.assets);
        
      } else {
      }
    } catch (error) {
      console.error("Error while picking a document:", error);
      setErrors("Error while picking a document");
    } finally {
      setLoading2(false); // End loading indicator
    }
  };
  

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
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
        const selectedInstitute = institute.find(inst => inst.key);
        const selectedInstituteId = selectedInstitute?.key;
        const response = await dispatch(getCourseDurationType(selectedInstituteId));
        const courseDurationData = response.data;
  
        setCourseDurationData(courseDurationData);
  
        // Filter and set course options based on the selected institute
        const filteredCourses = courseDurationData
          .filter(course => {
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
        const res = await dispatch(getCourseType());
        setCourseType(res.data.map(course => ({
          key: course.id.toString(),
          value: course.courseType
        })));
        const res1 = await dispatch(getUniversity());
        setUniversity(res1.data.map(university => ({
          key: university.id.toString(),
          value: university.university_name
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

 
  useEffect(() => {
    if (courseTypes && courseTypes.data) {
      setCourseType(courseTypes.data.map(course => ({
        key: course.id.toString(),
        value: course.courseType
      })));
    }
  }, [courseTypes]);

  useEffect(() => {
    if (university && university.data) {
      setUniversity(university.data.map(university => ({
        key: university.id.toString(),
        value: university.university_name
      })));
    }
  }, [university]);



 

  
  const validate = async () => {
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
      ];
  
      // Check if any field is empty
      fields.forEach((field) => {
        if (!inputs[field]) {
          handleError(`Please select/input ${field.replace(/_/g, " ")}`, field);
          isValid = false;
        }
      });
  
      // Check if image is selected if it's required
      if (!selectedFile && !image.length) {
        handleError("Please select a document", "document");
        isValid = false;
      } 
     else {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
     
      if (!validTypes.includes(selectedFile.type)) {
        handleError("Invalid file type. Only images and PDFs are allowed.", "document");
        isValid = false;
      } else if (selectedFile.size > 1024 * 1024) { // 1MB = 1024 * 1024 bytes
        handleError("File exceeds 1 MB. Please upload an file under 1 MB.", "document");
        isValid = false;
      }
    }
  
      // If any validation fails, return
      if (!isValid) return;
  
      // Check format and validate accordingly
      if (inputs.format === "Percentage(%)" && !inputs.percentage) {
        handleError("Please input percentage", "percentage");
        return;
      }
      if (inputs.format === "CGPA" && !inputs.CGPA) {
        handleError("Please input CGPA", "CGPA");
        return;
      }
  
      if (!id) {
        ToastAndroid.show("Missing ID. Unable to update qualification.", ToastAndroid.SHORT);
        return;
      }
  
      setLoading1(true);
  
      // Form data creation
      const formData = new FormData();
      formData.append("courseType", inputs.courseType);
      formData.append("course", inputs.course);
      formData.append(
        "university_name",
        inputs.university_name
      ); 
      formData.append("institute_collage",inputs.institute_collage);
      formData.append("year", inputs.duration);
      formData.append("certificationNumber", inputs.certificationNumber);
      formData.append("marksType", inputs.format || null);
      formData.append("qualificationIn", inputs.qualificationIn);
      if (inputs.format === "Percentage(%)") {
        formData.append("marks", selectedFormat === "Percentage(%)" ? inputs.percentage : null);
      } else if (inputs.format === "CGPA") {
        formData.append("marks", selectedFormat === "CGPA" ? inputs.CGPA : null);
      }
  
      // Append new image if selected, otherwise append existing image
      if (selectedFile) {
      
        formData.append("qualificationFile", {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.name,
        });
      } else if (image.length > 0) {
        image.forEach((file, index) => {
        
          formData.append(`qualificationFile_${index}`, {
            uri: file.uri,
            type: file.type,
            name: file.name,
          });
        });
      }
      const res = await dispatch(updateQualification(id, formData));
      if (res.success) {
        setErrors({});
        ToastAndroid.show(res.message, ToastAndroid.SHORT);

        // Reload the current screen data
        // navigation.navigate("Qualification", { id });
        navigation.goBack();

      }
    } catch (error) {
      console.error("Error during form submission:", error.message);
      ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);
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

  const qualificationItem = [
    { key: "1", value: "HomeTutor" },
  ];

  const handleSelectChange1 = (value, fieldName) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [fieldName]: value,
    }));
  };

  const handleErrors = (error, fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(getQualification(id));
        if (res.success) {
          const {
            university_name,
            institute_collage,
            course,
            courseType,
            year: duration,
            certificationNumber,
            marksType: format,
            marks,
            documentPath,
            documentOriginalName,
            qualificationIn,
          } = res.data;

          setInputs({
            university_name,
            institute_collage,
            course,
            courseType,
            duration,
            certificationNumber,
            format,
            percentage: format === "Percentage(%)" ? marks : "",
            CGPA: format === "CGPA" ? marks : "",
            qualificationIn,
          });

          setSelectedFormat(format);
          setSelectedFile({
            uri: documentPath,
            type: documentOriginalName.endsWith(".pdf")
              ? "application/pdf"
              : "image/*",
            name: documentOriginalName,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, id]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 15 }}>
        <Header
          title={"Edit Qualification"}
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
         
              <Text style={styles.label}>
                University <Text style={{ color: "red" }}> *</Text>
              </Text>
              <SelectList
                setSelected={(text) =>
                  handleSelectChange(text, "university_name")
                }
                data={university}
                value={inputs.university_name}
                defaultOption={{
                  key: inputs.university_name,
                  value: inputs.university_name,
                }}
                save="value"
                fontFamily="Poppins"
                onFocus={() => handleError(null, "university_name")}
              />
              {errors.university_name && (
                <Text style={styles.errorText}>
                  {errors.university_name}
                </Text>
              )}
             
              <View style={{marginTop:10}}>
              <Text style={styles.label}>
              Institute<Text style={{ color: "red" }}> *</Text>
              </Text>
              <SelectList
                setSelected={(text) =>
                  handleSelectChange(text, "institute_collage")
                }
                data={institute}
                value={inputs.institute_collage}
                defaultOption={{
                  key: inputs.institute_collage,
                  value: inputs.institute_collage,
                }}
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
                  defaultOption={{ key: inputs.course, value: inputs.course }}
                  save="value"
                  fontFamily="Poppins"
                />
                {errors.course && (
                  <Text style={styles.errorText}>{errors.course}</Text>
                )}
              </View>
          
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

            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>
                Add Qualification For<Text style={{ color: "red" }}> *</Text>
              </Text>
              <SelectList
                setSelected={(text) =>
                  handleSelectChange(text, "qualificationIn")
                }
                data={qualificationItem}
                value={inputs.qualificationIn}
                defaultOption={{
                  key: inputs.qualificationIn,
                  value: inputs.qualificationIn,
                }}
                save="value"
                fontFamily="Poppins"
                onFocus={() => handleError(null, "qualificationIn")}
              />
            </View>
            {errors.qualificationIn && (
              <Text style={styles.errorText}>{errors.qualificationIn}</Text>
            )}
            <View style={{ marginTop: 10 }}>
              <Input
                onChangeText={(text) =>
                  handleOnchange(text, "certificationNumber")
                }
                onFocus={() => handleError(null, "certificationNumber")}
                label="Certification Number"
                placeholder="Certification Number"
                error={errors.certificationNumber}
                isRequired={true}
                value={inputs.certificationNumber}
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
              value={inputs.format}
              defaultOption={{ key: inputs.format, value: inputs.format }}
              save="value"
              fontFamily="Poppins"
              onFocus={() => handleError(null, "format")}
            />
            {errors.format && (
              <Text style={styles.errorText}>{errors.format}</Text>
            )}

            {selectedFormat === "Percentage(%)" && (
              <View style={{ marginTop: 10 }}>
                <Input
                  onChangeText={(text) => handleOnchange(text, "percentage")}
                  onFocus={() => handleError(null, "percentage")}
                  label="Percentage"
                  placeholder="Percentage"
                  error={errors.percentage}
                  isRequired={true}
                  value={inputs.percentage}
                />
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
                  value={inputs.CGPA}
                />
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
    ) : selectedFile ?  (
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
                "Update"
              )
            }
            onPress={validate}
          />
        </ScrollView>
      )}
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
  infoText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily:'Poppins',
    color: '#666',
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
    // marginVertical: 5,
    fontSize: 14,
    color:COLORS.primary,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditQualification;
