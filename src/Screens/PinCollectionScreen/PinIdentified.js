import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import * as Burnt from "burnt";

import { LinearGradient } from "expo-linear-gradient";
import axiosClient from "../../../apiClient";

export default function PinIdentified() {
  const navigation = useNavigation();
  const route = useRoute();
  const [pin, setPin] = useState();
  const { data } = route.params;
  console.log(data);
  useEffect(() => {
    setPin(data);
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  // Get dynamic window dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive sizes
  const imageSize = Math.min(width * 0.5, 200); // 50% of width but max 200px
  const fontSize = {
    title: Math.min(28, width * 0.07), // Responsive title size
    detail: Math.min(14, width * 0.035), // Responsive detail text
    button: Math.min(12, width * 0.03), // Responsive button text
  };
  const padding = {
    horizontal: width * 0.05, // 5% of screen width
    vertical: height * 0.02, // 2% of screen height
  };
  const handleRemovePin = async () => {
    setModalVisible(false);
    // Perform the pin removal logic here
    console.log(`Pin removed! ${pin.id}`);
    try {
      const response = await axiosClient.delete(
        `/api/pins/pin-details/${pin.id}/`
      );
      //Alert.alert('Success', '');
      Burnt.toast({
        title: "Pin removed successfully!",
        preset: "done",
        message: "",
      });
      navigation.navigate("MyBoards");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handelAddToUserCollections = async () => {
    try {
      const response = await axiosClient.post(
        "/api/pins/user-collection/",
        pin
      );
      //Alert.alert('Success', '');
      Burnt.toast({
        title: "Pin added to My Pin Board successfully!",
        preset: "done",
      });
      //navigation.navigate('MyBoards');
    } catch (error) {
      Burnt.toast({
        title: error.response?.data.error,
        preset: "done",
      });
    }
  };
  const handelAddToMyWishBoard = async () => {
    try {
      const response = await axiosClient.post("/api/pins/wishlist/", pin);

      //Alert.alert('Success', '');
      Burnt.toast({
        title: "Pin added to My Wish Board successfully!",
        preset: "done",
      });
      //navigation.navigate('MyBoards');
    } catch (error) {
      Burnt.toast({
        title: error.response?.data.error,
        preset: "done",
      });
    }
  };
  const handelAddToMyTradingBoard = async () => {
    try {
      const response = await axiosClient.post("/api/pins/trading-board/", pin);
      //Alert.alert('Success', '');
      Burnt.toast({
        title: "Pin added to Trading Board successfully!",
        preset: "done",
      });
      // navigation.navigate('MyBoards');
    } catch (error) {
      console.log(error.response?.data.error);
      Burnt.toast({
        title: error.response?.data.error,
        preset: "done",
      });

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

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: fontSize.title }]}>
              Pin Identified
            </Text>
            {/* Trash Button */}
            <TouchableOpacity
              style={styles.trashButton}
              onPress={() => setModalVisible(true)}
            >
              <Image
                source={require("../../assets/images/trash.png")}
                style={styles.trashIcon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingHorizontal: padding.horizontal },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.imageWrapper}>
                <View
                  style={[
                    styles.imageContainer,
                    { width: imageSize, height: imageSize },
                  ]}
                >
                  {pin && pin.image_url && (
                    <Image
                      source={{ uri: pin.image_url }}
                      style={styles.pinImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>

              {pin && (
                <View style={styles.detailsContainer}>
                  <Text
                    style={[styles.detailText, { fontSize: fontSize.detail }]}
                  >
                    <Text style={styles.detailLabel}>Name: </Text>
                    {pin.name || "Unknown"}
                  </Text>
                  <Text
                    style={[styles.detailText, { fontSize: fontSize.detail }]}
                  >
                    <Text style={styles.detailLabel}>Series: </Text>
                    {pin.series || "Unknown"}
                  </Text>
                  <Text
                    style={[styles.detailText, { fontSize: fontSize.detail }]}
                  >
                    <Text style={styles.detailLabel}>Origin: </Text>
                    {pin.origin || "Unknown"}
                  </Text>
                  <Text
                    style={[styles.detailText, { fontSize: fontSize.detail }]}
                  >
                    <Text style={styles.detailLabel}>Edition: </Text>
                    {pin.edition || "Unknown"}
                  </Text>
                  <Text
                    style={[styles.detailText, { fontSize: fontSize.detail }]}
                  >
                    <Text style={styles.detailLabel}>Release Date: </Text>
                    {pin.release_date || "Unknown"}
                  </Text>
                  <Text
                    style={[styles.detailText, { fontSize: fontSize.detail }]}
                  >
                    <Text style={styles.detailLabel}>Original Price: </Text>
                    {pin.original_price || "Unknown"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.moveSection}>
              <Text
                style={[styles.moveTitle, { fontSize: fontSize.title * 0.7 }]}
              >
                Move Pin to
              </Text>
              <View style={styles.moveButtons}>
                <TouchableOpacity
                  onPress={() => handelAddToUserCollections()}
                  style={styles.moveButton}
                >
                  <Image
                    source={require("../../assets/images/mycollection.png")}
                    style={styles.moveIcon}
                  />
                  <Text
                    style={[
                      styles.moveButtonText,
                      { fontSize: fontSize.button },
                    ]}
                  >
                    My Pin{"\n"}Board
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handelAddToMyWishBoard()}
                  style={styles.moveButton}
                >
                  <Image
                    source={require("../../assets/images/love.png")}
                    style={styles.moveIcon}
                  />
                  <Text
                    style={[
                      styles.moveButtonText,
                      { fontSize: fontSize.button },
                    ]}
                  >
                    My Wish{"\n"}Board
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handelAddToMyTradingBoard()}
                  style={styles.moveButton}
                >
                  <Image
                    source={require("../../assets/images/Trading_Board.png")}
                    style={styles.moveIcon}
                  />
                  <Text
                    style={[
                      styles.moveButtonText,
                      { fontSize: fontSize.button },
                    ]}
                  >
                    My Trading{"\n"}Board
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom gradient overlay */}
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
            style={styles.footerButton}
            onPress={() => navigation.navigate("Boards")}
          >
            <Image
              source={require("../../assets/images/mycollection.png")}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>My Boards</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to remove the pin?
            </Text>
            <View style={styles.buttonRow}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              {/* Remove Button */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemovePin}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    height: "20%",
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + (StatusBar.currentHeight > 24 ? 40 : 20)
        : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    right: 20,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  trashIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
  },
  card: {
    padding: 20,
    backgroundColor: "rgba(0, 28, 92, 0.6)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 20,
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
    borderRadius: 15,
  },
  detailsContainer: {
    gap: 8,
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
    marginBottom: 20,
  },
  moveTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  moveButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    zIndex: 2,
  },
  footerButton: {
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxWidth: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  removeButtonText: {
    color: "#3E55C6",
    fontWeight: "bold",
    fontSize: 16,
  },
});
