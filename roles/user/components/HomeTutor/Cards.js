import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../style';
import { Ionicons,AntDesign } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../../components/constants';

const TextIcon = ({ text, icon, isFirst }) => (
  <View style={{ flexDirection: 'row', marginTop: 6,flexWrap:'wrap' }}>
    <Ionicons name={icon} size={15} color={COLORS.primary} style={{marginHorizontal:5}}/>

    <Text style={[
       styles.cardtext,
      isFirst  
    ]}
    numberOfLines={2} // Ensure text wraps after reaching the specified width

    >
      {text}
    </Text>
  </View>
);

const PriceCourse = ({ price, courseType, isSession }) => (
  <View style={[styles.priceCourse, isSession && styles.thickBorder]}>
    <Text style={[styles.vsmalltext, { fontFamily: 'Poppins' }]}>{price}</Text>
    <Text style={[styles.vsmalltext, { fontFamily: 'Poppins-SemiBold' }]}>{courseType}</Text>
  </View>
);

const StarRating = ({ rating, size = 20, color = '#FC9D45' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const iconName =
      i <= rating ? 'star' : i - rating < 0.5 ? 'star-half' : 'star-outline';
    stars.push(
      <Ionicons key={i} name={iconName} size={size} color={color} style={styles.star} />
    );
  }

  return <View style={styles.starRating}>{stars}</View>;
};

const Cards = ({ tutor }) => {
  const navigation = useNavigation();
  const { id, privateSessionPrice_Day,groupSessionPrice_Day,homeTutorName, instructorBio, privateSessionPrice_Month, groupSessionPrice_Month, specilization, yogaFor } = tutor;

  const handleHomeTutorPress = (id) => {
    console.log(id);
    navigation.navigate("ShowInstructorForUser", {homeTutorId : id });
  };


  return (
    <ScrollView>
      <TouchableOpacity
        style={{
          margin: 12,
          backgroundColor: '#fff',
          borderRadius: 10,
          elevation: 5, // Add elevation for box shadow
        }}
        onPress={() => handleHomeTutorPress(tutor.id)}
      >
        <View style={styles.header}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Avatar
              rounded
              source={{
                uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
              }}
              size={65}
              marginHorizontal={20}
              marginVertical={5}
            />
            <StarRating rating={4} size={12} color="#FC9D45" marginHorizontal={20} />
            <Text style={[styles.vsmalltext, { marginRight: 10, marginTop: 5 }]}>4.5</Text>
          </View>
          <View>
            <Text style={[styles.name, { fontSize: 15, marginTop: 5, marginLeft: 12 }]}>
              {tutor.homeTutorName}
            </Text>
            <TextIcon icon="checkmark-sharp" text={JSON.parse(tutor.yogaFor).join(", ")} isFirst={false} />
            <TextIcon icon="checkmark-sharp" text={`${JSON.parse(tutor.specilization).join(", ")}`} isFirst={false} />
          </View>
        </View>

        {/* Session prices */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 5, marginTop: -5 }}>
          {tutor.privateSessionPrice_Month && (
            <PriceCourse price={`₹${tutor.privateSessionPrice_Month}/ Month`} courseType="Private Session" isSession={false} />
          )}
          {tutor.privateSessionPrice_Day && (
            <PriceCourse price={`₹${tutor.privateSessionPrice_Day}/ Day`} courseType="Private Session" isSession={false} />
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 10 }}>
          {tutor.groupSessionPrice_Month && (
            <PriceCourse price={`₹${tutor.groupSessionPrice_Month}/ Month`} courseType="Group Session" isSession={false} />
          )}
          {tutor.groupSessionPrice_Day && (
            <PriceCourse price={`₹${tutor.groupSessionPrice_Day}/ Day`} courseType="Group Session" isSession={false} />
          )}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default Cards;
