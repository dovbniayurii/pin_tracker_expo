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

const { width } = Dimensions.get("window");
const COLUMN_GAP = 12;
const THUMBNAIL_SIZE = (width - 48 - COLUMN_GAP) / 2; // 48 for padding, 12 for gap

const BoardSection = ({ title, icon, items, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={styles.sectionHeader}>
      <Image source={icon} style={styles.sectionIcon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.boardRow}>
      {items && items.length > 0 ? (
        items.slice(0, 2).map(
          (
            item,
            index // Removed extra {}
          ) => (
            <View key={index} style={styles.boardItem}>
              <Image
                source={{ uri: item.pin.image_url }}
                style={styles.boardImage}
                resizeMode="cover"
              />
            </View>
          )
        )
      ) : (
        <View style={styles.emptyGrid}>
          <Text style={styles.emptyText}>No items</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default function Boards() {
  const navigation = useNavigation();
  const [myboard, setMyboard] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [trading, setTrading] = useState([]);

  useEffect(() => {
    myBoardData();
    myWishList();
    Trading();
  }, []);

  const myBoardData = async () => {
    try {
      const response = await axiosClient.get("/api/pins/user-collection/");
      setMyboard(response.data.slice(0, 2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const myWishList = async () => {
    try {
      const response = await axiosClient.get("/api/pins/wishlist/");
      setWishlist(response.data.slice(0, 2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Trading = async () => {
    try {
      const response = await axiosClient.get("/api/pins/trading-board/");
      setTrading(response.data.slice(0, 2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../assets/images/realsky.png")}
        style={styles.background}
      >
        <LinearGradient
          colors={["#000000", "rgba(0, 28, 92, 0)"]}
          style={styles.topGradient}
        />
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.title}>My Boards</Text>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <BoardSection
              title="My Pin Board"
              icon={require("../../assets/images/mycollection.png")}
              items={myboard}
              onPress={() => navigation.navigate("MyBoards")}
            />

            <BoardSection
              title="My Wish Board"
              icon={require("../../assets/images/love.png")}
              items={wishlist}
              // onPress={() => {}}
            />

            <BoardSection
              title="My Trading Board"
              icon={require("../../assets/images/Trading_Board.png")}
              items={trading}
              // onPress={() => {}}
            />
          </ScrollView>

          <LinearGradient
            colors={["rgba(0, 28, 92, 0)", "#000000"]}
            style={styles.bottomGradient}
          />

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
                style={[styles.footerIcon, styles.activeIcon]}
              />
              <Text style={[styles.footerText, styles.activeText]}>
                My Boards
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
    backgroundColor: "#001C5C",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%", // Adjust the height of the gradient overlay
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%", // Adjust the height of the gradient overlay
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  boardRow: {
    flexDirection: "row",
    gap: COLUMN_GAP,
  },
  boardItem: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    padding: 5,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  boardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    backgroundColor: "transparent",
  },
  footerButton: {
    alignItems: "center",
    opacity: 0.7,
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginBottom: 4,
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
  },
  activeFooterButton: {
    opacity: 1,
  },
  activeIcon: {
    tintColor: "#fff",
  },
  activeText: {
    color: "#fff",
    fontWeight: "500",
  },
  emptyGrid: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
});
