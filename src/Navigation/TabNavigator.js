import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import NewsStack from './NewsStack';
import PollStack from './PollStack';
import NotificationsScreen from '../Notificaciones/screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#013D6B',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Noticias') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Encuestas') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Alertas') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Noticias" component={NewsStack} />

      <Tab.Screen
        name="Encuestas"
        component={PollStack}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen name="Alertas" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  /** 
   * 🔥 Barra más elegante, más pequeña y super centrada REAL
   * Funciona aunque tus pantallas tengan padding horizontal.
   */
  tabBar: {
    position: 'absolute',

    // 💫 MÁS SEPARACIÓN LATERAL REAL
    left: 60,
    right: 60,

    // 💫 Separación vertical perfecta
    bottom: 24,

    // 💫 Estética más compacta
    height: 54,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.93)',

    // Sombras estilo iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,

    borderTopWidth: 0,
    paddingBottom: 4,
    paddingTop: 4,
  },

  tabBarLabel: {
    fontSize: 10,
    marginBottom: 1,
    fontWeight: '500',
  },
});

export default TabNavigator;
