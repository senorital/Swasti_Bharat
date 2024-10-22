// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import Onboarding from 'react-native-onboarding-swiper';
// import { MaterialIcons } from '@expo/vector-icons';
// import { StatusBar } from 'expo-status-bar';

// const CustomDot = ({ selected }) => {
//   let backgroundColor = selected ? '#f5983e' : '#fcc896';
//   return (
//     <View
//       style={{
//         width: 10,
//         height: 10,
//         marginHorizontal: 5,
//         borderRadius: 5,
//         backgroundColor,
//       }}
//     />
//   );
// };

// const CustomSkip = ({ onPress }) => (
//   <TouchableOpacity style={styles.skipButton} onPress={onPress}>
//     <Text style={{ color: '#FC9D45', fontSize: 17, fontFamily: 'Poppins' }}>Skip</Text>
//   </TouchableOpacity>
// );

// const CustomNext = ({ onPress }) => (
//   <TouchableOpacity style={styles.nextButton} onPress={onPress}>
//     <MaterialIcons name="arrow-forward" size={24} color="#FC9D45" />
//   </TouchableOpacity>
// );

// const OnboardingScreen = ({ navigation }) => {
//   const handleSkip = () => {
//     navigation.replace('LoginScreen');
//   };

//   const handleDone = () => {
//     navigation.navigate('LoginScreen');
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor='#fff' />
//       <View style={styles.onboardingContainer}>
//         <Onboarding
//           DotComponent={CustomDot}
//           bottomBarColor="#fff"
//           showPagination={true}
//           transitionAnimationDuration={500}
//           bottomBarHeight={60}
//           bottomBarStyles={{ justifyContent: 'flex-start' }}
//           paginationContainerStyle={[styles.paginationContainer, { left: 20 }]}
//           SkipButtonComponent={({ onPress }) => <CustomSkip onPress={onPress} />}
//           NextButtonComponent={({ onPress }) => <CustomNext onPress={onPress} />}
//           onSkip={handleSkip}
//           onDone={handleDone}
//           pages={[
//             {
//               backgroundColor: '#fff',
//               image: (
//                 <Image
//                   source={require('../assets/intro-yoga/4.jpeg')}
//                   style={{ width: 300, height: 300 }}
//                 />
//               ),
//               title: 'Yoga is Wellness',
//               subtitle: 'Yoga exists in the world because everything is linked.',
//               titleStyles: { fontFamily: 'Poppins-SemiBold' },
//               subTitleStyles: { fontFamily: 'Poppins' },
//             },
//             {
//               backgroundColor: '#fff',
//               image: (
//                 <Image
//                   source={require('../assets/intro-yoga/5.png')}
//                   style={{ width: 300, height: 300 }}
//                 />
//               ),
//               title: 'Share Your Favorites',
//               subtitle:
//                 'The body is your temple. Keep it pure and clean for the soul to reside it.',
//               titleStyles: { fontFamily: 'Poppins-SemiBold' },
//               subTitleStyles: { fontFamily: 'Poppins' },
//             },
//             {
//               backgroundColor: '#fff',
//               image: (
//                 <Image
//                   source={require('../assets/intro-yoga/1.png')}
//                   style={{ width: 300, height: 300 }}
//                 />
//               ),
//               title: 'Become The Star',
//               subtitle: "Yoga is almost like music; in a way, there's no end to it.",
//               titleStyles: { fontFamily: 'Poppins-SemiBold' },
//               subTitleStyles: { fontFamily: 'Poppins' },
//             },
//           ]}
//         />
//       </View>
//     </View>
//   );
// };

// export default OnboardingScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   onboardingContainer: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   paginationContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   skipButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//   },
//   nextButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
// });


// OnboardingScreen.js
import React from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Button } from '../components/onboarding/OnButton';
import { Pagination } from '../components/onboarding/Pagination';
import { theme } from '../components/onboarding/theme';
import { data } from '../components/onboarding/data';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const RenderItem = ({ item, index, x }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      width: SCREEN_WIDTH * 0.8,
      height: SCREEN_WIDTH * 0.8,
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <Animated.Image source={item.image} style={imageAnimatedStyle} />
      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemText}>{item.text}</Text>
      </Animated.View>
    </View>
  );
};

const OnboardingScreen = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const flatListRef = useAnimatedRef();
  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);
  const navigation = useNavigation();

  const onViewableItemsChanged = ({ viewableItems }) => {
    flatListIndex.value = viewableItems[0].index ?? 0;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='white'/>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <RenderItem index={index} item={item} x={x} />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.footerContainer}>
        <Pagination data={data} screenWidth={SCREEN_WIDTH} x={x} />
        <Button
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          navigate={() => navigation.navigate('LoginScreen')} // Pass navigation function
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemTitle: {
    color: theme.colors.textColor,
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemText: {
    color: theme.colors.textColor,
    textAlign: 'center',
    lineHeight: 20,
    justifyContent: 'space-evenly',
    fontFamily: 'Poppins',
    marginHorizontal: 30,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
  },
});

export default OnboardingScreen;


