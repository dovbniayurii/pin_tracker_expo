import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "react-native-paper";
import axios from "axios";
import axiosPublic from "../../../axiosPublic";

export default function OtpScreen() {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const route = useRoute(); // Get the route object

  // Extract both email and phoneNumber from route params (if available)
  const { email, phoneNumber, type } = route.params || {};
  console.log("Email:", email, "Phone:", phoneNumber, type);

  const handleOtpChange = (text, index) => {
    let newOtp = [...otp];

    // Allow only one character per input
    if (text.length > 1) return;

    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if text is entered
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      try {
        // Build request body with OTP and whichever identifier is provided.
        const requestData = { otp: otpCode };
        if (email) {
          requestData.email = email;
        }
        if (phoneNumber) {
          requestData.phone_number = phoneNumber;
        }

        if (type === "resat_password") {
          const response = await axiosPublic.post(
            "/api/users/verify-otp/",
            requestData
          );
          console.log(response);
          const token = response.data.access;
          navigation.navigate("ResetPassword", { token });
        }
        if (type === "number_verification") {
          const response = await axiosPublic.put(
            "/api/users/verify-phone-number/",
            requestData
          );

          // Optionally, display a success message
          navigation.navigate("LoginScreen");
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Verification failed", "Invalid OTP or expired code.");
      }
    } else {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/signupsky.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
        style={styles.shadowOverlay}
      />

      <View style={styles.overlayAdjusted}>
        <Text style={styles.title} variant="headlineMedium">
          OTP Authentication
        </Text>
        <Text style={styles.subtitle} variant="bodyMedium">
          A 4-digit code has been sent to your {email ? "email" : "phone"}.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              style={styles.otpInput}
              placeholderTextColor="gray"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  handleBackspace(digit, index);
                }
              }}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText} variant="bodyLarge">
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  shadowOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%",
  },
  overlayAdjusted: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 170,
  },
  title: {
    color: "white",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "60%",
    justifyContent: "center",
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: "gray",
    fontSize: 24,
    textAlign: "center",
    marginHorizontal: 15,
    width: 40,
    color: "white",
  },
  submitButton: {
    backgroundColor: "#3E55C6",
    width: 330,
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    color: "white",
    fontSize: 21,
    fontWeight: "500",
  },
});
