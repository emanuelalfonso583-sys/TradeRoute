import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ShipmentProvider } from './src/context/ShipmentContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ShipmentProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </ShipmentProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
