import React from 'react';
import { COLORS, icons } from '../../../../components/constants';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G, Text as SvgText, TSpan } from 'react-native-svg';

const HalfCircleWithSections = () => {
  const images = [
    icons.chakra7,
    icons.chakra6,
    icons.chakra5,
    icons.chakra4,
    icons.chakra3,
    icons.chakra2,
    icons.chakra1,
  ];

  const colors = [COLORS.dark_purple, COLORS.purple, COLORS.blue, COLORS.green, COLORS.yellow, COLORS.orange, COLORS.red];
  const labels = ["", "", "", "", "", "", ""]; // Text labels for each section
  const radius = 165; // Radius of the main half-circle
  const centerX = radius;
  const centerY = radius;
  const sectionCount = 7;
  const bottomMargin = 20; // Margin from the bottom of the container

  // Function to generate path for each section
  const generatePath = (index) => {
    const angle = (Math.PI / sectionCount) * index;
    const nextAngle = (Math.PI / sectionCount) * (index + 1);

    const startX = centerX + radius * Math.cos(angle);
    const startY = centerY - radius * Math.sin(angle);
    const endX = centerX + radius * Math.cos(nextAngle);
    const endY = centerY - radius * Math.sin(nextAngle);

    const sectionHeight = bottomMargin;

    const smallStartX = centerX + (radius + sectionHeight) * Math.cos(angle);
    const smallStartY = centerY - (radius + sectionHeight) * Math.sin(angle);
    const smallEndX = centerX + (radius + sectionHeight) * Math.cos(nextAngle);
    const smallEndY = centerY - (radius + sectionHeight) * Math.sin(nextAngle);

    const textX = centerX + (radius + sectionHeight / 2) * Math.cos(angle + (Math.PI / sectionCount) / 2);
    const textY = centerY - (radius + sectionHeight / 2) * Math.sin(angle + (Math.PI / sectionCount) / 2);

    return {
      mainSection: `
        M ${centerX},${centerY}
        L ${startX},${startY}
        L ${endX},${endY}
        L ${centerX},${centerY}
        Z
      `,
      smallSection: `
        M ${startX},${startY}
        L ${smallStartX},${smallStartY}
        L ${smallEndX},${smallEndY}
        L ${endX},${endY}
        Z
      `,
      text: {
        x: textX,
        y: textY,
      },
    };
  };

  // Function to get image position
  const getImagePosition = (index) => {
    const angle = (Math.PI / sectionCount) * (index + 0.5);
    const imgRadius = radius * 0.8; // Adjust image radius proportionally
    const imgWidth = 40; // Adjust image width
    const imgHeight = 40; // Adjust image height

    const imgX = centerX + imgRadius * Math.cos(angle);
    const imgY = centerY - imgRadius * Math.sin(angle);

    return {
      left: imgX - imgWidth / 2,
      top: imgY - imgHeight / 2, // Center the image vertically
    };
  };

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2 + bottomMargin} viewBox={`0 0 ${radius * 2} ${radius * 2 + bottomMargin}`}>
        <Defs>
          {colors.map((color, index) => (
            <LinearGradient
              key={index}
              id={`gradient${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="100%" stopColor={color} stopOpacity={1} />
              <Stop offset="100%" stopColor={COLORS.white} stopOpacity={1} />
            </LinearGradient>
          ))}
        </Defs>
        {/* Main half-circle sections */}
        {colors.map((color, index) => {
          const paths = generatePath(index);

          return (
            <G key={index}>
              <Path d={paths.mainSection} fill={`url(#gradient${index})`} stroke="white" strokeWidth={2} />
              {/* <Path d={paths.smallSection} fill="white" stroke="white" strokeWidth={2} /> */}
              <SvgText
                x={paths.text.x}
                y={paths.text.y}
                fill="black"
                fontSize="12" // Adjusted font size
                fontFamily='Poppins_Medium'
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                <TSpan dy={5}>{labels[index]}</TSpan>
              </SvgText>
            </G>
          );
        })}
      </Svg>
      {/* Images overlay */}
      {images.map((image, index) => {
        const position = getImagePosition(index);
        return (
          <Image
            key={index}
            source={image}
            style={[
              styles.image,
              { left: position.left, top: position.top }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: 'relative',
    width: 330, // Adjusted width to match SVG
    height: 150, // Increased height to match SVG and added space at the bottom
  },
  image: {
    position: 'absolute',
    width: 40, // Adjusted image width
    height: 40, // Adjusted image height
    resizeMode: 'contain',
  },
});

export default HalfCircleWithSections;
