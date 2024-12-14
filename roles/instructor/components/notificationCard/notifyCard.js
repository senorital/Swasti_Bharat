import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TouchableHighlight } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { COLORS } from '../../../../components/constants';
import { useNavigation } from '@react-navigation/native';

const NotificationCard = ({ title, text, icon, color1, color2, progress, isProfileCompletion, borderColor, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={{ flex: 1, marginHorizontal: 17 }}
      onPress={() => navigation.navigate(navigateTo)}
      disabled={!navigateTo} // Disable touch if navigateTo is empty
    >
      <View style={[styles.notifyContainer, { backgroundColor: color1, borderColor: borderColor }]}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: COLORS.black }]}>{title}</Text>
          {isProfileCompletion && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress / 100} color={'#6BBBFF'} style={styles.progressBar} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.completeText}>Complete your profile</Text>
                <Text style={styles.progressText}>{`${progress}%`}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notifyContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: COLORS.black,
  },
  progressContainer: {
    marginTop: 0,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    color: COLORS.black,
    alignSelf: 'flex-end',
  },
  progressBar: {
    height: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 5,
  },
  completeText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: COLORS.black,
  },
});

export default NotificationCard;
