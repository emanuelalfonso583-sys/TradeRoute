import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import NewShipmentScreen from '../screens/NewShipmentScreen';
import ComparatorScreen from '../screens/ComparatorScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONOS_TAB = {
  Inicio: 'home',
  Analisis: 'stats-chart',
  Reportes: 'document-text',
  Configuracion: 'settings',
};

function AnalisisScreen() {
  return (
    <PlaceholderScreen
      icono="📊"
      titulo="Análisis"
      descripcion="Aquí verás métricas históricas y tendencias de tus envíos."
    />
  );
}

function ReportesScreen() {
  return (
    <PlaceholderScreen
      icono="📄"
      titulo="Reportes"
      descripcion="Aquí podrás generar y exportar reportes de comparación."
    />
  );
}

function ConfiguracionScreen() {
  return (
    <PlaceholderScreen
      icono="⚙️"
      titulo="Configuración"
      descripcion="Aquí podrás ajustar preferencias de la aplicación."
    />
  );
}

function MainTabs() {
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
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Analisis" component={AnalisisScreen} options={{ title: 'Análisis' }} />
      <Tab.Screen name="Reportes" component={ReportesScreen} />
      <Tab.Screen
        name="Configuracion"
        component={ConfiguracionScreen}
        options={{ title: 'Configuración' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
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
          options={{ title: 'Nuevo Envío' }}
        />
        <Stack.Screen
          name="Comparador"
          component={ComparatorScreen}
          options={{ title: 'Comparador' }}
        />
        <Stack.Screen
          name="Recomendacion"
          component={RecommendationScreen}
          options={{ title: 'Recomendación' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
