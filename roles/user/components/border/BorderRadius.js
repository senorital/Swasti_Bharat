import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const Border = ({ color }) => {
  const bottomWavePath = `
    M0 15 
    Q 10 5, 20 15 
    T 40 15 
    T 60 15 
    T 80 15 
    T 100 15 
    T 120 15 
    T 140 15 
    T 160 15 
    T 180 15 
    T 200 15 
    T 220 15 
    T 240 15 
    T 260 15 
    T 280 15 
    T 300 15 
    T 320 15 
    T 340 15 
    T 360 15 
    T 380 15 
    T 400 15 
    T 420 15 
    T 440 15 
    T 460 15 
    T 480 15 
    T 500 15 
    T 520 15 
    T 540 15 
    T 560 15 
    T 580 15 
    T 600 15 
    T 620 15 
    T 640 15 
    T 660 15 
    T 680 15 
    T 700 15 
    T 720 15 
    Q 730 5, 740 15
    V 30 
    H 0 
    Z
  `;
  const topWavePath = `
    M0 15 
    Q 10 25, 20 15 
    T 40 15 
    T 60 15 
    T 80 15 
    T 100 15 
    T 120 15 
    T 140 15 
    T 160 15 
    T 180 15 
    T 200 15 
    T 220 15 
    T 240 15 
    T 260 15 
    T 280 15 
    T 300 15 
    T 320 15 
    T 340 15 
    T 360 15 
    T 380 15 
    T 400 15 
    T 420 15 
    T 440 15 
    T 460 15 
    T 480 15 
    T 500 15 
    T 520 15 
    T 540 15 
    T 560 15 
    T 580 15 
    T 600 15 
    T 620 15 
    T 640 15 
    T 660 15 
    T 680 15 
    T 700 15 
    T 720 15 
    Q 730 25, 800 15
    V 0 
    H 0 
    Z
  `;

  return (
    <View style={styles.container}>
      <Svg height="30" width="100%" style={styles.top}>
        <Path d={topWavePath} fill={color} />
      </Svg>
      {/* <Svg height="30" width="100%" style={styles.bottom}>
        <Path d={bottomWavePath} fill={color} />
      </Svg> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '88.9%',
    height: 10,
   marginTop:-20,
   marginHorizontal:20,
   borderBottomLeftRadius:50,
   borderBottomRightRadius:50,
    },
  top: {
    position: 'absolute',
    top: 10, 
    left: 0,
    bottom:0,
    width: '100%',
    zIndex: 1, 
    borderBottomLeftRadius:50,
    borderBottomRightRadius:50,

  },
  bottom: {
    position: 'absolute',
    bottom:9, 
    left: 0,
    width: '80%',
    zIndex: 1, 
    borderBottomLeftRadius:50,
    borderBottomRightRadius:50,

  },
});

export default Border;
