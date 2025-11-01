import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/Navigation/TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      {/* TabNavigator contiene las 3 pestañas principales (Noticias, Encuestas, Alertas) */}
      <TabNavigator />
    </NavigationContainer>
  );
}