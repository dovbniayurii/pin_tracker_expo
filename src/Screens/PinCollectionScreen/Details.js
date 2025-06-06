import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Burnt from "burnt";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axiosClient from "../../../apiClient";

// Import images statically
const scannerIcon = require("../../assets/images/scanner.png");
const myCollectionIcon = require("../../assets/images/mycollection.png");
const loveIcon = require("../../assets/images/love.png");
const tradingBoardIcon = require("../../assets/images/Trading_Board.png");
const trashIcon = require("../../assets/images/trash.png");
const backgroundImage = require("../../assets/images/realsky.png");

export default function BoardDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params;
  const [pin, setPin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();

  // Get dynamic window dimensions
  const [dimensions, setDimensions] = useState({
    width: global.Dimensions ? global.Dimensions.get("window").width : 375,
    height: global.Dimensions ? global.Dimensions.get("window").height : 812,
  });

  // Calculate responsive sizes
  const { width, height } = dimensions;
  const isTablet = width > 768;
  const imageSize = Math.min(width * (isTablet ? 0.4 : 0.5), isTablet ? 300 : 200);
  const HORIZONTAL_PADDING = width * 0.05; // 5% of screen width
  
  // Responsive font sizing
  const scaleFontSize = (size) => {
    const scale = width / 375; // Base scale on iPhone X width
    return Math.round(size * Math.min(scale, 1.3)); // Cap scaling at 1.3x
  };

  useEffect(() => {
    getPin();
    
    // Add dimension change listener for orientation changes
    if (global.Dimensions) {
      const dimensionsHandler = ({ window }) => {
        setDimensions({
          width: window.width,
          height: window.height,
        });
      };

      const subscription = global.Dimensions.addEventListener("change", dimensionsHandler);

      return () => {
        subscription.remove();
      };
    }
  }, []);

  const getPin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/api/pins/pin-details/${itemId}/`);
      setPin(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load pin details. Please try again.");
      Burnt.toast({
        title: "Error",
        preset: "error",
        message: "Failed to load pin details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePin = async () => {
    setModalVisible(false);
    try {
      await axiosClient.delete(`/api/pins/pin-details/${itemId}/`);
      Burnt.toast({
        title: "Success",
        preset: "done",
        message: "Pin removed successfully!",
      });
      navigation.navigate("MyBoards");
    } catch (error) {
      console.error("Error removing pin:", error);
      Burnt.toast({
        title: "Error",
        preset: "error",
        message: "Failed to remove pin",
      });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <ImageBackground source={backgroundImage} style={styles.background}>
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
              <View style={styles.header}>
                <Text style={[styles.title, { fontSize: scaleFontSize(28) }]}>
                  Pin Details
                </Text>
              </View>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[styles.loadingText, { fontSize: scaleFontSize(16) }]}>
                  Loading pin details...
                </Text>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>
      </SafeAreaProvider>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <ImageBackground source={backgroundImage} style={styles.background}>
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
              <View style={styles.header}>
                <Text style={[styles.title, { fontSize: scaleFontSize(28) }]}>
                  Pin Details
                </Text>
              </View>
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { fontSize: scaleFontSize(16) }]}>
                  {error}
                </Text>
                <TouchableOpacity 
                  style={[styles.retryButton, { marginTop: height * 0.02 }]}
                  onPress={getPin}
                >
                  <Text style={[styles.retryButtonText, { fontSize: scaleFontSize(14) }]}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>
      </SafeAreaProvider>
    );
  }

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
              styles.safeArea,
              { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { fontSize: scaleFontSize(28) }]}>
                Pin Details
              </Text>
              {/* Trash Button */}
              <TouchableOpacity
                style={[
                  styles.trashButton,
                  { right: HORIZONTAL_PADDING }
                ]}
                onPress={() => setModalVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={trashIcon}
                  style={[
                    styles.trashIcon,
                    { width: scaleFontSize(24), height: scaleFontSize(24) }
                  ]}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                { 
                  paddingHorizontal: HORIZONTAL_PADDING,
                  paddingBottom: height * 0.12 // Space for footer
                }
              ]}
              showsVerticalScrollIndicator={false}
            >
              <View style={[
                styles.card,
                { 
                  padding: width * 0.05,
                  borderRadius: width * 0.05
                }
              ]}>
                <View style={styles.imageWrapper}>
                  <View
                    style={[
                      styles.imageContainer,
                      { 
                        width: imageSize, 
                        height: imageSize,
                        borderRadius: width * 0.05
                      }
                    ]}
                  >
                    {pin && pin.image_url && (
                      <Image
                        source={{ uri: pin.image_url }}
                        style={[
                          styles.pinImage,
                          { borderRadius: width * 0.04 }
                        ]}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>

                {pin && (
                  <View style={[
                    styles.detailsContainer,
                    { gap: height * 0.012 }
                  ]}>
                    <DetailRow 
                      label="Name" 
                      value={pin.name} 
                      fontSize={scaleFontSize(14)}
                    />
                    <DetailRow 
                      label="Series" 
                      value={pin.series} 
                      fontSize={scaleFontSize(14)}
                    />
                    <DetailRow 
                      label="Origin" 
                      value={pin.origin} 
                      fontSize={scaleFontSize(14)}
                    />
                    <DetailRow 
                      label="Edition" 
                      value={pin.edition} 
                      fontSize={scaleFontSize(14)}
                    />
                    <DetailRow 
                      label="Release Date" 
                      value={pin.release_date} 
                      fontSize={scaleFontSize(14)}
                    />
                    <DetailRow 
                      label="Original Price" 
                      value={pin.original_price} 
                      fontSize={scaleFontSize(14)}
                    />
                  </View>
                )}
              </View>

              <View style={[
                styles.moveSection,
                { marginTop: height * 0.03 }
              ]}>
                <Text
                  style={[
                    styles.moveTitle, 
                    { 
                      fontSize: scaleFontSize(20),
                      marginBottom: height * 0.02
                    }
                  ]}
                >
                  Move Pin to
                </Text>
                <View style={[
                  styles.moveButtons,
                  { gap: width * 0.03 }
                ]}>
                  <MoveButton 
                    icon={myCollectionIcon}
                    label="My Pin Board"
                    fontSize={scaleFontSize(12)}
                    onPress={() => {
                      Burnt.toast({
                        title: "Pin Moved",
                        preset: "done",
                        message: "Pin moved to My Pin Board",
                      });
                    }}
                  />

                  <MoveButton 
                    icon={loveIcon}
                    label="My Wish Board"
                    fontSize={scaleFontSize(12)}
                    onPress={() => {
                      Burnt.toast({
                        title: "Pin Moved",
                        preset: "done",
                        message: "Pin moved to My Wish Board",
                      });
                    }}
                  />

                  <MoveButton 
                    icon={tradingBoardIcon}
                    label="My Trading Board"
                    fontSize={scaleFontSize(12)}
                    onPress={() => {
                      Burnt.toast({
                        title: "Pin Moved",
                        preset: "done",
                        message: "Pin moved to My Trading Board",
                      });
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>

          {/* Bottom gradient overlay */}
          <LinearGradient
            colors={["rgba(0, 28, 92, 0)", "#000000"]}
            style={styles.bottomGradient}
          />

          <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
            <View style={[
              styles.footer,
              { 
                paddingBottom: insets.bottom > 0 ? 0 : Platform.OS === "ios" ? 30 : 16,
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
                    { 
                      width: scaleFontSize(24), 
                      height: scaleFontSize(24),
                      marginBottom: height * 0.005
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
                style={styles.footerButton}
                onPress={() => navigation.navigate("Boards")}
              >
                <Image
                  source={myCollectionIcon}
                  style={[
                    styles.footerIcon,
                    { 
                      width: scaleFontSize(24), 
                      height: scaleFontSize(24),
                      marginBottom: height * 0.005
                    }
                  ]}
                />
                <Text style={[
                  styles.footerText,
                  { fontSize: scaleFontSize(12) }
                ]}>
                  My Boards
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalContainer,
              { 
                width: isTablet ? "50%" : "80%",
                maxWidth: isTablet ? 400 : 300,
                borderRadius: width * 0.03,
                padding: width * 0.05
              }
            ]}>
              <Text style={[
                styles.modalText,
                { fontSize: scaleFontSize(18) }
              ]}>
                Are you sure you want to remove the pin?
              </Text>
              <View style={styles.buttonRow}>
                {/* Cancel Button */}
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { 
                      paddingVertical: height * 0.015,
                      paddingHorizontal: width * 0.05,
                      borderRadius: width * 0.01
                    }
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[
                    styles.buttonText,
                    { fontSize: scaleFontSize(16) }
                  ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/* Remove Button */}
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    { 
                      paddingVertical: height * 0.015,
                      paddingHorizontal: width * 0.05,
                      borderRadius: width * 0.01
                    }
                  ]}
                  onPress={handleRemovePin}
                >
                  <Text style={[
                    styles.removeButtonText,
                    { fontSize: scaleFontSize(16) }
                  ]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

// Detail Row Component
const DetailRow = ({ label, value, fontSize }) => (
  <Text style={[styles.detailText, { fontSize }]}>
    <Text style={styles.detailLabel}>{label}: </Text>
    {value || "Unknown"}
  </Text>
);

// Move Button Component
const MoveButton = ({ icon, label, fontSize, onPress }) => (
  <TouchableOpacity 
    style={styles.moveButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image source={icon} style={styles.moveIcon} />
    <Text style={[styles.moveButtonText, { fontSize }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

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
    height: "20%",
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    position: "relative",
    zIndex: 2,
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  trashButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  trashIcon: {
    tintColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "rgba(0, 28, 92, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  imageContainer: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  pinImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    width: "100%",
  },
  detailText: {
    color: "#fff",
    lineHeight: 20,
  },
  detailLabel: {
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  moveSection: {
    width: "100%",
  },
  moveTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  moveButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moveButton: {
    flex: 1,
    backgroundColor: "rgba(0, 28, 92, 0.6)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  moveIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginBottom: 8,
  },
  moveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  footerContainer: {
    zIndex: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
  },
  footerButton: {
    alignItems: "center",
  },
  footerIcon: {
    tintColor: "#fff",
  },
  footerText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#3E55C6",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  removeButtonText: {
    color: "#3E55C6",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});