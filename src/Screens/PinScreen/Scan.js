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
          colors={[
            "transparent",
            "rgba(0,0,0,0.5)",
            "rgba(0,0,0,0.6)",
            "black",
          ]}
          locations={[0, 0.4, 0.7, 1]}
          style={styles.gradientOverlay}
        />
      </ImageBackground>

      <View style={styles.bottomHalf}>
        <View style={styles.topContent}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              Scan the pin to add it {"\n"} your collection
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Scanning")}
          >
            <Text style={styles.buttonText}>Scan Now</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.myCollectionButton}
          onPress={() => navigation.navigate("Boards")}
        >
          <Image
            source={require("../../assets/images/mycollection.png")}
            style={styles.myCollectionIcon}
            resizeMode="contain"
          />
          <Text style={styles.myCollectionText}>My Collection</Text>
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
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanContainer: {
    position: "absolute",
    top: 30,
  },
  scanImage: {
    width: 230,
    height: 355,
    marginTop: 50,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
  },
  bottomHalf: {
    flex: 0.7,
    backgroundColor: "black",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topContent: {
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    marginTop: -20,
  },
  text: {
    color: "white",
    fontSize: 35,
    fontWeight: "500",
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    width: 330,
    height: 48,
    backgroundColor: "#3E55C6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignContent: "center",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  myCollectionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  myCollectionIcon: {
    width: 31,
    height: 32,
    marginRight: 10,
  },
  myCollectionText: {
    color: "white",
    fontSize: 21,
    fontWeight: "500",
  },
});
