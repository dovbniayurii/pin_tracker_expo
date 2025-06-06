import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {parsePhoneNumberFromString} from 'libphonenumber-js';

import {Icon, Text} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient'
import {useNavigation} from '@react-navigation/native';
import axiosPublic from '../../../axiosPublic';
import PhoneInput from 'react-native-international-phone-number';

const {width, height} = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = async () => {
    const phoneNumber = parsePhoneNumberFromString(
      phoneValue,
      selectedCountry?.cca2,
    );
    let formatted;
    if (phoneNumber?.isValid()) {
      formatted = phoneNumber.formatInternational().replace(/\s/g, '');
      // Submit formatted number (+12085689383)
      console.log(formatted);
    }

    if (!email && !formatted) {
      Alert.alert('Error', 'Please enter your email or phone number.');
      return;
    }

    try {
      const requestBody = {};
      if (email) {
        requestBody.email = email;
      }
      if (formatted) {
        requestBody.phone_number = formatted;
      }

      await axiosPublic.post('/api/users/forgot-password/', requestBody);

      navigation.navigate('OtpCode', {
        type: 'resat_password',
        email,
        phoneNumber: requestBody.phone_number || '',
      });
    } catch (err) {
      console.log('Error details:', err.response?.data);
      let errorMessage = 'Something went wrong.';

      if (err.response?.data) {
        if (err.response.data.email) {
          errorMessage = err.response.data.email;
        } else if (err.response.data.phone_number) {
          errorMessage = err.response.data.phone_number;
        }
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <ImageBackground
          source={require('../../assets/images/signupsky.png')}
          style={styles.background}
          resizeMode="cover">
          {/* Content container with semi-transparent overlay */}
          <View style={styles.contentContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Forgot Password?</Text>
                  <Text style={styles.subtitle}>
                    Enter your email or phone number to recover your password.
                  </Text>
                </View>

                {/* Email Input */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Email Address</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        borderColor:
                          focusedInput === 'email'
                            ? '#3E55C6'
                            : 'rgba(255, 255, 255, 0.3)',
                      },
                    ]}>
                    <Icon
                      source="email-outline"
                      size={20}
                      color={
                        focusedInput === 'email'
                          ? '#3E55C6'
                          : 'rgba(255, 255, 255, 0.6)'
                      }
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Phone Input */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View
                    style={[
                      styles.phoneWrapper,
                      {
                        borderColor:
                          focusedInput === 'phone'
                            ? '#3E55C6'
                            : 'rgba(255, 255, 255, 0.3)',
                      },
                    ]}>
                    <PhoneInput
                      value={phoneValue}
                      cursorColor="blue"
                      onChangePhoneNumber={setPhoneValue}
                      selectedCountry={selectedCountry}
                      onChangeSelectedCountry={setSelectedCountry}
                      containerStyle={styles.phoneContainer}
                      inputStyle={styles.phoneInput}
                      flagContainerStyle={styles.flagContainer}
                      onFocus={() => setFocusedInput('phone')}
                      onBlur={() => setFocusedInput(null)}
                      defaultCountry="US"
                      phoneInputStyles={{
                        container: {
                          backgroundColor: 'transparent',
                        },
                        input: {
                          color: 'white',
                          fontSize: 16,
                          backgroundColor: 'transparent',
                        },
                        flagContainer: {
                          //backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          backgroundColor: '#666666',
                        },
                        caret: {
                          color: '#F3F3F3',
                          fontSize: 16,
                        },
                        countryPickerButton: {
                          backgroundColor: 'transparent',
                        },
                        dialCode: {
                          color: 'white',
                        },
                      }}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  activeOpacity={0.8}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>

          {/* Bottom gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
            style={styles.gradientOverlay}
          />
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fallback color
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.08, // Responsive padding
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    marginBottom: height * 0.05, // Responsive margin
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: Math.min(32, width * 0.08), // Responsive font size
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Math.min(16, width * 0.04), // Responsive font size
    textAlign: 'center',
    maxWidth: '90%',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  phoneWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  phoneContainer: {
    backgroundColor: 'transparent',
    height: 56,
  },
  phoneInput: {
    color: 'white',
    fontSize: 16,
  },
  flagContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingLeft: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  submitButton: {
    backgroundColor: '#3E55C6',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#3E55C6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
