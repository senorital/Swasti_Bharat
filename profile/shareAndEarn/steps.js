import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, StatusBar, TextInput, TouchableOpacity, BackHandler, Share } from "react-native";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../components/constants";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import Toast from "react-native-toast-message";
import Button from "../../components/button/Button";

const StepContainer = ({ content, subContent, icon }) => (
  <View>
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          {icon}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.stepContent}>{content}</Text>
        <Text style={styles.stepSubContent}>{subContent}</Text>
      </View>
    </View>
    <View style={styles.hr} />
  </View>
);

const Steps = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [userId, setUserId] = useState(user.data.id);

  const packageName = Constants.manifest?.android?.package || "com.swastibharat.partners";
  const inviteLink = `https://play.google.com/store/apps/details?id=${packageName}&userId=${userId}`;
  


  const copyToClipboard = () => {
    Clipboard.setString(inviteLink);
    Toast.show({
      text1: 'Copied to clipboard!',
      position: 'bottom',
    });
  };

  const shareViaSocialMedia = async (platform) => {
    try {
      await Share.share({
        message: `Hi, I just invited you to use the Swasti Bharat - Partners app!\n\nStep 1: Share your referral link/code with your friends\n\nStep 2: Your friend registers on Swasti Bharat using your referral code/link\n\nStep 3: You and your friends earn cash when your friend makes their first investment on Swasti Bharat\n\nDownload the app Now. ${inviteLink}`,

      });
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  const handleInviteNow = () => {
    shareViaSocialMedia('share');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={styles.content}>
        <StepContainer content="Step 1" subContent="Share your referral link/code with your friends" icon={<Ionicons name="volume-high-outline" size={22} color="white" />} />
        <StepContainer content="Step 2" subContent="Your friend registers on Swasti Bharat using your referral code/link" icon={<FontAwesome5 name="address-book" size={22} color="white" />} />
        <StepContainer content="Step 3" subContent="You and your friends earn cash when your friend makes their first investment on Swasti Bharat" icon={<FontAwesome5 name="money-bill-wave" size={16} color="white" />} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inviteLink}
            editable={false}
          />
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>Tap to Copy</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inviteText}>or Invite via</Text>

        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => shareViaSocialMedia('whatsapp')} style={styles.socialButton}>
            <Ionicons name="logo-whatsapp" size={30} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareViaSocialMedia('facebook')} style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={30} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareViaSocialMedia('telegram')} style={styles.socialButton}>
            <FontAwesome name="telegram" size={30} color="#0088cc" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareViaSocialMedia('share')} style={styles.socialButton}>
            <Ionicons name="share-social" size={30} color={COLORS.grey} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={"Invite Now"}
          onPress={handleInviteNow}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  stepContainer: {
    marginVertical: 8,
    marginHorizontal: 20,
    flexDirection: "row",
  },
  iconContainer: {
    marginTop: 4,
  },
  icon: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 4,
    marginLeft: 20,
  },
  stepContent: {
    fontFamily: "Poppins",
    fontSize: 14,
    fontWeight: "700",
    width: 95,
    height: 20,
  },
  stepSubContent: {
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "400",
    flexWrap: 'wrap',
    width: 250,
    marginTop: 3,
  },
  hr: {
    width: "100%",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    opacity: 0.1,
    marginTop: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    borderColor: COLORS.icon_background,
    borderWidth: 1,
    borderRadius: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
  copyButton: {
    backgroundColor: COLORS.primary,
    padding: 13,
    borderRadius: 10,
  },
  copyButtonText: {
    color: COLORS.white,
    fontFamily: 'Poppins',
  },
  inviteText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins',
    marginVertical: 10,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    marginHorizontal: 8,
  },
  socialButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Steps;
