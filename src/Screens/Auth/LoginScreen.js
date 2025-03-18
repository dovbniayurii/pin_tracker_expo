import React, { useContext, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Alert,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import axiosPublic from "../../../axiosPublic";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axiosPublic.post("/api/users/signin/", {
        useremail: email, // change from email to useremail
        password,
      });

      const { access, refresh } = response.data;
      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);
      await login(); // Update authentication state
    } catch (err) {
      console.log(err.response?.data);

      let errorMessage = "Something went wrong.";

      if (err.response && err.response.data) {
        // Extract specific error messages
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail; // Handles single message errors
        } else {
          errorMessage = Object.values(err.response.data).flat().join("\n"); // Handles multiple errors
        }
      } else {
        if (err.message === "Network Error") {
          errorMessage = "Network error or server not reachable.";
        } else {
          errorMessage = "An unexpected error occurred.";
        }
      }

      // Show the error message in an alert
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/signupsky.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Bottom shadow gradient */}
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
          style={styles.shadowOverlay}
        />

        {/* Content container with semi-transparent overlay */}
        <View style={styles.contentContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.flexContainer}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView contentContainerStyle={styles.overlay}>
                <Text style={styles.title}>Login</Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* Email Input */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Email Address</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        borderColor:
                          focusedInput === "email" ? "#3E55C6" : "gray",
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
                        source={
                          securePassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginText}>
                    {loading ? "Processing..." : "Login"}{" "}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.signUpText}>
                  Don't have an account?{" "}
                  <Text
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate("SignupScreen")}
                  >
                    Sign Up
                  </Text>
                </Text>
                <Text style={styles.signUpText}>
                  <Text
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate("ForgotPasswordScreen")}
                  >
                    Forgot Password?
                  </Text>
                </Text>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  flexContainer: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  shadowOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%",
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 15,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
    borderWidth: 1,
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
  loginButton: {
    backgroundColor: "#3E55C6",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    color: "white",
    marginTop: 15,
  },
  signUpLink: {
    color: "#3E55C6",
    fontWeight: "bold",
  },
});
