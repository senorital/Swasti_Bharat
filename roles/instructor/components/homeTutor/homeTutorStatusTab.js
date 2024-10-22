import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../../components/constants";

export default function HomeTutorStatusTab({
  selectionMode,
  option1,
  option2,
  option3,
  onSelectSwitch,
}) {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = (value) => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };
  return (
    <View
      style={{
        height: hp("6.5%"),
        width: "100%",
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius:10,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
          flex: 1,
          backgroundColor:
            getSelectionMode == 1 ? COLORS.white: null,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          height: hp("5%"),
        margin:5
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: wp("3.5%"),
            color: getSelectionMode == 1 ? COLORS.primary : COLORS.white,
          }}
        >
          {option1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(2)}
        style={{
          flex: 1,
          backgroundColor:
            getSelectionMode == 2 ? COLORS.white: null,
          borderRadius:10,
          justifyContent: "center",
          alignItems: "center",
          height: hp("5%"),
          margin:5
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: wp("3.5%"),
            color: getSelectionMode == 2 ? COLORS.primary : COLORS.white,
          }}
        >
          {option2}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(3)}
        style={{
          flex: 1,
          backgroundColor:
            getSelectionMode == 3 ? COLORS.white : null,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          height: hp("5%"),
          margin:5
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: wp("3.5%"),
            color: getSelectionMode == 3 ? COLORS.primary : COLORS.white,
          }}
        >
          {option3}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
