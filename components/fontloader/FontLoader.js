// import { Font } from 'expo-font';
import * as Font from 'expo-font';

const loadCustomFonts = async () => {
  await Font.loadAsync({
    'Poppins': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium' : require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Black' : require('../../assets/fonts/Poppins-Black.ttf'),


  });
};

export default loadCustomFonts;

