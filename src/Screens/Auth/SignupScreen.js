/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Icon } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import axiosPublic from "../../../axiosPublic";

export default function SignupScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);
  const handleSubmit = async () => {
    console.log(email, password, confirmPassword);

    // Basic client-side validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Combine dial code with sanitized phone number
      // Make a POST request to your Django signup endpoint
      const response = await axiosPublic.post("/api/users/signup/", {
        useremail: email,
        password: password,
        confirm_password: confirmPassword,
      });

      // Optionally, display a success message
      Alert.alert("Success", "Your account has been created successfully!");

      // Navigate to the login screen (or wherever you want)
      navigation.navigate("VerifyPhoneNumber", { email: email });
    } catch (error) {
      console.error(error.response); // Log the error response for debugging

      let errorMessage = "An error occurred. Please try again.";

      // Check if error.response exists
      if (error.response && error.response.data) {
        const errors = error.response.data;

        // If errors exist, extract the messages
        if (errors) {
          // Flatten error messages
          errorMessage = Object.values(errors).flat().join("\n");
        }
      } else {
        // Handle network or unexpected error
        errorMessage = "Network error or server not reachable.";
      }

      // Display error message in alert
      Alert.alert("Sign Up Error", errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/signupsky.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
          style={styles.shadowOverlay}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Sign Up for Free</Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: focusedInput === "email" ? "#3E55C6" : "gray",
                    borderWidth: 1,
                  },
                ]}
              >
                <Icon
                  source="email-outline"
                  size={20}
                  color="grey"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="gray"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor:
                      focusedInput === "password" ? "#3E55C6" : "gray",
                    borderWidth: 1,
                  },
                ]}
              >
                <Icon
                  source="lock-outline"
                  size={20}
                  color="grey"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="gray"
                  secureTextEntry={securePassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setSecurePassword(!securePassword)}
                >
                  <Icon
                    source={securePassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password Confirmation</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor:
                      focusedInput === "confirmPassword" ? "#3E55C6" : "gray",
                    borderWidth: 1,
                  },
                ]}
              >
                <Icon
                  source="lock-outline"
                  size={20}
                  color="grey"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="gray"
                  secureTextEntry={secureConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() =>
                    setSecureConfirmPassword(!secureConfirmPassword)
                  }
                >
                  <Icon
                    source={
                      secureConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSubmit}
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <Text style={styles.signInText}>
              Already have an account?{" "}
              <Text
                onPress={() => navigation.navigate("LoginScreen")}
                style={styles.signInLink}
              >
                Sign In
              </Text>
            </Text>

            {/* OR Divider */}
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Icon source="google" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Icon source="instagram" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Icon source="facebook" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#221F25",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingLeft: 8,
  },
  signupButton: {
    backgroundColor: "#3E55C6",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInText: {
    color: "white",
    marginTop: 15,
  },
  signInLink: {
    color: "#3E55C6",
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  orText: {
    color: "white",
    marginHorizontal: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  spacedInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#221F25",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "gray",
  },
  countryPickerButton: {
    paddingRight: 10,
    paddingLeft: 5,
    height: 40,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "gray", // Changed to match input border
    marginRight: 10,
  },
});
