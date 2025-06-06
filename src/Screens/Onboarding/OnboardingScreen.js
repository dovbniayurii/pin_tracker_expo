import React from "react";
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 700;

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />

      <ImageBackground
        source={require("../../assets/images/sky.png")}
        style={styles.topHalf}
        resizeMode="cover"
      >
        <View style={styles.scanContainer}>
          <Image
            source={require("../../assets/images/scan.png")}
            style={styles.scanImage}
            resizeMode="contain"
          />
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "black"]}
          style={styles.shadowOverlay}
        />
      </ImageBackground>

      <Image
        source={require("./../../assets/images/splash.png")}
        style={styles.splashLogo}
      />

      <View style={styles.bottomHalf}>
        <View style={styles.textContainer}>
          <Text style={styles.subText}>
            Start scanning and collecting Disney {"\n"}
            pins. Unlock exclusive features and {"\n"}
            track your collection!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignupScreen")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  topHalf: {
    flex: 1.6,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  scanImage: {
    width: width * 0.55, // Responsive width based on screen width
    height: height * 0.4, // Responsive height based on screen height
    marginTop: height * 0.05, // Responsive margin
  },
  shadowOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height * 0.15, // Responsive height
  },
  splashLogo: {
    height: height * 0.1, // Responsive height
    width: width * 0.7, // Responsive width
    resizeMode: "contain",
    alignSelf: "center",
    position: "absolute",
    top: Platform.OS === "ios" 
      ? (isSmallDevice ? height * 0.48 : height * 0.53) 
      : height * 0.51, // Adjusted for different device sizes
    zIndex: 10,
  },
  bottomHalf: {
    flex: 0.8,
    backgroundColor: "black",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02, // Responsive padding
    paddingHorizontal: width * 0.05, // Responsive padding
  },
  textContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: height * 0.02, // Responsive padding
  },
  subText: {
    color: "white",
    fontSize: Math.max(16, Math.min(22, width * 0.05)), // Responsive font size with min/max bounds
    fontWeight: "400",
    textAlign: "center",
    lineHeight: Math.max(22, Math.min(28, width * 0.065)), // Responsive line height
  },
  button: {
    width: width * 0.85, // Responsive width
    maxWidth: 350, // Maximum width
    height: Math.max(48, height * 0.06), // Responsive height with minimum
    backgroundColor: "#3E55C6",
    paddingVertical: height * 0.015, // Responsive padding
    paddingHorizontal: width * 0.07, // Responsive padding
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: isSmallDevice ? height * 0.1 : height * 0.15, // Adjusted for different device sizes
  },
  buttonText: {
    fontSize: Math.max(18, Math.min(22, width * 0.055)), // Responsive font size with min/max bounds
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});