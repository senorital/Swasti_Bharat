import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FormInput from '../components/Form/FormInput';
import { StatusBar } from 'expo-status-bar';
import { signup } from '../context/actions/authActions';
import { connect, useDispatch, useSelector } from 'react-redux'; // Import useDispatch

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch(); // Get dispatch function

  const handleSignUp = async () => {
    const isInstructor = "false";
    const userData = { name, email, phoneNumber , password , isInstructor};
    const response = await dispatch(signup(userData)); 
    console.log(response.authToken);
    if (response && response.authToken) { 
      navigation.navigate('TabNavigator');
    } else {
      console.log('Register failed'); 
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" backgroundColor="#FC9D45" />
   
      <Text style={styles.text}>Create your Account</Text>
      <View style={styles.formContainer}>
     
        <FormInput
          labelValue={name}
          onChangeText={(userName) => setName(userName)}
          placeholderText="Name"
          iconType="user"
          autoCapitalize="words"
          autoCorrect={false}
        />

        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          iconType="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={phoneNumber}
          onChangeText={(number) => setphoneNumber(number)}
          placeholderText="Mobile Number"
          iconType="phone"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity onPress={handleSignUp}>
          <LinearGradient
            colors={['#FC9D45', '#FC9C45']}
            style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Register</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.navButtonText}>
            Already have an account?{' '}
            <Text style={{ color: '#FC9D45' }}>Login</Text>
          </Text>
        </TouchableOpacity>
     
      </View>
    </ScrollView>
  );
};

export default connect(null, { signup })(SignUp);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#FC9D45',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginBottom: 10,
    color: '#fff',
    marginLeft: 19,
    marginRight: 19,
  },
  forgotButton: {
    marginVertical: 50,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#573353',
    fontFamily: 'Poppins',
  },
  appButtonContainer: {
    elevation: 8,
    marginTop: 23,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 100,
  },
  appButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
  },
});
