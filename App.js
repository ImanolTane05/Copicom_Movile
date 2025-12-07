import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/Navigation/TabNavigator';
import { setupNotifications } from './src/utils/notificationUtils';
import { navigationRef } from './src/Navigation/navigationRef';

export default function App() {

  useEffect(() => {
    console.log("✅ Inicializando sistema de notificaciones...");
    setupNotifications();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <TabNavigator />
    </NavigationContainer>
  );
}
