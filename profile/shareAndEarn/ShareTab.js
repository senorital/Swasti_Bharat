import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../components/constants";

export default function ShareTab({
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
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: wp("100%"),
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
          flex: 1,
          borderRadius: wp("100%"),
          justifyContent: "center",
          alignItems: "center",
          height: hp("5%"),
          // margin: 5,
          borderBottomWidth: getSelectionMode == 1 ? 2 : 0,
          borderBottomColor: getSelectionMode == 1 ? COLORS.primary : "transparent",
        }}
      >
        <Text
          style={{
            fontFamily: "PoppinsSemiBold",
            fontSize: wp("4%"),
            color: getSelectionMode == 1 ? COLORS.primary : "grey",
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
          borderRadius: wp("100%"),
          justifyContent: "center",
          alignItems: "center",
          height: hp("5%"),
          // margin: 5,
          borderBottomWidth: getSelectionMode == 2 ? 2 : 0,
          borderBottomColor: getSelectionMode == 2 ? COLORS.primary : "transparent",
        }}
      >
        <Text
          style={{
            fontFamily: "PoppinsSemiBold",
            fontSize: wp("3.5%"),
            color: getSelectionMode == 2 ? COLORS.primary : "grey",
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
          borderRadius: wp("100%"),
          justifyContent: "center",
          alignItems: "center",
          height: hp("5%"),
          // margin: 5,
          borderBottomWidth: getSelectionMode == 3 ? 2 : 0,
          borderBottomColor: getSelectionMode == 3 ? COLORS.primary : "transparent",
        }}
      >
        <Text
          style={{
            fontFamily: "PoppinsSemiBold",
            fontSize: wp("3.5%"),
            color: getSelectionMode == 3 ? COLORS.primary : "grey",
          }}
        >
          {option3}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
