import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation,useRoute } from '@react-navigation/native';
import { windowWidth } from '../utils/Dimensions';

const Questions = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [progress, setProgress] = useState(null); // Initialize as null
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const { authToken } = route.params;

    const questions = [
        {
            question: "Question 1",
            options: ["Lose weight and increase stamina ", "Maintain weight for health", "Gain weight for building muscle", "Option 4"]
        },
        {
            question: "Question 2",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"]
        },
        {
            question: "Question 3",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"]
        },
        // Add more questions as needed
    ];

    const handleTabSelect = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
        if (currentQuestionIndex < questions.length - 1) {
            const newProgress = progress === null ? (100 / questions.length) : progress + (100 / questions.length); // Increment progress if already set
            setProgress(Math.min(newProgress, 100));

            Animated.timing(slideAnim, {
                toValue: -windowWidth,
                duration: 500,
                useNativeDriver: false
            }).start(() => {
                slideAnim.setValue(0);
                setCurrentQuestionIndex(currentQuestionIndex + 1);

                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                }).start();
            });
        } else {
            navigation.navigate('TabNavigator',{authToken});
        }
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            {progress !== null && <ProgressBar progress={progress / 100} color={'orange'} />} 
                        <Text style={styles.boldText}>Tell us your Goal</Text>
            <Text style={styles.smalltext}>We will recommend diets and exercises that suit you</Text>
            <Animated.View style={[styles.questionContainer, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.optionsContainer}>
                    {questions[currentQuestionIndex].options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.optionButton}
                            onPress={() => handleTabSelect(index)}>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

export default Questions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:70,
        paddingHorizontal: 20
    },
    smalltext: {
        fontFamily: 'Poppins',
        fontSize: 15,
        textAlign:'left',
        marginBottom: 10,
        color: '#000',
      },
    boldText: {
        fontSize: 35,
        marginTop: 10,
        fontFamily : 'Poppins-SemiBold',
        textAlign:'left'
    },
    questionContainer: {
        width: windowWidth,
    },
    optionsContainer: {
        marginTop:23
    },
    optionButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 48,
        width : windowWidth/1.25,
        borderColor: '#F2F4F5',
        borderWidth : 1
    },
    optionText: {
        fontSize: 16,
        fontFamily:'Poppins'
    }
});
