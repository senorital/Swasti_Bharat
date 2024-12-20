// Button.js
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { theme } from './theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFeather = Animated.createAnimatedComponent(Feather);

export function Button({ dataLength, flatListIndex, flatListRef, navigate }) {
  const buttonAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      width: isLastScreen ? withSpring(140) : withSpring(60),
      height: 60,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      opacity: isLastScreen ? withTiming(0) : withTiming(1),
      transform: [
        { translateX: isLastScreen ? withTiming(100) : withTiming(0) },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      opacity: isLastScreen ? withTiming(1) : withTiming(0),
      transform: [
        { translateX: isLastScreen ? withTiming(0) : withTiming(-100) },
      ],
    };
  });

  const handleNextScreen = () => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    if (isLastScreen) {
      navigate(); // Navigate to the LoginScreen
    } else {
      flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
    }
  };

  return (
    <AnimatedPressable
      onPress={handleNextScreen}
      style={[styles.container, buttonAnimationStyle]}
    >
      <Animated.Text style={[styles.text, textAnimationStyle]}>
        Get Started
      </Animated.Text>

      <AnimatedFeather
        name="arrow-right"
        size={30}
        color={theme.colors.textHighlightColor}
        style={[styles.arrow, arrowAnimationStyle]}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundHighlightColor,
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
  },
  text: {
    position: 'absolute',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: theme.colors.textHighlightColor,
  },
});
