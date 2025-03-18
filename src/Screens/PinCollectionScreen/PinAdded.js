import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';

const PinCollectionScreen = () => {
    const navigation = useNavigation();
  return (
    <ImageBackground
      source={require('../../assets/images/realsky.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>My Collection</Text>
        <View style={styles.pinContainer}>
          <Text style={styles.pinTitle}>New Pin Added</Text>
          <View style={styles.pinBox}>
            <View style={styles.glowContainer}>
              <Image
                source={require('../../assets/images/desney.png')}
                style={styles.pinImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Blurry Spread Shadow Effect */}
      <View style={styles.shadowEffect} />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Image source={require('../../assets/images/scanner.png')} style={styles.footerIcon} />
          <Text style={styles.footerText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Image source={require('../../assets/images/mycollection.png')} style={styles.footerIcon} />
          <Text onPress={navigation.navigate('Boards')} style={[styles.footerText, { color: 'grey' }]}>My Collection</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pinContainer: {
    alignItems: 'center',
  },
  pinTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  glowContainer: {
    width: 328,
    height: 488,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 50, // More blur for softness
    elevation: 20,
    marginBottom: 10,
  },
  pinImage: {
    width: 231,
    height: 231,
    borderRadius: 40,
  },
  shadowEffect: {
    width: '100%',
    height: 140, // Increase this to make it spread more
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 }, // Negative value for bottom effect
    shadowOpacity: 1,

  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 8,
  },
  footerText: {
    color: 'white',
    fontSize: 21,
    fontWeight: '500',
  },
});

export default PinCollectionScreen;
