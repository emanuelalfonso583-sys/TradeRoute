import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import NewShipmentScreen from '../screens/NewShipmentScreen';
import ComparatorScreen from '../screens/ComparatorScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import HistorialScreen from '../screens/HistorialScreen';
import HistorialDetailScreen from '../screens/HistorialDetailScreen';
import AccountScreen from '../screens/AccountScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONOS_TAB = {
  Inicio: 'home',
  Analisis: 'stats-chart',
  Historial: 'document-text',
  Cuenta: 'person-circle',
};

function MainTabs() {
  const { colors } = useAppTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.action,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONOS_TAB[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: t('tab.inicio') }} />
      <Tab.Screen name="Analisis" component={AnalysisScreen} options={{ title: t('tab.analisis') }} />
      <Tab.Screen name="Historial" component={HistorialScreen} options={{ title: t('tab.historial') }} />
      <Tab.Screen name="Cuenta" component={AccountScreen} options={{ title: t('tab.cuenta') }} />
    </Tab.Navigator>
  );
}

function AppStack() {
  const { t } = useLanguage();
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primaryDark },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="NuevoEnvio"
        component={NewShipmentScreen}
        options={{ title: t('header.nuevoEnvio') }}
      />
      <Stack.Screen
        name="Comparador"
        component={ComparatorScreen}
        options={{ title: t('header.comparador') }}
      />
      <Stack.Screen
        name="Recomendacion"
        component={RecommendationScreen}
        options={{ title: t('header.recomendacion') }}
      />
      <Stack.Screen
        name="HistorialDetalle"
        component={HistorialDetailScreen}
        options={{ title: t('header.historialDetalle') }}
      />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Registro" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function PantallaCargando() {
  const { colors } = useAppTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.action} />
    </View>
  );
}

export default function AppNavigator() {
  const { usuario, cargandoSesion } = useAuth();

  return (
    <NavigationContainer>
      {cargandoSesion ? <PantallaCargando /> : usuario ? <AppStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
