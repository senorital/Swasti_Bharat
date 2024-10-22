import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  Image,
} from "react-native";
import { COLORS, icons } from "../../components/constants";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import HalfCircleWithSections from "../../roles/instructor/components/chakra/chakra";
import { getReferralData,getchakras } from '../../redux/actions/instructor/redeem/redeem';
import { useIsFocused } from '@react-navigation/native'; // Import the useIsFocused hook
import { useNavigation } from '@react-navigation/native';

const chakraColors = {
  chakra1: COLORS.red,
  chakra2: COLORS.orange,
  chakra3: COLORS.yellow,
  chakra4: COLORS.green,
  chakra5: COLORS.blue,
  chakra6: COLORS.purple,
  chakra7: COLORS.dark_purple,
};

const Referral = ({ navigation }) => {
  const dispatch = useDispatch();
  const { referrals = [], loadingReferrals, error } = useSelector((state) => state.referralData); // Provide default values
  const { chakras = [], loadingChakras, chakraError } = useSelector((state) => state.referralData);
  const isFocused = useIsFocused(); // Get the isFocused value

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["40%", "90%"];

  useEffect(() => {
    bottomSheetModalRef.current?.present();

 
  }, [navigation]);

  useEffect(() => {
    bottomSheetModalRef.current?.present();

    return () => {
      bottomSheetModalRef.current?.dismiss();
    };
  }, []);
 // Process chakras to count quantities and align images
  // Ensure chakras is an array before processing
  const processedChakras = Array.isArray(chakras) ? chakras.reduce((acc, chakra) => {
    if (chakra.quantity > 0) {
      acc[chakra.chakraNumber] = (acc[chakra.chakraNumber] || 0) + chakra.quantity;
    }
    return acc;
  }, {}) : {};

  const copyToClipboard = () => {
    Clipboard.setString(inviteLink);
    Toast.show({
      text1: 'Copied to clipboard!',
      position: 'bottom',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <SafeAreaView style={styles.safeArea}>
        <HalfCircleWithSections />
      </SafeAreaView>
      <View style={styles.totalContainer}>
        <View style={styles.total}>
          <Text style={styles.chakraText}>Total Chakras</Text>
          {/* <View style={styles.imagesContainer}> */}
            {/* {Object.keys(chakraColors).map((chakra, index) => {
              const borderColor = index < 4 ? chakraColors[chakra] : 'transparent';
              return (
                // <Image
                //   key={index}
                //   source={icons[chakra]}
                //   style={[
                //     styles.image,
                //     { borderColor, zIndex: 10 - index, left: index * 10 },
                //   ]}
                // />
              );
            })} */}
          {/* </View> */}
          <Text style={styles.chakraText}>
            {Object.values(processedChakras).reduce((a, b) => a + b, 0)}
          </Text>    
              </View>
              <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeem}>Redeem Now</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={styles.bottomSheet}
          enablePanDownToClose={false} // Allow swipe down to close
          enableContentPanningGesture={true} // Enable panning gestures on content
       
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Referrals</Text>
            {loadingReferrals && <Text>Loading referrals...</Text>}
            {error && <Text>Error: {error}</Text>}
            {!Array.isArray(referrals) ? (
              <Text>No referrals available</Text>
            ) : referrals.length === 0 ? (
              <Text>No referrals available</Text>
            ) : (
              referrals.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.studioCard}
                >
                  <View style={styles.row}>
                    <Text style={styles.number}>{index + 1}</Text>
                    <View style={styles.nameContainer}>
                      <Text style={styles.title}>{item.joinerName}</Text>
                    </View>
                    <Image source={item.image} style={styles.studioImage} />
                  </View>
                  <View style={styles.hr} />
                </TouchableOpacity>
              ))
            )}
            </View>
           
          </View>
        </BottomSheetModal>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  redeem: {
    fontFamily: 'Poppins_Medium',
    color: COLORS.white,
    fontSize: 12,
    textAlign:'center',
    padding:5
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 8,
    position: 'absolute',
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: 80, // Adjust this width based on the number of images and overlap
  },
  totalContainer: {
    marginHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  total: {
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    padding: 6,
  },
  redeemButton: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 10,
    height:40,
    marginTop:3
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  hr: {
    position: "relative",
    width: "100%",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    opacity: 0.1,
    marginTop: 0,
  },
  studioImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 17,
    textAlign: 'left',
    marginBottom: 10,
    marginVertical: 20,
  },
  modalContent: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  bottomSheet: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderColor: COLORS.background,
    borderWidth: 1,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  number: {
    fontFamily: "Poppins",
    fontSize: hp(2),
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins_Medium',
    fontSize: 14,
    marginVertical: 10,
  },
  chakraText: {
    fontFamily: 'Poppins_Medium',
    fontSize: 12,
    color: COLORS.primary,
    padding: 5,
    borderRadius: 10,
  },
});

export default Referral;
