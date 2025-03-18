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
} from "react-native";
//import { LinearGradient } from 'expo-linear-gradient'
import { LinearGradient } from "expo-linear-gradient";
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
          onPress={() => navigation.navigate("SignupScreen")} // This is correct ✅
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
  },
  topHalf: {
    flex: 1.6, // Increased the flex ratio to make top section larger
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanContainer: {
    position: "absolute",
    // top: 30,
  },
  scanImage: {
    width: 220,
    height: 350,
    marginTop: 50,
  },
  shadowOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 150, // Reduced gradient height
  },
  splashLogo: {
    height: 90,
    width: 280,
    resizeMode: "center",
    alignSelf: "center",
    position: "absolute",
    top: "53%", // Adjusted position to account for new proportions
    // zIndex: 1,
  },
  bottomHalf: {
    flex: 0.8, // Reduced the flex ratio to make bottom section smaller
    backgroundColor: "black",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10, // Adjust padding to bring content up
  },
  textContainer: {
    alignItems: "center",
    // marginBottom: 20, // Push text higher
  },
  subText: {
    color: "white",
    fontSize: 22,
    fontWeight: "400",
    marginTop: 0,
    textAlign: "center",
  },
  button: {
    width: 330,
    height: 48,
    backgroundColor: "#3E55C6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignContent: "center",
    position: "absolute", // Absolute positioning to control placement
    bottom: 110, // Adj
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
