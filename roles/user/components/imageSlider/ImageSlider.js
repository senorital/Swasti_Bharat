import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../../components/constants';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const defaultBannerImages = [
  require('../../../../assets/home/banner1.jpg'),
  require('../../../../assets/home/banner3.jpg'),
  require('../../../../assets/home/banner3.jpg')
];

const ImageSlider = ({ bannerImages = [] }) => {
  const imagesToDisplay = bannerImages.length > 0 ? bannerImages : defaultBannerImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Auto-sliding functionality
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % imagesToDisplay.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [currentIndex, imagesToDisplay.length]);

  const renderItem = ({ item }) => (
    <Image
      source={item.path ? { uri: item.path } : item}
      style={styles.bannerImage}
    />
  );

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / 100);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.sliderContainer}>
      {/* Image Slider */}
      <FlatList
        data={imagesToDisplay}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onScroll={handleScroll}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {imagesToDisplay.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginVertical: 20,
    borderRadius: 10,
    width: ITEM_WIDTH
  },
  bannerImage: {
    width: ITEM_WIDTH/1,
    height: SCREEN_HEIGHT/7, // Adjust height as needed
    resizeMode: 'cover',
    borderRadius: 10,
    marginHorizontal:3
    
  },
  pagination: {
    position: 'absolute', // Absolute positioning to overlay on the image
    bottom: -15, // Position it slightly above the bottom edge of the image
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default ImageSlider;
