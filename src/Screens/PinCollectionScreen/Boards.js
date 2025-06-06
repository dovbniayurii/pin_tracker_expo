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
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axiosClient from "../../../apiClient";

// Import images statically
const myCollectionIcon = require("../../assets/images/mycollection.png");
const loveIcon = require("../../assets/images/love.png");
const tradingBoardIcon = require("../../assets/images/Trading_Board.png");
const scannerIcon = require("../../assets/images/scanner.png");
const backgroundImage = require("../../assets/images/realsky.png");

const Boards = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [myboard, setMyboard] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [trading, setTrading] = useState([]);
  const [loading, setLoading] = useState({
    myboard: true,
    wishlist: true,
    trading: true
  });
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  // Calculate responsive values based on screen dimensions
  const { width, height } = dimensions;
  const isTablet = width > 768;
  const HORIZONTAL_PADDING = width * 0.06; // 6% of screen width
  const COLUMN_GAP = width * 0.03; // 3% of screen width
  const SECTION_GAP = height * 0.03; // 3% of screen height
  const ITEMS_PER_ROW = isTablet ? 3 : 2;
  const THUMBNAIL_SIZE = (width - (HORIZONTAL_PADDING * 2) - (COLUMN_GAP * (ITEMS_PER_ROW - 1))) / ITEMS_PER_ROW;
  
  // Responsive font sizing
  const scaleFontSize = (size) => {
    const scale = width / 375; // Base scale on iPhone X width
    return Math.round(size * Math.min(scale, 1.3)); // Cap scaling at 1.3x
  };

  useEffect(() => {
    fetchAllData();
    
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

  const fetchAllData = async () => {
    myBoardData();
    myWishList();
    Trading();
  };

  const myBoardData = async () => {
    setLoading(prev => ({ ...prev, myboard: true }));
    try {
      const response = await axiosClient.get("/api/pins/user-collection/");
      setMyboard(response.data.slice(0, isTablet ? 3 : 2));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(prev => ({ ...prev, myboard: false }));
    }
  };

  const myWishList = async () => {
    setLoading(prev => ({ ...prev, wishlist: true }));
    try {
      const response = await axiosClient.get("/api/pins/wishlist/");
      setWishlist(response.data.slice(0, isTablet ? 3 : 2));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(prev => ({ ...prev, wishlist: false }));
    }
  };

  const Trading = async () => {
    setLoading(prev => ({ ...prev, trading: true }));
    try {
      const response = await axiosClient.get("/api/pins/trading-board/");
      setTrading(response.data.slice(0, isTablet ? 3 : 2));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(prev => ({ ...prev, trading: false }));
    }
  };

  // Board Section Component with responsive styling
  const BoardSection = ({ title, icon, items, onPress, isLoading }) => (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      style={{ marginBottom: SECTION_GAP }}
    >
      <View style={styles.sectionHeader}>
        <Image source={icon} style={styles.sectionIcon} />
        <Text style={[
          styles.sectionTitle, 
          { fontSize: scaleFontSize(16) }
        ]}>
          {title}
        </Text>
      </View>
      
      {isLoading ? (
        <View style={[styles.loadingContainer, { height: THUMBNAIL_SIZE }]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <View style={[
          styles.boardRow,
          { gap: COLUMN_GAP }
        ]}>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.boardItem,
                  { 
                    width: THUMBNAIL_SIZE, 
                    height: THUMBNAIL_SIZE,
                    borderRadius: width * 0.04, // 4% of screen width
                  }
                ]}
              >
                <Image
                  source={{ uri: item.pin.image_url }}
                  style={styles.boardImage}
                  resizeMode="cover"
                />
              </View>
            ))
          ) : (
            <View style={[
              styles.emptyGrid,
              { 
                width: width - (HORIZONTAL_PADDING * 2),
                height: THUMBNAIL_SIZE
              }
            ]}>
              <Text style={[
                styles.emptyText,
                { fontSize: scaleFontSize(14) }
              ]}>
                No items
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ImageBackground
          source={backgroundImage}
          style={styles.background}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["#000000", "rgba(0, 28, 92, 0)"]}
            style={styles.topGradient}
          />
          
          <SafeAreaView 
            edges={['top']} 
            style={[
              styles.safeArea,
              { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }
            ]}
          >
            <Text style={[
              styles.title,
              { 
                fontSize: scaleFontSize(28),
                marginVertical: height * 0.025 // 2.5% of screen height
              }
            ]}>
              My Boards
            </Text>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                { 
                  paddingHorizontal: HORIZONTAL_PADDING,
                  paddingBottom: height * 0.1 // 10% of screen height for footer space
                }
              ]}
            >
              <BoardSection
                title="My Pin Board"
                icon={myCollectionIcon}
                items={myboard}
                onPress={() => navigation.navigate("MyBoards")}
                isLoading={loading.myboard}
              />

              <BoardSection
                title="My Wish Board"
                icon={loveIcon}
                items={wishlist}
                onPress={() => {}}
                isLoading={loading.wishlist}
              />

              <BoardSection
                title="My Trading Board"
                icon={tradingBoardIcon}
                items={trading}
                onPress={() => {}}
                isLoading={loading.trading}
              />
            </ScrollView>

            <LinearGradient
              colors={["rgba(0, 28, 92, 0)", "#000000"]}
              style={styles.bottomGradient}
            />

            <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
              <View style={[
                styles.footer,
                { 
                  paddingBottom: insets.bottom > 0 ? 0 : Platform.OS === "ios" ? 30 : 16,
                  paddingVertical: height * 0.02 // 2% of screen height
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
                      { 
                        width: scaleFontSize(24), 
                        height: scaleFontSize(24),
                        marginBottom: height * 0.005 // 0.5% of screen height
                      }
                    ]}
                  />
                  <Text style={[
                    styles.footerText,
                    { fontSize: scaleFontSize(12) }
                  ]}>
                    Scan
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.footerButton, styles.activeFooterButton]}
                  onPress={() => navigation.navigate("Boards")}
                >
                  <Image
                    source={myCollectionIcon}
                    style={[
                      styles.footerIcon, 
                      styles.activeIcon,
                      { 
                        width: scaleFontSize(24), 
                        height: scaleFontSize(24),
                        marginBottom: height * 0.005 // 0.5% of screen height
                      }
                    ]}
                  />
                  <Text style={[
                    styles.footerText, 
                    styles.activeText,
                    { fontSize: scaleFontSize(12) }
                  ]}>
                    My Boards
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
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
    backgroundColor: "#001C5C",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    fontWeight: "600",
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  boardRow: {
    flexDirection: "row",
  },
  boardItem: {
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
    borderRadius: 12,
  },
  footerContainer: {
    zIndex: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  footerButton: {
    alignItems: "center",
    opacity: 0.7,
  },
  footerIcon: {
    tintColor: "#fff",
  },
  footerText: {
    color: "#fff",
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
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Boards;