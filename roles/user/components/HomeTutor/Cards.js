import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../style';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../../components/constants';

const TextIcon = ({ text, icon, isFirst }) => (
  <View style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'nowrap' }}>
    <Ionicons name={icon} size={14} color={COLORS.primary} style={{ marginHorizontal: 3 }} />
    <Text
      style={[
        styles.cardtext,
        isFirst,
        { flexShrink: 2, whiteSpace: 'nowrap', overflow: 'hidden' },
      ]}
      numberOfLines={1}
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

const Cards = ({ tutor, latitude, longitude, distance }) => {
  const navigation = useNavigation();
  const [showFullYogaFor, setShowFullYogaFor] = useState(false);

  const {
    id,
    homeTutorName,
    yogaFor,
    // groupSessionPrice_Day,
    // groupSessionPrice_Month,
    // privateSessionPrice_Day,
    // privateSessionPrice_Month,
    experiences,
    images,
    instructors,
    serviceAreas,

  } = tutor;

  const handleHomeTutorPress = (id) => {
    console.log(id);
    console.log('latitude :' + latitude);
    console.log('longitude :' + longitude);
    navigation.navigate('ShowInstructorForUser', {
      homeTutorId: id,
      latitude: latitude,
      longitude: longitude,
      distance: distance,
    });
  };

  const profileImage = images?.[0]?.path || 'https://via.placeholder.com/150';
  const serviceAreaDistance = serviceAreas?.[0]?.distance
  ? `${serviceAreas[0].distance.toFixed(2)} km`
  : 'Distance not available';
  // Limit yogaFor and experiences
  const yogaForArray = JSON.parse(yogaFor) || [];
  const displayedYogaFor = yogaForArray.slice(0, showFullYogaFor ? yogaForArray.length : 2);

  return (
    <ScrollView>
      <TouchableOpacity
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
          backgroundColor: '#fff',
          borderRadius: 8,
          borderColor: '#F9F9F9',
          borderWidth: 1,
          elevation: 1,
        }}
        onPress={() => handleHomeTutorPress(id)}
      >
        <View style={styles.header}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Avatar
              rounded
              source={{ uri: profileImage }}
              size={65}
              marginHorizontal={10}
              marginVertical={0}
            />
          </View>
          <View>
            <Text style={[styles.name, { fontSize: 15, marginTop: 2, marginHorizontal: 15 }]}>
              {homeTutorName}
            </Text>
            {/* <View style={styles.distanceContainer}>
              <Ionicons name="location-sharp" size={11} color={'red'} style={{marginBottom:3}} />
              <Text style={styles.distanceText}>
               {serviceAreaDistance} away 
              </Text>
            </View> */}
            {displayedYogaFor.map((item, index) => (
              <TextIcon
                key={index}
                icon="checkmark-sharp"
                text={item}
                isFirst={index === 0}
              />
            ))}

{(instructors.totalExperienceInYears && (
              <TextIcon
                icon="checkmark-sharp"
                text={`${instructors.totalExperienceInYears} Years Experience`}     
                           // isFirst={index === 0}
              />
            ))}
          
            {/* Read More / Show Less Button */}
            {yogaForArray.length > 2 && (
              <TouchableOpacity
                onPress={() => setShowFullYogaFor(!showFullYogaFor)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  marginHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontFamily:'Poppins-Medium',
                    fontSize: 12,
                  }}
                >
                  {showFullYogaFor ? 'Show Less' : 'Read More'}
                </Text>
                <Ionicons
                  name={showFullYogaFor ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={COLORS.primary}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* {serviceAreas.length > 0 && (
          <View style={{ marginHorizontal: 15, marginTop: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: COLORS.dark }}>
              Service Areas:
            </Text>
            {serviceAreas.map((area) => (
              <TextIcon
                key={area.id}
                icon="location-sharp"
                text={area.distance}
                isFirst={false}
              />
            ))}
          </View>
        )} */}

        {/* Session prices */}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginBottom: 5,
            marginHorizontal: 10,
          }}
        >
          {privateSessionPrice_Month && (
            <PriceCourse
              price={`₹${privateSessionPrice_Month}/ Month`}
              courseType="Private Session"
              isSession={false}
            />
          )}
          {privateSessionPrice_Day && (
            <PriceCourse
              price={`₹${privateSessionPrice_Day}/ Day`}
              courseType="Private Session"
              isSession={false}
            />
          )}
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginBottom: 5,
            marginHorizontal: 10,
          }}
        >
          {groupSessionPrice_Month && (
            <PriceCourse
              price={`₹${groupSessionPrice_Month}/ Month`}
              courseType="Group Session"
              isSession={false}
            />
          )}
          {groupSessionPrice_Day && (
            <PriceCourse
              price={`₹${groupSessionPrice_Day}/ Day`}
              courseType="Group Session"
              isSession={false}
            />
          )}
        </View> */}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Cards;
