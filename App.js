import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/Navigation/MainNavigator';
import {AuthProvider} from './src/Screens/Auth/AuthContext';
import {navigationRef} from './src/Navigation/NavigationService';

import {Alert, AndroidImportance} from 'react-native';


export default function MainApp() {

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
