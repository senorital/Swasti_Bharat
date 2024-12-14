import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { COLORS } from "../../components/constants";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";  // Import NetInfo

import { getchakras, getReferralData } from '../../redux/actions/instructor/redeem/redeem';
import HalfCircleWithSections from "../../roles/instructor/components/chakra/chakra";

// Define a mapping of chakra images based on chakra number
const chakraImages = {
  1: require('../../assets/chakra/1.png'),
  2: require('../../assets/chakra/2.png'),
  3: require('../../assets/chakra/3.png'),
  4: require('../../assets/chakra/4.png'),
  5: require('../../assets/chakra/5.png'),
  6: require('../../assets/chakra/6.png'),
  7: require('../../assets/chakra/7.png'),
};

const Referral = ({ navigation }) => {
  const dispatch = useDispatch();
  const [chakras, setChakras] = useState([]);
  const [referralData, setReferralData] = useState([]);
  const [loadingChakras, setLoadingChakras] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);  // State to track network status

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["40%"];
  const isFocused = useIsFocused();

  useEffect(() => {
    // Check network status on mount
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);  // Update isConnected state
    });

    // Cleanup on component unmount
    return () => {
      unsubscribe(); // Unsubscribe from network state changes
    };
  }, []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, [navigation]);

  useEffect(() => {
    bottomSheetModalRef.current?.present();

    return () => {
      bottomSheetModalRef.current?.dismiss();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      const fetchChakras = async () => {
        try {
          const response = await dispatch(getchakras());
          if (response?.success) {
            setChakras(response?.data);
          } else {
            setError("Failed to fetch chakras");
          }
        } catch (err) {
          setError("Error fetching chakras");
        } finally {
          setLoadingChakras(false);
        }
      };

      if (isFocused) {
        fetchChakras();
      }
    } else {
      setError("No internet connection");
    }
  }, [isConnected, isFocused]);

  useEffect(() => {
    if (isConnected) {
      const fetchReferralData = async () => {
        try {
          const response = await dispatch(getReferralData());

          if (response?.success) {
            setReferralData(response?.data);
          } else {
            setError("No referral data available or failed to fetch.");
          }
        } catch (err) {
          console.error("Error fetching referral data:", err);
          setError("Error fetching referral data");
        }
      };

      if (isFocused) {
        fetchReferralData();
      }
    } else {
      setError("No internet connection");
    }
  }, [isConnected, isFocused]);

  const processedChakras = chakras.reduce((acc, chakra) => {
    if (chakra.quantity > 0) {
      acc[chakra.chakraNumber] = (acc[chakra.chakraNumber] || 0) + chakra.quantity;
    }
    return acc;
  }, {});

  const totalChakras = Object.values(processedChakras).reduce((a, b) => a + b, 0);

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
          <Text style={styles.chakraText}>Total Chakras :</Text>
          <Text style={styles.chakraText}>{totalChakras}</Text>
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
          enablePanDownToClose={false}
          enableContentPanningGesture={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Your Referrals</Text>
              {loadingChakras && <Text>Loading referrals...</Text>}
              {error && <Text>Error: {error}</Text>}
              {!loadingChakras && referralData.length === 0 && <Text>No referrals available</Text>}

              {referralData.map((referral, index) => (
                <View key={referral.id} style={styles.referralItem}>
                  <Text style={styles.referralText}>{referral.joinerName}</Text>
                  {chakraImages[referral.chakraNumber] ? (
                    <Image
                      source={chakraImages[referral.chakraNumber]}
                      style={styles.chakraImage}
                    />
                  ) : (
                    <Text style={styles.referralText}>Image not available</Text>
                  )}
                </View>
              ))}
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
    textAlign: 'center',
    padding: 5,
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
  chakraText: {
    fontFamily: 'Poppins',
    padding: 5,
    fontSize: 14,
  },
  redeemButton: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 10,
    height: 40,
    marginTop: 3,
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
  modalTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    textAlign: 'left',
  },
  modalContent: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomSheet: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  chakraImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  referralItem: {
    marginBottom: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.icon_background,
    borderRadius: 8,
  },
  referralText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.darkGray,
  },
});

export default Referral;
