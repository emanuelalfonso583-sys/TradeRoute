import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ShipmentProvider } from './src/context/ShipmentContext';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.fondoWeb}>
          <View style={styles.contenidoWeb}>
            <AuthProvider>
              <ShipmentProvider>
                <StatusBar style="dark" />
                <AppNavigator />
              </ShipmentProvider>
            </AuthProvider>
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// En navegador/PC, la app se diseñó para pantalla de celular: sin este
// límite de ancho, se estira horrible sobre toda la ventana. En Android/iOS
// no cambia nada (ancho ya es el del teléfono).
const styles = StyleSheet.create({
  fondoWeb: Platform.select({
    web: { flex: 1, alignItems: 'center', backgroundColor: '#E2E8F0' },
    default: { flex: 1 },
  }),
  contenidoWeb: Platform.select({
    web: { flex: 1, width: '100%', maxWidth: 480 },
    default: { flex: 1 },
  }),
});
