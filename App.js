import React,{useState,useEffect} from "react";
import { Provider } from "react-redux";
import {store} from "./redux/store/store";
import Main from "./main/Main";
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
