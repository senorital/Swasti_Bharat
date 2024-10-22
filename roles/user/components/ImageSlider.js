// import React from 'react';
// import { View, Image, ScrollView, StyleSheet, Text } from 'react-native';
// import { windowHeight, windowWidth } from '../utils/Dimensions';

// const ImageSlider = ({ text,texts,image,backgroundColor}) => {
//   console.log(windowWidth);
//   console.log(windowHeight);

//   return (
   
//       <View style={[styles.container,{backgroundColor}]}>
//         <View style={styles.content}>
//           <View style={{ flexDirection: 'column', alignItems: 'flex-end'}}>
//             <View style={{width:190,alignItems:'flex-start',marginBottom:30}}>
//             <Text style={styles.text}>{text}</Text>
//             <Text style={styles.texts}>{texts}</Text>
//           </View>
//           </View>
//           <Image
//             source={image}
//             style={styles.image}
//           />
//         </View>
//       </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//    alignItems:'center',
//     width: windowWidth / 1.1,
//     minHeight: windowHeight / 7,
//     // paddingLeft: 0,
//     borderRadius: 12,
//     margin:10,
//     marginLeft:0
//     // marginLeft: 10, // Adjust margin as needed
//   },
//   content: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     justifyContent: 'flex-end',
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'Poppins',

//   },
//   texts: {
//     color: 'white',
//     fontSize: 13,
   
//     fontFamily: 'Poppins',
//   },
//   image: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//     margin: 10, // Adjust margin as needed
//   },
// });

// export default ImageSlider;


import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { windowHeight, windowWidth } from '../utils/Dimensions';

const ImageSlider = ({ images }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row' }}>
        {images.map((image, index) => (
          <Image key={index} source={image} style={{width:windowWidth/1.28, resizeMode: 'contain',marginLeft:0,marginRight:10}} />
        ))}
      </View>
    </ScrollView>
  );
};

export default ImageSlider;

