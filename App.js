import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import Main from "./main/Main";
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loadCustomFonts from "./components/fontloader/FontLoader";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await loadCustomFonts();
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  // Function to fetch and store the referral code
 

  // Call the function to fetch and store referral code on app startup
  // useEffect(() => {
  //   fetchAndStoreReferralCode();
  // }, []);

  // Check if fonts are loaded before rendering the main component
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
