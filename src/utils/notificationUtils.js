// notificationUtils.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_BASE_URL } from './constants';
import { navigate } from '../Navigation/navigationRef'; // Esto usa el API de navegación

// ... (El resto de las funciones como setNotificationHandler, registerForPushNotificationsAsync, sendTokenToBackend permanecen igual) ...

// ✅ CONFIGURACIÓN PRINCIPAL
export async function setupNotifications() {
  const token = await registerForPushNotificationsAsync();
  if (token) sendTokenToBackend(token);

  // ✅ CUANDO LA NOTIFICACIÓN LLEGA (APP ABIERTA)
  Notifications.addNotificationReceivedListener(notification => {
    const data = notification?.request?.content?.data;
    console.log('📩 Notificación recibida:', data);
  });

  // ✅ CUANDO EL USUARIO TOCA LA NOTIFICACIÓN
  Notifications.addNotificationResponseReceivedListener(response => {
    const data = response?.notification?.request?.content?.data;

    console.log('📲 Notificación tocada:', data);

    if (!data) return;

    // ✅ ENCUESTAS
    if (data?.tipo === 'encuesta' && data?.encuestaId) {
      console.log('➡️ Navegando a encuesta:', data.encuestaId);

      // ⭐ ESTA ES LA NAVEGACIÓN ANIDADA CORRECTA:
      // Navega al Tab 'Encuestas', y dentro de ese Tab, a la pantalla 'PollDetail'.
      navigate('Encuestas', {
        screen: 'PollDetail',
        params: {
          encuestaId: data.encuestaId,
          titulo: data.titulo || 'Encuesta',
        },
      });
      return;
    }

    // ✅ NOTICIAS (Si está anidado similar a Encuestas, también debe usar la sintaxis de `screen`)
    if (data?.tipo === 'noticia' && data?.noticiaId) {
      console.log('➡️ Navegando a noticia:', data.noticiaId);

      // Si 'NewsStack' está montado en el Tab 'Noticias', usa la sintaxis anidada:
      navigate('Noticias', { // Asumiendo 'Noticias' es el Tab
        screen: 'NewsDetail', // Asumiendo 'NewsDetail' está dentro del Stack 'NewsStack'
        params: {
          noticiaId: data.noticiaId,
        },
      });
      return;
    }
  });
}