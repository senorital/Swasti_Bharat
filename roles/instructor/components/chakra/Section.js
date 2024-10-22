import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const Section = ({ index, totalSections, image }) => {
    const angle = 180 / totalSections;
    const rotation = `${index * angle - 90}deg`;

    return (
        <View 
            style={[
                styles.section, 
                { 
                    transform: [
                        { rotate: rotation }, // Rotate each section
                        { translateY: -150 }, // Move each section into place
                        { translateX: -75 } // Center the section horizontally
                    ]
                }
            ]}
        >
            <Image source={image} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        position: 'absolute',
        width: 150,
        height: 150,
        top: 0,
        left: 0,
        backgroundColor: 'transparent', // No background color
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: 'center bottom',
    },
    image: {
        width: 50, // Adjust as needed
        height: 50, // Adjust as needed
        resizeMode: 'contain',
    },
});

export default Section;
