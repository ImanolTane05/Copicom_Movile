import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();


export function navigate(name, params) {
  if (navigationRef.isReady()) {
   
    navigationRef.navigate(name, params);
  } else {
    console.warn('❌ navigationRef no está listo. No se pudo navegar a:', name);
  }
}
