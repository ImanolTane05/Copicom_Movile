import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native'; 
import NewsListScreen from '../Noticias/screens/NewsListScreen';
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
        tabBarInactiveTintColor: 'gray',
        
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
      <Tab.Screen name="Noticias" component={NewsListScreen} />
      
      <Tab.Screen 
        name="Encuestas" 
        component={PollStack} 
        options={{ 
            headerShown: false
        }} 
      /> 
      
      <Tab.Screen name="Alertas" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 25, 
        left: 20, 
        right: 20, 
        elevation: 5, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: 30, 
        height: 65, 
        borderTopWidth: 0, 
        paddingBottom: 5, 
        paddingTop: 5,
    },
    tabBarLabel: {
        fontSize: 11,
    }
});

export default TabNavigator;