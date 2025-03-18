import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../Screens/Onboarding/OnboardingScreen';
import SignupScreen from '../Screens/Auth/SignupScreen';
import LoginScreen from '../Screens/Auth/LoginScreen';
import ForgotPasswordScreen from '../Screens/Auth/ForgotPasswordScreen';
import ResetPassword from '../Screens/Auth/ResetPassword';
import OtpCode from '../Screens/Auth/OtpCode';
import Scan from '../Screens/PinScreen/Scan';
import Scanning from '../Screens/PinScreen/Scanning';
import PinAdded from '../Screens/PinCollectionScreen/PinAdded';
import MyBoards from '../Screens/PinCollectionScreen/MyBoards';
import Boards from '../Screens/PinCollectionScreen/Boards';
import BoardDetails from '../Screens/PinCollectionScreen/Details';
import { AuthContext } from '../Screens/Auth/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import VerifyPhoneNumber from '../Screens/Auth/VerifyPhoneNumber';
import PinIdentified from '../Screens/PinCollectionScreen/PinIdentified';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
    <Stack.Screen name="SignupScreen" component={SignupScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="OtpCode" component={OtpCode} />
    <Stack.Screen name="VerifyPhoneNumber" component={VerifyPhoneNumber} />

  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Scan" component={Scan} />
    <Stack.Screen name="Scanning" component={Scanning} />
    <Stack.Screen name="PinIdentified" component={PinIdentified} />
    <Stack.Screen name="PinAdded" component={PinAdded} />
    <Stack.Screen name="Boards" component={Boards} />
    <Stack.Screen name="MyBoards" component={MyBoards} />
    <Stack.Screen name="BoardDetails" component={BoardDetails} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default MainNavigator;
