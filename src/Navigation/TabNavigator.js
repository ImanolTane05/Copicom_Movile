import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native'; // Importamos StyleSheet

// Importa las pantallas
import NewsListScreen from '../Noticias/screens/NewsListScreen';
import PollStack from './PollStack'; // Asume que este Stack está en el mismo nivel
import NotificationsScreen from '../Notificaciones/screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#013D6B', // Color activo (Azul)
        tabBarInactiveTintColor: 'gray',
        
        // --- ESTILO DE BARRA PASTILLA ---
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        // --- FIN ESTILO ---

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

// Estilos para la barra de navegación "Pastilla"
const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute', // Flota sobre el contenido
        bottom: 25, // Margen inferior
        left: 20, // Margen izquierdo
        right: 20, // Margen derecho
        elevation: 5, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Blanco con ligera transparencia (efecto liquid/glass)
        borderRadius: 30, // Bordes redondeados para la forma de pastilla
        height: 65, // Altura de la barra
        borderTopWidth: 0, // Quita el borde superior por defecto
        paddingBottom: 5, 
        paddingTop: 5,
    },
    tabBarLabel: {
        fontSize: 11,
    }
});

export default TabNavigator;