import React, { useState } from "react";
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
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import axiosPublic from "../../../axiosPublic";
import PhoneInput from "react-native-international-phone-number";
import parsePhoneNumberFromString from "libphonenumber-js";
export default function VerifyPhoneNumber() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  const [focusedInput, setFocusedInput] = useState(null);
  const [phoneValue, setPhoneValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const handleSubmit = async () => {
    const phoneNumber = parsePhoneNumberFromString(
      phoneValue,
      selectedCountry?.cca2
    );
    let formatted;
    if (phoneNumber?.isValid()) {
      formatted = phoneNumber.formatInternational().replace(/\s/g, "");
      // Submit formatted number (+12085689383)
      console.log(formatted);
    }

    if (!formatted) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }

    try {
      const requestBody = {};
      if (formatted) {
        // Combine dial code with sanitized phone number
        requestBody.phone_number = formatted;
      }
      // Ensure email is included in the request body
      requestBody.email = email;
      await axiosPublic.post("/api/users/verify-phone-number/", requestBody);

      navigation.navigate("OtpCode", {
        type: "number_verification",
        email,
        phoneNumber: requestBody.phone_number,
      });
    } catch (err) {
      console.log("Error details:", err.response?.data);
      let errorMessage = "Something went wrong.";

      if (err.response?.data) {
        // Check for email error
        if (err.response.data.email) {
          errorMessage = err.response.data.email;
        }
        // Check for phone number error
        else if (err.response.data.phone_number) {
          errorMessage = err.response.data.phone_number;
        }
      }

      Alert.alert("Error", errorMessage);
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.overlay}>
            {/* Title & Subtitle */}
            <View style={styles.headerMovedUp}>
              <Text style={styles.title} variant="headlineMedium">
                Verify Your{"\n"}Phone Number
              </Text>
              <Text style={styles.subtitle} variant="bodyMedium">
                Enter your phone number to receive a One-Time Password (OTP) for
                verification
              </Text>
            </View>

            {/* Phone Number Input */}
            {/* Phone Number Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number</Text>
              <View
                style={[
                  styles.phoneWrapper,
                  {
                    borderColor:
                      focusedInput === "phone"
                        ? "#3E55C6"
                        : "rgba(255, 255, 255, 0.3)",
                  },
                ]}
              >
                <PhoneInput
                  value={phoneValue}
                  onChangePhoneNumber={setPhoneValue}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={setSelectedCountry}
                  containerStyle={styles.phoneContainer}
                  inputStyle={styles.phoneInput}
                  flagContainerStyle={styles.flagContainer}
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                  defaultCountry="US"
                  phoneInputStyles={{
                    container: {
                      backgroundColor: "transparent",
                    },
                    input: {
                      color: "white",
                      fontSize: 16,
                      backgroundColor: "transparent",
                    },
                    flagContainer: {
                      //backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backgroundColor: "#666666",
                    },
                    caret: {
                      color: "#F3F3F3",
                      fontSize: 16,
                    },
                    countryPickerButton: {
                      backgroundColor: "transparent",
                    },
                    dialCode: {
                      color: "white",
                    },
                  }}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleSubmit}>
              <Text style={styles.resetText} variant="bodyLarge">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerMovedUp: {
    width: "100%",
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
  },
  inputWrapper: {
    width: 330,
    marginBottom: 30,
  },
  label: {
    color: "white",
    marginBottom: 10,
  },
  spacedInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "gray",
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
  resetButton: {
    backgroundColor: "#3E55C6",
    width: 330,
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  resetText: {
    color: "white",
    fontSize: 21,
    fontWeight: "500",
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
