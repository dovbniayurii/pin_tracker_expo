import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axiosClient from "../../../apiClient";

// Import images statically
const loveIcon = require("../../assets/images/love.png");
const tradingBoardIcon = require("../../assets/images/Trading_Board.png");
const myCollectionIcon = require("../../assets/images/mycollection.png");
const scannerIcon = require("../../assets/images/scanner.png");
const backgroundImage = require("../../assets/images/realsky.png");

const MyBoards = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [pins, setPin] = useState([]);
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  // Calculate responsive values based on screen dimensions
  const { width, height } = dimensions;
  const isTablet = width > 768;
  const numColumns = isTablet ? 3 : 2;
  const COLUMN_GAP = width * 0.03; // 3% of screen width
  const HORIZONTAL_PADDING = width * 0.05; // 5% of screen width
  const THUMBNAIL_SIZE = (width - (HORIZONTAL_PADDING * 2) - (COLUMN_GAP * (numColumns - 1))) / numColumns;
  
  // Responsive font sizing
  const scaleFontSize = (size) => {
    const scale = width / 375; // Base scale on iPhone X width
    return Math.round(size * Math.min(scale, 1.3)); // Cap scaling at 1.3x
  };

  useEffect(() => {
    pinData();
    
    // Add dimension change listener for orientation changes
    const dimensionsHandler = ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    };

    const subscription = Dimensions.addEventListener("change", dimensionsHandler);

    return () => {
      subscription.remove();
    };
  }, []);

  const pinData = async () => {
    try {
      const response = await axiosClient.get("/api/pins/user-collection/");
      setPin(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { fontSize: scaleFontSize(16) }]}>
        No pins added yet
      </Text>
    </View>
  );

  // Render grid item
  const renderBoardItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id || index}
      style={[
        styles.boardThumbnail,
        { 
          width: THUMBNAIL_SIZE, 
          height: THUMBNAIL_SIZE,
          marginRight: index % numColumns !== numColumns - 1 ? COLUMN_GAP : 0
        }
      ]}
      onPress={() => navigation.navigate("BoardDetails", { itemId: item.id })}
    >
      <Image
        source={{ uri: item.pin.image_url }}
        style={styles.thumbnailImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <ImageBackground
          source={backgroundImage}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Top gradient overlay */}
          <LinearGradient
            colors={["#000000", "rgba(0, 28, 92, 0)"]}
            style={styles.topGradient}
          />

          <SafeAreaView 
            edges={['top']} 
            style={[
              styles.contentContainer,
              { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }
            ]}
          >
            <Text style={[
              styles.title, 
              { 
                fontSize: scaleFontSize(24),
                marginTop: Platform.OS === "android" ? 40 : 20
              }
            ]}>
              My Collection
            </Text>

            {/* Main content area */}
            <View style={[
              styles.mainContent,
              { paddingHorizontal: HORIZONTAL_PADDING }
            ]}>
              <View style={styles.sectionHeader}>
                <Image source={myCollectionIcon} style={styles.sectionIcon} />
                <Text style={[styles.sectionTitle, { fontSize: scaleFontSize(16) }]}>
                  My Board
                </Text>
              </View>

              <FlatList
                data={pins}
                renderItem={renderBoardItem}
                keyExtractor={(item, index) => (item.id || index.toString())}
                numColumns={numColumns}
                ListEmptyComponent={<EmptyState />}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={[
                  styles.gridContainer,
                  { paddingBottom: height * 0.15 } // Add padding to avoid footer overlap
                ]}
                columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : null}
              />

              {/* Wish and Trading section */}
              <View style={[
                styles.wishSection,
                { 
                  paddingHorizontal: HORIZONTAL_PADDING * 0.5,
                  marginBottom: insets.bottom > 0 ? insets.bottom : 20
                }
              ]}>
                <TouchableOpacity 
                  style={[
                    styles.wishButton,
                    { paddingVertical: height * 0.015 }
                  ]}
                >
                  <Image source={loveIcon} style={styles.buttonIcon} />
                  <Text style={[
                    styles.wishText,
                    { fontSize: scaleFontSize(14) }
                  ]}>
                    My Wish Board
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.tradingButton,
                    { paddingVertical: height * 0.015 }
                  ]}
                >
                  <Image source={tradingBoardIcon} style={styles.buttonIcon} />
                  <Text style={[
                    styles.tradingText,
                    { fontSize: scaleFontSize(14) }
                  ]}>
                    My Trading Board
                  </Text>
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
          <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
            <View style={[
              styles.footer,
              { 
                paddingBottom: insets.bottom > 0 ? 0 : Platform.OS === "ios" ? 20 : 15,
                paddingHorizontal: HORIZONTAL_PADDING
              }
            ]}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate("Scanning")}
              >
                <Image
                  source={scannerIcon}
                  style={[
                    styles.footerIcon,
                    { width: scaleFontSize(24), height: scaleFontSize(24) }
                  ]}
                />
                <Text style={[
                  styles.footerText,
                  { fontSize: scaleFontSize(16) }
                ]}>
                  Scan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton, 
                  styles.activeFooterButton,
                  { paddingHorizontal: width * 0.03 }
                ]}
                onPress={() => navigation.navigate("Boards")}
              >
                <Image
                  source={myCollectionIcon}
                  style={[
                    styles.footerIcon,
                    { 
                      tintColor: "#3E55C6",
                      width: scaleFontSize(24), 
                      height: scaleFontSize(24)
                    }
                  ]}
                />
                <Text style={[
                  styles.footerText, 
                  styles.activeFooterText,
                  { fontSize: scaleFontSize(16) }
                ]}>
                  My Collection
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </SafeAreaProvider>
  );
};

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
    zIndex: 2,
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
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
    fontWeight: "600",
    marginLeft: 8,
  },
  gridContainer: {
    flexGrow: 1,
  },
  boardThumbnail: {
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
  },
  wishSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  wishButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 0.48,
    justifyContent: "center",
  },
  tradingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 0.48,
    justifyContent: "center",
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  wishText: {
    color: "#fff",
    marginLeft: 8,
  },
  tradingText: {
    color: "#fff",
    marginLeft: 8,
  },
  footerContainer: {
    zIndex: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "transparent",
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
  },
  footerIcon: {
    tintColor: "#fff",
    marginRight: 8,
  },
  footerText: {
    color: "white",
    fontWeight: "500",
  },
  activeFooterText: {
    color: "#3E55C6",
  },
});

export default MyBoards;