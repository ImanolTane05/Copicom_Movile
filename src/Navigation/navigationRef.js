import { createNavigationContainerRef } from '@react-navigation/native';

// La referencia del contenedor (solo soporta @react-navigation/native v6+)
export const navigationRef = createNavigationContainerRef();

// Función que usas en notificationUtils.js
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    // ⭐️ El método .navigate() de la referencia soporta correctamente la sintaxis anidada:
    // navigate('Encuestas', { screen: 'PollDetail', params: {...} })
    navigationRef.navigate(name, params);
  } else {
    // Esto te ayuda a saber si el error fue porque el navegador no estaba listo.
    console.warn('❌ navigationRef no está listo. No se pudo navegar a:', name);
  }
}
