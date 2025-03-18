import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axiosClient from "../../../apiClient";
const loveIcon = require("../../assets/images/love.png");
const tradingBoardIcon = require("../../assets/images/Trading_Board.png");

// Import images statically
const myCollectionIcon = require("../../assets/images/mycollection.png");
const { width, height } = Dimensions.get("window");
const COLUMN_GAP = 12;
const THUMBNAIL_SIZE = (width - 40 - COLUMN_GAP) / 2; // 40 for padding, 12 for gap

export default function MyBoards() {
  const navigation = useNavigation();
  const [pins, setPin] = useState([]);

  useEffect(() => {
    pinData();
  }, []);

  const pinData = async () => {
    try {
      const response = await axiosClient.get("/api/pins/user-collection/");
      setPin(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/images/realsky.png")}
        style={styles.background}
      >
        {/* Top gradient overlay */}
        <LinearGradient
          colors={["#000000", "rgba(0, 28, 92, 0)"]}
          style={styles.topGradient}
        />

        <SafeAreaView style={styles.contentContainer}>
          <Text style={styles.title}>My Collection</Text>

          {/* Main content area */}
          <View style={styles.mainContent}>
            <ScrollView
              style={styles.scrollView}
              // iOS scrollbar styling
              indicatorStyle="white"
              // Android scrollbar styling
              scrollIndicatorInsets={{ right: 1 }}
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
              // Android specific props
              {...(Platform.OS === "android" && {
                scrollbarThumbColor: "rgba(255, 255, 255, 0.6)",
                scrollbarTrackColor: "rgba(62, 85, 198, 1)",
                scrollbarFadeDuration: 0,
                scrollbarSize: 12,
              })}
              contentContainerStyle={styles.scrollViewContent}
            >
              <View style={styles.sectionHeader}>
                <Image source={myCollectionIcon} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>My Board</Text>
              </View>

              <View style={styles.boardsGrid}>
                {pins.length > 0 ? (
                  pins.map((pin, index) => (
                    <TouchableOpacity
                      key={pin.id || index}
                      style={styles.boardThumbnail}
                      onPress={() =>
                        navigation.navigate("BoardDetails", { itemId: pin.id })
                      }
                    >
                      <Image
                        source={{
                          uri: pin.pin.image_url,
                        }}
                        style={styles.thumbnailImage}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No pins added yet</Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Wish and Trading section */}
            <View style={styles.wishSection}>
              <TouchableOpacity style={styles.wishButton}>
                <Image source={loveIcon} style={styles.buttonIcon} />
                <Text style={styles.wishText}>My Wish Board</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tradingButton}>
                <Image source={tradingBoardIcon} style={styles.buttonIcon} />
                <Text style={styles.tradingText}>My Trading Board</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Bottom gradient overlay */}
        <LinearGradient
          colors={["rgba(0, 28, 92, 0)", "#000000"]}
          style={styles.bottomGradient}
        />

        {/* Footer navigation */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("Scanning")}
          >
            <Image
              source={require("../../assets/images/scanner.png")}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerButton, styles.activeFooterButton]}
            onPress={() => navigation.navigate("Boards")}
          >
            <Image
              source={require("../../assets/images/mycollection.png")}
              style={[styles.footerIcon, { tintColor: "#3E55C6" }]}
            />
            <Text style={[styles.footerText, styles.activeFooterText]}>
              My Collection
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "20%",
    zIndex: 1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
    marginTop: Platform.OS === "android" ? 40 : 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingRight: Platform.OS === "android" ? 8 : 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionIcon: {
    width: 20,
    height: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  boardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  boardThumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 12,
    marginBottom: 12,
    padding: 5,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(149, 161, 182, 1)",
    borderWidth: 1,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  emptyState: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
  },
  wishSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  wishButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  tradingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  wishText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  tradingText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  activeFooterButton: {
    borderWidth: 2,
    borderColor: "#3E55C6",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginRight: 8,
  },
  footerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  activeFooterText: {
    color: "#3E55C6",
  },
});
