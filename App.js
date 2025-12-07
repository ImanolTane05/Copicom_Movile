// App.js (CORREGIDO)
import React, { useEffect, useState, useCallback } from 'react'; // Agregamos useState y useCallback
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/Navigation/TabNavigator';
import { setupNotifications } from './src/utils/notificationUtils';
import { navigationRef } from './src/Navigation/navigationRef';

export default function App() {
  const [isNavigationReady, setNavigationReady] = useState(false);

  
  const handleNavigationReady = useCallback(() => {
    setNavigationReady(true);
    console.log("⭐ Contenedor de Navegación Listo. Inicializando Notificaciones...");
    setupNotifications();
  }, []);


  
  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={handleNavigationReady} 
    >
      <TabNavigator />
    </NavigationContainer>
  );
}