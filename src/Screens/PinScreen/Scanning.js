import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axiosClient from "../../../apiClient";
import * as FileSystem from "expo-file-system";

const DisneyPinScanner = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 0.5, y: 0.5 }); // Default center
  const [cameraDimensions, setCameraDimensions] = useState({ width: 0, height: 0 });
  const [showFocusIndicator, setShowFocusIndicator] = useState(false);
  const [focusIndicatorPosition, setFocusIndicatorPosition] = useState({ x: 0, y: 0 });
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Request camera permissions
  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current || isLoading) return;

    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: true,
      });

      await uploadImage(photo.uri);
    } catch (error) {
      Alert.alert("Error", "Failed to capture image");
      setIsLoading(false);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axiosClient.post(
        "/api/pins/create-pin/",
        { image: `data:image/jpeg;base64,${base64Image}` },
        { timeout: 30000 }
      );

      navigation.navigate("PinIdentified", { data: response.data });
    } catch (error) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need access to your camera to scan pins
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentContainer}>
        {isFocused && (
          <CameraView
            ref={cameraRef}
            style={styles.cameraContainer}
            facing={facing}
            mode="picture"
            zoom={0}
            enableTorch={false}
            autoFocusPointOfInterest={focusPoint} // Set focus point
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setCameraDimensions({ width, height });
            }}
          >
            {/* Touch handler for tap-to-focus */}
            <TouchableWithoutFeedback
              onPress={(evt) => {
                if (cameraDimensions.width === 0 || cameraDimensions.height === 0) return;
                const { locationX, locationY } = evt.nativeEvent;
                const x = locationX / cameraDimensions.width;
                const y = locationY / cameraDimensions.height;
                setFocusPoint({ x, y });
                setFocusIndicatorPosition({ x: locationX, y: locationY });
                setShowFocusIndicator(true);
                setTimeout(() => setShowFocusIndicator(false), 1000);
              }}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            {/* Focus indicator */}
            {showFocusIndicator && (
              <View
                style={{
                  position: "absolute",
                  left: focusIndicatorPosition.x - 25,
                  top: focusIndicatorPosition.y - 25,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            )}

            {/* Scan Overlay */}
            <View style={[styles.overlay, { pointerEvents: "none" }]}>
              <View style={styles.scanArea}>
                <View style={[styles.scanCorner, styles.topLeft]} />
                <View style={[styles.scanCorner, styles.topRight]} />
                <View style={[styles.scanCorner, styles.bottomLeft]} />
                <View style={[styles.scanCorner, styles.bottomRight]} />
              </View>
            </View>

            {/* Loading Overlay */}
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Analyzing Pin...</Text>
              </View>
            )}
          </CameraView>
        )}

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
            disabled={isLoading}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Image
              source={require("../../assets/images/scanner.png")}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton}>
            <Image
              source={require("../../assets/images/mycollection.png")}
              style={styles.footerIcon}
            />
            <Text style={[styles.footerText, styles.disabledText]}>
              My Collection
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  contentContainer: {
    flex: 1,
  },
  cameraContainer: {
    marginTop: 100,
    height: "60%",
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    position: "relative",
  },
  scanCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    padding: 3,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 35,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#3E55C6",
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    zIndex: 2,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  footerText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "500",
  },
  disabledText: {
    color: "rgba(255,255,255,0.5)",
  },
});

export default DisneyPinScanner;