import React, { useEffect } from 'react'; // <-- Importa useEffect
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/Navigation/TabNavigator';
import { setupNotifications } from './src/utils/notificationUtils'; // <-- ¡Importa la función de setup!

export default function App() {

  // Llama a la función de configuración de notificaciones una sola vez al cargar
  useEffect(() => {
    console.log("Configurando notificaciones...");
    setupNotifications();
  }, []); // El array vacío asegura que se ejecute solo al montar el componente

  return (
    <NavigationContainer>
      {/* TabNavigator contiene las 3 pestañas principales (Noticias, Encuestas, Alertas) */}
      <TabNavigator />
    </NavigationContainer>
  );
}