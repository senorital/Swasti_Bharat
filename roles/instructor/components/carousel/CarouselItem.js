import React, { useState, useRef } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
import { COLORS } from "../../../../components/constants";

const CarouselItem = () => {
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);

  const banner = [
    { id: 1, image: require("../../../../assets/home/banner3.jpg") },
    { id: 2, image: require("../../../../assets/home/banner1.jpg") },
    { id: 3, image: require("../../../../assets/home/banner1.jpg") },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={isCarousel}
        data={banner}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setIndex(index)}
        loop={true}
        autoplay={true}
        autoplayDelay={500}
        autoplayInterval={3000}
      />
      <Pagination
        dotsLength={banner.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        containerStyle={styles.paginationContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,

  },
  carouselImage: {
    width: ITEM_WIDTH,
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  inactiveDotStyle: {
    backgroundColor: COLORS.grey,
  },
});

export default CarouselItem;
